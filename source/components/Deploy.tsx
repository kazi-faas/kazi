import React, { FC, useEffect, useState } from "react";
import { TaskList, Task } from "ink-task-list";
import { Box, Text } from "ink";
import { build, deploy } from "../commands/deploy";

type State = "pending" | "loading" | "success" | "warning" | "error";
type List = Record<"build" | "deploy", { label: string; state: State }>;

const Error: FC<{ error: string }> = ({ error }) => (
	<Box>
		<Text color="redBright">{error}</Text>
	</Box>
);

const Deploy: FC = () => {
	const [service, setService] = useState<
		{ name: string; image: string } | undefined
	>();
	const [error, setError] = useState<string | undefined>();
	const [tasks, setTasks] = useState<List>({
		build: { label: "Build source code", state: "loading" },
		deploy: { label: "Deploy function", state: "pending" },
	});

	useEffect(() => {
		async function buildSourceCode() {
			if (tasks.build.state === "loading") {
				console.info("Building CODE");
				console.log({ service, tasks });

				try {
					const result = await build();
					setService(result);
					setTasks((state) => ({
						build: { ...state.build, state: "success" },
						deploy: { ...state.deploy, state: "loading" },
					}));
				} catch (error) {
					setError(String(error));
				}
			}
		}
		buildSourceCode();
	}, [tasks]);

	useEffect(() => {
		async function deployService() {
			if (
				service &&
				tasks.build.state === "success" &&
				tasks.deploy.state === "loading"
			) {
				console.info("DEPLOYING SERVICE");
				console.log({ service, tasks });

				try {
					const url = await deploy(service.name, service.image);
					console.log("here's your URL: ", url);

					setTasks((state) => ({
						...state,
						deploy: { ...state.deploy, state: "success" },
					}));
				} catch (error) {
					console.log({ error });
					setTasks((state) => ({
						...state,
						deploy: { ...state.deploy, state: "error" },
					}));
					setError(JSON.stringify(error));
				}
			}
		}
		deployService();
	}, [service, tasks]);

	return error ? (
		<Error error={error} />
	) : (
		<TaskList>
			{Object.entries(tasks).map(([key, { label, state }]) => (
				<Task key={key} label={label} state={state} />
			))}
		</TaskList>
	);
};

module.exports = Deploy;
export default Deploy;
