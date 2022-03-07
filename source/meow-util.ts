export const helpText = `
Commands
  $ kazi create: Scaffold a new project
  $ kazi list: List the functions deployed using kazi
  $ kazi deploy: Deploy a function (only works if you're inside the function's directory)
	$ kazi --help: Show help text

Usage
  Command: kazi create <Function_Name>

	Options: kazi create
		--registry (-r),  Your registry namespace (REQUIRED)
    --use-yarn, Use Yarn to install dependencies (default: false)
    --workspace-install, Used to install the dependencies in a workspace i.e using the workspace's node_modules(default: false).

	Examples
		$ kazi create hello --registry=docker.io/pmbanugo

  Command: kazi deploy

	Options: kazi deploy
		--context (-c), specify the context to use for the deployment (OPTIONAL)
    --namespace (-n), specify the namespace to deploy into (OPTIONAL)

	Examples
		$ kazi deploy
		$ kazi deploy -c docker-desktop
		$ kazi deploy -c docker-desktop -n default
`;
