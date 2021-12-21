import React, { FC } from "react";
import { Text } from "ink";
import Create from "./components/Create";
import Deploy from "./components/Deploy";
import List from "./components/List";
import { helpText } from "./meow-util";

const App: FC<{ input: string[]; flags?: Record<string, unknown> }> = ({
	input,
	flags,
}) => {
	if (input.length === 2 && input[0] === "create") {
		return <Create input={input} flags={flags} />;
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
