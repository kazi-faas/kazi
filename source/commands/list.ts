import got from "got";
import {
	getAuthorizedRequestOptions,
	ClusterCredentialWithNamespace,
} from "../k8s-client";

interface ServiceResponse {
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
}

export const list = async (
	credentialWithNamespace: ClusterCredentialWithNamespace
) => {
	const opts = await getAuthorizedRequestOptions(credentialWithNamespace);

	const response: ServiceResponse = await got(opts.url as string, {
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
};
