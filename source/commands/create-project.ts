import degit from "degit";
import { projectInstall } from "pkg-install";
import { join } from "path";
import { writeFile } from "fs/promises";

function stripPath(name: string) {
	//removes directory name if it's included.
	return name.split("/").pop();
}

export async function createConfigFile(name: string, registry: string) {
	const config = {
		name: stripPath(name),
		registry,
	};
	await writeFile(
		join(process.cwd(), name, "config.json"),
		JSON.stringify(config, null, 2)
	);
}

export async function createPkgJson(name: string) {
	const pkg = {
		name: stripPath(name),
		description: "A function which responds to HTTP requests",
		main: "index.js",
		scripts: {
			start: "micro",
			dev: "micro-dev",
			deploy: "kazi deploy",
		},
		dependencies: {
			micro: "^9.3.4",
		},
		devDependencies: {
			"micro-dev": "^3.0.0",
		},
	};

	await writeFile(
		join(process.cwd(), name, "package.json"),
		JSON.stringify(pkg, null, 2)
	);
}

export const clone = async (name: string) => {
	const emitter = degit("github:kazi-faas/function-template-js", {
		cache: true,
		force: false,
	});

	// emitter.on("info", (info) => {
	// 	console.info(info.message);
	// });
	// emitter.clone("path/to/dest").then()

	await emitter.clone(`./${name}`);
};

export const install = async (name: string, useYarn: boolean = false) => {
	const pkgManager = useYarn ? "yarn" : "npm";
	const dir = join(process.cwd(), name);

	await projectInstall({
		cwd: dir,
		prefer: pkgManager,
	});
};
