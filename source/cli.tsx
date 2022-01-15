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
	},
});

render(<App input={cli.input} flags={cli.flags} />);
