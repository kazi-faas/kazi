import React, { FC, useEffect, useState } from "react";
import { TaskList, Task } from "ink-task-list";
import { clone, install, createConfigFile } from "../commands/create-project";

type State = "pending" | "loading" | "success" | "warning" | "error";
type List = Record<"install" | "create", { label: string; state: State }>;

const CreateFunction: FC<{
	input: string[];
	flags?: Record<string, any>;
}> = ({ input, flags }) => {
	const [tasks, setTasks] = useState<List>({
		create: { label: "Create the project", state: "loading" },
		install: { label: "Install project's dependencies", state: "pending" },
	});

	const name = input[1];

	useEffect(() => {
		async function createProject() {
			if (name && tasks.create.state === "loading") {
				await clone(name);
				if (flags) {
					await createConfigFile(name, String(flags["registry"]));
				}
				// TODO: if no flags, ask user for required flags. This will perhaps require restructuring this component

				setTasks((state) => ({
					create: { ...state.create, state: "success" },
					install: { ...state.install, state: "loading" },
				}));
			}
		}
		createProject();
	});

	useEffect(() => {
		async function installDependencies() {
			if (
				name &&
				tasks.create.state === "success" &&
				tasks.install.state === "loading"
			) {
				await install(name);
				setTasks((state) => ({
					...state,
					install: { ...state.install, state: "success" },
				}));
			}
		}
		installDependencies();
	});

	return (
		<TaskList>
			{Object.entries(tasks).map(([key, { label, state }]) => (
				<Task key={key} label={label} state={state} />
			))}
		</TaskList>
	);
};

module.exports = CreateFunction;
export default CreateFunction;
