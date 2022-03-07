import * as k8s from "@kubernetes/client-node";
import util from "util";
import { exec } from "child_process";
import { readFile, access } from "fs/promises";

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

async function getReadiness(
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
	const url = await promise;

	return String(url);
}

async function getConfig() {
	return readFile("./config.json", "utf8").then((config) => JSON.parse(config));
}

async function hasEnv() {
	try {
		await access("./.env");
		return true;
	} catch {
		return false;
	}
}

async function getEnv() {
	const env = await readFile("./.env", "utf8");
	return env.split("\n").reduce((prev: { [key: string]: string }, current) => {
		if (current.length > 2 && current.includes("=")) {
			const [key, ...value] = current.split("=");
			if (key !== undefined && value !== undefined) {
				prev[key] = value.join("=");
			}
		}

		return prev;
	}, {});
}

async function createConfigMap(
	name: string,
	env: { [key: string]: string },
	k8sClient: k8s.KubernetesObjectApi
) {
	const configMapName = `ksvc-${name}`;
	const configMap = {
		kind: "ConfigMap",
		apiVersion: "v1",
		metadata: {
			name: configMapName,
			labels: {
				kazi: "function",
			},
		},
		data: env,
	};

	try {
		// try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
		// block.
		const { body } = await k8sClient.read(configMap);
		const updatedConfigMap = {
			...body,
			data: env,
		};

		await k8sClient.replace(updatedConfigMap);
	} catch (e) {
		await k8sClient.create(configMap);
	}
	return configMapName;
}

async function createService(
	{
		name,
		image,
		namespace,
		configMapName,
	}: {
		name: string;
		image: string;
		namespace: string;
		configMapName?: string;
	},
	k8sClient: k8s.KubernetesObjectApi
) {
	const useConfigMap = configMapName !== undefined;
	const functionContainer = {
		image,
		envFrom: useConfigMap
			? [
					{
						configMapRef: {
							name: configMapName,
						},
					},
			  ]
			: undefined,
		ports: [{ containerPort: 3000 }],
	};

	const payload = {
		apiVersion: "serving.knative.dev/v1",
		kind: "Service",
		metadata: {
			name,
			namespace,
			labels: {
				kazi: "function",
			},
		},
		spec: {
			template: {
				spec: {
					containers: [functionContainer],
				},
			},
		},
	};

	try {
		// try to get the resource, if it does not exist an error will be thrown and we will end up in the catch
		// block.
		const { body } = await k8sClient.read(payload);
		const updatePayload = {
			...body,
			spec: {
				template: {
					spec: { containers: [{ image, ports: [{ containerPort: 3000 }] }] },
				},
			},
		};

		await k8sClient.replace(updatePayload);

		return getReadiness(k8sClient, payload);
	} catch (e) {
		await k8sClient.create(payload);
		return getReadiness(k8sClient, payload);
	}
}

export const build = async () => {
	const { name, registry } = await getConfig();
	const image = registry + "/" + name;

	const execAsync = util.promisify(exec);
	// Enable Heap Memory Optimization for Node.js using BP_NODE_OPTIMIZE_MEMORY env variable.
	// See https://paketo.io/docs/howto/nodejs/#enable-heap-memory-optimization for more info
	const { stdout, stderr } = await execAsync(
		`pack build ${image} --buildpack gcr.io/paketo-buildpacks/nodejs --builder paketobuildpacks/builder:base --env BP_NODE_OPTIMIZE_MEMORY=true --quiet --publish`
	);

	if (stderr) {
		throw stderr;
	}

	return { name, image: stdout.replace("\n", "") };
};

export const deploy = async ({
	name,
	image,
	namespace,
	context,
}: {
	name: string;
	image: string;
	context?: string;
	namespace: string;
}) => {
	const kc = new k8s.KubeConfig();
	kc.loadFromDefault();
	context && kc.setCurrentContext(context);
	const client = k8s.KubernetesObjectApi.makeApiClient(kc);

	const shouldCreateConfigMap = await hasEnv();
	let configMapName: string | undefined;

	if (shouldCreateConfigMap) {
		const env = await getEnv();
		configMapName = await createConfigMap(name, env, client);
	}

	const serviceData = { name, image, configMapName, namespace };
	return createService(serviceData, client);
};
