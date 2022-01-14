export const helpText = `
Commands
  $ kazi create: Scaffold a new project
  $ kazi list: List the functions deployed using kazi
  $ kazi deploy: Deploy a function (only works if you're inside the function's directory)
	$ kazi --help: Show help text

Usage
  $ kazi create <Function_Name>

Options
  --registry (-r),  Your registry namespace
	--use-yarn, Use Yarn to install dependencies

Examples
  $ kazi create hello --registry=docker.io/pmbanugo
`;
