import { TypedFlags } from "meow";

export interface CredentialWithNamespace {
	credential: {
		context?: string;
		kubeconfig?: string;
		server?: string;
		token?: string;
		skipTLSVerify?: boolean;
	};
	namespace?: string;
}

export type LoadingState =
	| "pending"
	| "loading"
	| "success"
	| "warning"
	| "error";

export interface AppProps {
	input: string[];
	flags?: TypedFlags<{
		registry: {
			type: "string";
			alias: "r";
		};
		useYarn: {
			type: "boolean";
		};
		workspaceInstall: {
			type: "boolean";
		};
		context: {
			type: "string";
			alias: "c";
		};
		namespace: {
			type: "string";
			alias: "n";
		};
		server: {
			type: "string";
		};
		token: {
			type: "string";
		};
		kubeconfig: {
			type: "string";
		};
		skipTlsVerify: {
			type: "boolean";
		};
	}>;
}
