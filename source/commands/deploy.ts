import * as k8s from "@kubernetes/client-node";
import util from "util";
import { exec } from "child_process";
import { readFile } from "fs/promises";

async function getConfig() {
	return readFile("./config.json", "utf8").then((config) => JSON.parse(config));
}

export const build = async () => {
	const { name, registry } = await getConfig();
	const image = registry + "/" + name;

	const execAsync = util.promisify(exec);
	const { stdout, stderr } = await execAsync(
		`pack build ${image} --builder paketobuildpacks/builder:base --quiet --publish`
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
		metadata: { name },
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
		console.log(JSON.stringify({ status: (body as any).status }, null, 2));
		console.log("updating function");
		await client.replace(payload); // maybe this will work but patch didn't work
		console.log("updated function");

		return (body as any)?.status?.address;
	} catch (e) {
		await client.create(payload);
		console.log("Service created");

		const { body } = await client.read(payload);
		console.log("Getting service status");
		console.log(JSON.stringify({ body }, null, 2));

		return (body as any)?.status?.address;
	}
};
