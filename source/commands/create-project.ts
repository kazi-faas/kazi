import degit from "degit";
import { install as pkgInstall } from "pkg-install";
import writePackage = require("write-pkg");
import { join } from "path";
import { writeFile } from "fs/promises";

export async function createConfigFile(name: string, registry: string) {
	const config = {
		name,
		registry,
	};
	await writeFile(
		join(process.cwd(), name, "config.json"),
		JSON.stringify(config, null, 2)
	);
}

async function setProjectName(name: string) {
	const pkg = {
		name,
		description: "A function which responds to HTTP requests",
		main: "index.js",
		scripts: {
			start: "micro",
			dev: "micro-dev",
		},
	};

	return writePackage(join(process.cwd(), name, "package.json"), pkg);
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

export const install = async (name: string) => {
	await setProjectName(name);
	const dir = join(process.cwd(), name);

	const installDeps = pkgInstall(
		{
			micro: "^9.3.4",
		},
		{
			cwd: dir,
			prefer: "npm",
		}
	);
	const installDevDeps = pkgInstall(
		{
			"micro-dev": "^3.0.0",
		},
		{
			cwd: dir,
			prefer: "npm",
			dev: true,
		}
	);

	await Promise.all([installDeps, installDevDeps]);
};
