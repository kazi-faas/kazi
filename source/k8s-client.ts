import * as k8s from "@kubernetes/client-node";
import { OptionsWithUrl } from "request";

interface ClusterCredential {
	skipTLSVerify: boolean;
	server?: string;
	token?: string;
	kubeconfig?: string;
	context?: string;
}

export interface ClusterCredentialWithNamespace {
	credential: ClusterCredential;
	namespace: string;
}

function initialiseKubeConfig({
	server,
	skipTLSVerify = true,
	token,
	kubeconfig,
	context,
}: ClusterCredential) {
	const kc = new k8s.KubeConfig();

	if (kubeconfig) {
		kc.loadFromString(kubeconfig);
	} else if (server && token) {
		const name = "kazi";
		const cluster = {
			name,
			server,
			skipTLSVerify,
		};
		const user = {
			name,
			token,
		};

		kc.loadFromClusterAndUser(cluster, user);
	} else {
		kc.loadFromDefault();
	}

	context && kc.setCurrentContext(context);
	return kc;
}

export function createClient(credential: ClusterCredential) {
	const kc = initialiseKubeConfig(credential);
	return k8s.KubernetesObjectApi.makeApiClient(kc);
}

export async function getAuthorizedRequestOptions({
	credential,
	namespace,
}: ClusterCredentialWithNamespace): Promise<OptionsWithUrl> {
	const kc = initialiseKubeConfig(credential);
	const baseUrl = credential.server ?? kc.getCurrentCluster()?.server;
	if (!baseUrl)
		throw new Error("Couldn't load the Kubernetes server value from config");

	const opts = {
		url: `${baseUrl}/apis/serving.knative.dev/v1/namespaces/${namespace}/services?labelSelector=kazi=function`,
	};

	await kc.applyToRequest(opts);
	return opts;
}
