import React, { FC, useEffect, useState } from "react";
import { TaskList, Task } from "ink-task-list";
import { useInput, Text } from "ink";
import {
	clone,
	install,
	createConfigFile,
	createPkgJson,
} from "../commands/create-project";

type State = "pending" | "loading" | "success" | "warning" | "error";
type List = Record<"install" | "create", { label: string; state: State }>;

const RegistryInput: FC<{
	onSubmit: (value: string) => void;
}> = ({ onSubmit }) => {
	const [value, setValue] = useState("");

	useInput((input, key) => {
		if (
			key.upArrow ||
			key.downArrow ||
			key.leftArrow || // this disables cursor change with left arrow
			key.rightArrow || // this disables cursor change with right arrow
			key.tab ||
			(key.shift && key.tab)
		) {
			return;
		} else if (key.backspace || key.delete) {
			setValue((prev) => prev.slice(0, -1));
		} else if (key.return) {
			onSubmit(value);
		} else setValue((prev) => prev + input);
	});

	return (
		<Text>Enter the registry namespace (e.g docker.io/pmbanugo): {value}</Text>
	);
};

const Create: FC<{
	input: string[];
	registryFlag?: string;
	useYarn?: boolean;
	workspaceInstall?: boolean;
}> = ({ input, registryFlag, useYarn, workspaceInstall }) => {
	const [tasks, setTasks] = useState<List>({
		create: { label: "Create the project", state: "loading" },
		install: { label: "Install project's dependencies", state: "pending" },
	});
	const [registry, setRegistry] = useState(registryFlag);

	const name = input[1];

	useEffect(() => {
		async function createProject() {
			if (name && registry && tasks.create.state === "loading") {
				await clone(name);
				await createConfigFile(name, registry);
				await createPkgJson(name);

				setTasks((state) => ({
					create: { ...state.create, state: "success" },
					install: { ...state.install, state: "loading" },
				}));

				await install(name, Boolean(useYarn), Boolean(workspaceInstall));
				setTasks((state) => ({
					...state,
					install: { ...state.install, state: "success" },
				}));
			}
		}

		createProject();
	}, [registry]);

	if (registry === undefined || registry === "") {
		return <RegistryInput onSubmit={setRegistry} />;
	}

	return (
		<TaskList>
			{Object.entries(tasks).map(([key, { label, state }]) => (
				<Task key={key} label={label} state={state} />
			))}
		</TaskList>
	);
};

module.exports = Create;
export default Create;
