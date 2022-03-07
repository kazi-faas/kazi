import React, { FC, useEffect, useState } from "react";
import { TaskList, Task } from "ink-task-list";
import { Box, Text, Newline } from "ink";
import { build, deploy } from "../commands/deploy";

type State = "pending" | "loading" | "success" | "warning" | "error";
type List = Record<"build" | "deploy", { label: string; state: State }>;

const Error: FC<{ error: string }> = ({ error }) => (
	<Box>
		<Text color="redBright">{error}</Text>
	</Box>
);

const Deploy: FC<{ context?: string; namespace?: string }> = ({
	context,
	namespace = "default",
}) => {
	const [service, setService] = useState<
		{ name: string; image: string } | undefined
	>();
	const [error, setError] = useState<string | undefined>();
	const [url, setUrl] = useState<string | undefined>();
	const [tasks, setTasks] = useState<List>({
		build: { label: "Build and publish image", state: "loading" },
		deploy: { label: "Deploy function", state: "pending" },
	});

	useEffect(() => {
		async function buildSourceCode() {
			if (tasks.build.state === "loading") {
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
				try {
					const url = await deploy({
						name: service.name,
						image: service.image,
						context,
						namespace,
					});

					setUrl(url);
					setTasks((state) => ({
						...state,
						deploy: { ...state.deploy, state: "success" },
					}));
				} catch (error) {
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
		<>
			<TaskList>
				{Object.entries(tasks).map(([key, { label, state }]) => (
					<Task key={key} label={label} state={state} />
				))}
			</TaskList>
			{url && (
				<Text>
					<Newline />
					<Text>Service {service?.name} deployed at: </Text>
					<Text color={"blue"}>{url}</Text>
				</Text>
			)}
		</>
	);
};

module.exports = Deploy;
export default Deploy;
