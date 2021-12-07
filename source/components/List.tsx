import React, { FC, useEffect, useState } from "react";
import { Text } from "ink";
import Table from "ink-table";
import { list } from "../commands/list";

const List: FC = () => {
	const loadingText = "😵‍💫 Loading....";
	const [text, setText] = useState(loadingText);
	const [data, setData] = useState<{ name: string; url: string }[]>();

	useEffect(() => {
		async function getFunctions() {
			if (text === loadingText) {
				try {
					setData(await list());
				} catch (error) {
					setText(`⛔️ ${(error as Error)?.message}`);
				}
			}
		}
		getFunctions();
	}, [text]);

	return data ? <Table data={data} /> : <Text>{text}</Text>;
};

module.exports = List;
export default List;
