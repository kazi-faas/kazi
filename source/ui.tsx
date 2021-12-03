import React, { FC } from "react";
import { Text } from "ink";
import CreateFunction from "./components/CreateFunction";
import Deploy from "./components/Deploy";

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
