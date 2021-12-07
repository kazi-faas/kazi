import * as k8s from "@kubernetes/client-node";
import util from "util";
import { exec } from "child_process";
import { readFile } from "fs/promises";

type KService = k8s.KubernetesObject & {
	status: {
		url?: string;
		conditions: Array<{
			type: string;
			status: "Unknown" | "True" | "False";
			reason?: string;
			message?: string;
			lastTransitionTime?: string;
		}>;
	};
};

interface KServicePayload {
	apiVersion: string;
	kind: string;
	metadata: {
		name: string;
	};
	spec: {
		template: {
			spec: {
				containers: {
					image: string;
					ports: {
						containerPort: number;
					}[];
				}[];
			};
		};
	};
}

const isReady = (k8sObject: KService) =>
	k8sObject.status.conditions.every((condition) => condition.status === "True");

const hasErrors = (k8sObject: KService) =>
	k8sObject.status.conditions.some((condition) => condition.status === "False");

async function checkReadiness(
	client: k8s.KubernetesObjectApi,
	payload: KServicePayload
) {
	const { body } = await client.read(payload);

	const promise = new Promise((resolve, reject) => {
		const url = (body as KService)?.status?.url;
		if (url && isReady(body as KService)) {
			resolve(url);
		}

		let intervalId: NodeJS.Timer;

		intervalId = setInterval(async () => {
			const { body } = await client.read(payload);
			const url = (body as KService)?.status?.url;

			if (url && isReady(body as KService)) {
				clearInterval(intervalId);
				resolve(url);
			} else if (hasErrors(body as KService)) {
				clearInterval(intervalId);
				reject("There was an error with the deployment.");
			}
		}, 2000);
	});

	return promise;
}

async function getConfig() {
	return readFile("./config.json", "utf8").then((config) => JSON.parse(config));
}

export const build = async () => {
	const { name, registry } = await getConfig();
	const image = registry + "/" + name;

	const execAsync = util.promisify(exec);
	const { stdout, stderr } = await execAsync(
		`pack build ${image} --buildpack gcr.io/paketo-buildpacks/nodejs --builder paketobuildpacks/builder:base --quiet --publish`
	);

	if (stderr) {
		throw stderr;
	}

	return { name, image: stdout.replace("\n", "") };
};

export const deploy = async (name: string, image: string) => {
	const payload = {
		apiVersion: "serving.knative.dev/v1",
		kind: "Service",
		metadata: {
			name,
			labels: {
				kazi: "function",
			},
		},
		spec: {
			template: {
				spec: { containers: [{ image, ports: [{ containerPort: 3000 }] }] },
			},
		},
	};

	const kc = new k8s.KubeConfig();
	kc.loadFromDefault();
	const client = k8s.KubernetesObjectApi.makeApiClient(kc);

	//TODO: Refactor later?
	try {
		// try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
		// block.
		const { body } = await client.read(payload);
		const updatePayload = {
			...body,
			spec: {
				template: {
					spec: { containers: [{ image, ports: [{ containerPort: 3000 }] }] },
				},
			},
		};

		await client.replace(updatePayload);

		return checkReadiness(client, payload);
	} catch (e) {
		await client.create(payload);

		return checkReadiness(client, payload);
	}
};
