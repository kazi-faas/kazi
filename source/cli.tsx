#!/usr/bin/env node

import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
	`
	Usage
	  $ kazi

	Options
		--name  Your name

	Examples
	  $ kazi --name=Jane
	  Hello, Jane
`,
	{
		flags: {
			name: {
				type: "string",
			},
		},
	}
);

render(<App input={cli.input} flags={cli.flags} />);
