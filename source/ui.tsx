import React, { FC } from "react";
import { Text } from "ink";
import Create from "./components/Create";
import Deploy from "./components/Deploy";
import List from "./components/List";
import { helpText } from "./meow-util";
import { TypedFlags } from "meow";

const App: FC<{
	input: string[];
	flags?: TypedFlags<{
		registry: {
			type: "string";
		};
	}>;
}> = ({ input, flags }) => {
	if (input.length === 2 && input[0] === "create") {
		return <Create input={input} registryFlag={flags?.registry} />;
	}
	if (input.length === 1 && input[0] === "list") {
		return <List />;
	}

	if (input.length === 1 && input[0] === "deploy") {
		return <Deploy />;
	}

	return <Text>{helpText}</Text>;
};

module.exports = App;
export default App;
