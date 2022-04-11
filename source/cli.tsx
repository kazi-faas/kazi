#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";
import { helpText } from "./meow-util";

const cli = meow(helpText, {
	flags: {
		registry: {
			type: "string",
			alias: "r",
		},
		useYarn: {
			type: "boolean",
			default: false,
		},
		workspaceInstall: {
			type: "boolean",
			default: false,
		},
		context: {
			type: "string",
			alias: "c",
		},
		namespace: {
			type: "string",
			alias: "n",
			default: "default",
		},
		server: {
			type: "string",
		},
		token: {
			type: "string",
		},
		kubeconfig: {
			type: "string",
		},
		skipTlsVerify: {
			type: "boolean",
			default: false,
		},
	},
});

render(<App input={cli.input} flags={cli.flags} />);
