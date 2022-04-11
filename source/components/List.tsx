import React, { useEffect, useState } from "react";
import { Text } from "ink";
import Table from "ink-table";
import { list } from "../commands/list";
import { CredentialWithNamespace } from "./prop-types";

const List = ({
	credential,
	namespace = "default",
}: CredentialWithNamespace) => {
	const loadingText = "😵‍💫 Loading....";
	const [text, setText] = useState(loadingText);
	const [data, setData] = useState<{ name: string; url: string }[]>();

	useEffect(() => {
		async function getFunctions() {
			if (text === loadingText) {
				try {
					setData(
						await list({
							credential: {
								...credential,
								skipTLSVerify: credential.skipTLSVerify ?? false,
							},
							namespace,
						})
					);
				} catch (error) {
					setText(`⛔️ ${(error as Error)?.message}`);
				}
			}
		}
		getFunctions();
	}, [text]);

	return data ? (
		data.length > 0 ? (
			<Table data={data} />
		) : (
			<Text>You haven't deployed any function.</Text>
		)
	) : (
		<Text>{text}</Text>
	);
};

module.exports = List;
export default List;
