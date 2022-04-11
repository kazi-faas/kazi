import React from "react";
import { Text } from "ink";
import Create from "./components/Create";
import Deploy from "./components/Deploy";
import List from "./components/List";
import { helpText } from "./meow-util";
import { AppProps } from "./components/prop-types";

const App = ({ input, flags }: AppProps) => {
	if (input.length === 2 && input[0] === "create") {
		return (
			<Create
				input={input}
				registryFlag={flags?.registry}
				useYarn={flags?.useYarn}
				workspaceInstall={flags?.workspaceInstall}
			/>
		);
	}
	if (input.length === 1 && input[0] === "list") {
		return (
			<List
				credential={{
					context: flags?.context,
					kubeconfig: flags?.kubeconfig,
					server: flags?.server,
					skipTLSVerify: flags?.skipTlsVerify,
					token: flags?.token,
				}}
				namespace={flags?.namespace}
			/>
		);
	}

	if (input.length === 1 && input[0] === "deploy") {
		return (
			<Deploy
				credential={{
					context: flags?.context,
					kubeconfig: flags?.kubeconfig,
					server: flags?.server,
					skipTLSVerify: flags?.skipTlsVerify,
					token: flags?.token,
				}}
				namespace={flags?.namespace}
			/>
		);
	}

	return <Text>{helpText}</Text>;
};

module.exports = App;
export default App;
