export const helpText = `
Commands
  $ kazi create: Scaffold a new project
  $ kazi list: List the functions deployed using kazi
  $ kazi deploy: Deploy a function (only works if you're inside the function's directory)
  $ kazi --help: Show help text

Usage
  Command: kazi create <Function_Name>

	Options: kazi create
	--registry (-r):  Your registry namespace (REQUIRED)
    --use-yarn: Use Yarn to install dependencies (default: false)
    --workspace-install: Used to install the dependencies in a workspace i.e using the workspace's node_modules(default: false).

	Examples
	$ kazi create hello --registry=docker.io/pmbanugo

  Command: kazi deploy

	Options: kazi deploy
	--context (-c): Specify the context to use for the deployment (OPTIONAL)
    --namespace (-n): Specify the namespace to deploy into (OPTIONAL)
    --kubeconfig: Specify the KUBECONFIG YAML string to use for authentication (OPTIONAL)
    --server: Specify the Kubernetes API Server URL (OPTIONAL)
    --token: Specify the authentication token of a service account (OPTIONAL)
	--skip-tls-verify: Skip verifying TLS certificate of the API server

	Examples
	$ kazi deploy
	$ kazi deploy -c docker-desktop
	$ kazi deploy -c docker-desktop -n default

  Command: kazi deploy

	Options: kazi deploy
	--context (-c): Specify the context to use for the deployment (OPTIONAL)
    --namespace (-n): Specify the namespace to deploy into (OPTIONAL)
    --kubeconfig: Specify the KUBECONFIG YAML string to use for authentication (OPTIONAL)
    --server: Specify the Kubernetes API Server URL (OPTIONAL)
    --token: Specify the authentication token of a service account (OPTIONAL)
	--skip-tls-verify: Skip verifying TLS certificate of the API server (OPTIONAL)

	Examples
	$ kazi deploy
	$ kazi deploy -c docker-desktop
	$ kazi deploy -c docker-desktop -n default

	Command: kazi list

	Options: kazi deploy
	--context (-c): Specify the context to use for the deployment (OPTIONAL)
    --namespace (-n): Specify the namespace to deploy into (OPTIONAL)
    --kubeconfig: Specify the KUBECONFIG YAML string to use for authentication (OPTIONAL)
    --server: Specify the Kubernetes API Server URL (OPTIONAL)
    --token: Specify the authentication token of a service account (OPTIONAL)
	--skip-tls-verify: Skip verifying TLS certificate of the API server (OPTIONAL)

	Examples
	$ kazi list
	$ kazi list -c docker-desktop
	$ kazi list -n default
`;
