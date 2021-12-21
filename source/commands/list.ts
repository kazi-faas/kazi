import * as k8s from "@kubernetes/client-node";
import got from "got";

type ServiceResponse = {
	items: [
		{
			metadata: {
				name: string;
				labels: {
					[index: string]: string;
				};
			};
			status: {
				url: string;
			};
		}
	];
};

export const list = async () => {
	const kc = new k8s.KubeConfig();
	kc.loadFromDefault();
	const server = kc.getCurrentCluster()?.server;

	if (server) {
		const NAMESPACE = "default";
		const opts: any = {
			url: `${server}/apis/serving.knative.dev/v1/namespaces/${NAMESPACE}/services?labelSelector=kazi=function`,
		};
		await kc.applyToRequest(opts);

		const response: ServiceResponse = await got(opts.url, {
			headers: opts.headers,
			https: {
				certificate: opts.cert,
				certificateAuthority: opts.ca,
				key: opts.key,
				rejectUnauthorized: false,
			},
		}).json();

		const result = response.items
			.filter((x) => x.metadata.labels?.["kazi"] === "function")
			.map((x) => ({
				name: x.metadata.name,
				url: x?.status?.url,
			}));

		return result;
	} else
		throw new Error("Couldn't load the Kubernetes server value from config");
};
