import React, { FC } from "react";
import { Text } from "ink";
import CreateFunction from "./components/CreateFunction";
import Deploy from "./components/Deploy";
import List from "./components/List";

const App: FC<{ input: string[]; flags?: Record<string, unknown> }> = ({
	input,
	flags,
}) => {
	if (input.length === 0) {
		return (
			<Text>
				⛔️ Invalid command. Use --help to learn about the available commands
			</Text>
		);
	}

	if (input.length === 2 && input[0] === "create") {
		return <CreateFunction input={input} flags={flags} />;
	}
	if (input[0] === "function" && input[1] === "list") {
		return <List />;
	}

	if (input.length === 1 && input[0] === "deploy") {
		return <Deploy />;
	}

	return (
		<Text>
			Hello, <Text color="green">{"World!"}</Text>
		</Text>
	);
};

module.exports = App;
export default App;
