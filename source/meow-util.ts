export const helpText = `
Commands
  $ kazi create: Scaffold a new project
  $ kazi list: List the functions deployed using kazi
  $ kazi deploy: Deploy a function (only works if you're inside the function's directory)
	$ kazi --help: Show help text

Usage
  $ kazi create <Function_Name>

Options: kazi create
  --registry (-r),  Your registry namespace
  --use-yarn, Use Yarn to install dependencies (default: false)
  --workspace-install, Used to install the dependencies in a workspace i.e using the workspace's node_modules(default: false).

Examples
  $ kazi create hello --registry=docker.io/pmbanugo
`;
