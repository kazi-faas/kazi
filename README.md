# kazi - your serverless function tool for Knative

Serverless functions allow developers to quickly implement and deploy functionality that can be invoked via HTTP requests. This CLI enables easy development and deployment of serverless JS functions to Knative. Currently supports deploying only Node.js functions, but hopefully include a Deno runtime in the near future (perhaps you can sponsor this feature. Check out the [sponsors pages](#)

> Knative provides reduced operational overhead, auto-scaling, automatic domain and TLS provisioning. Add functions to it, you get the features of serverless functions that has become popular and loved among developers.

## Features

- **Standard:** The function runtime is just HTTP. It runs anywhere Node.js is supported!
- **Lightweight:** The function has just one dependency, which weighs less than 1MB.
- **Simple:** Designed for single purpose functions.
- **Easy:** Super easy deployment and containerization. Local development experience is the same as any Node.js application development.
- **JSON Parsing:** JSON parsing is opt-in.
- For local development, environment variables are automatically read from a `.env` file.
- For Kubernetes deployment, environment variables in `.env` is saved in a ConfigMap and used at runtime.

## Install The CLI

```bash
npm i -g @kazi-faas/cli
```

## Pre-requisite

1. Docker
2. pack CLI
3. Node 16.3.x (some commands may not run smoothly in versions below 16)
4. Kubectl (kazi uses the current context for authentication)

## Getting Started

This section will show you how quick it is to create and deploy a basic function that returns a JSON string value. The first thing to do is to install the CLI using the command `npm i -g @kazi-faas/cli`. After that's done, the CLI should be accessible with the `kazi` command. When you run `kazi` in the terminal without any commands or flags, it will print out the help text with a list of possible commands.

With the CLI installed, create a new function using the command below:

```bash
kazi create hello --registry=YOUR_REGISTRY_NAMESPACE
```

> Replace `YOUR_REGISTRY_NAMESPACE` with the URL to your container registry. For example, docker.io/pmbanugo.

A new Node project will be created in a directory called **hello**. In this directory, you have the following files.

```
config.json
index.js
package.json
```

The **config.json** file contains the configuration used to build and deploy the function. The **index.js** file is the entry point into the application. It exports a function that returns a string.

```javascript
module.exports = (req, res) => "Welcome to Kazi";
```

When the function runs, it'll return a 200 status code with the JSON string `Welcome to Kazi`.

Now, open your terminal and deploy the function by running the command `kazi deploy` from the project's path. This will build the project, push it to your container registry, and then deploy it to Knative. If it successfully deploys to Knative, you will see a success message and a URL to access to function.

![kazi deploy](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/va7fe3fd7vp1waegp1qy.png)

Now open the URL in a browser and you should see `Welcome to Kazi` displayed as a response. That's how quick it takes to create and deploy a function.

### Function Configuration

There's not so much you can customise for the project at the moment. The _config.json_ file only stores the name for the function and the container registry.

The function API is based on [micro](https://github.com/vercel/micro). You can check the documentation for how to [read the request body](https://github.com/vercel/micro#body-parsing), or the available [APIs](https://github.com/vercel/micro#api). There will be more extensions custom to kazi in the future, so keep an eye for that 😉.

## Environment Variables

The function can read environment variables from a **.env**. The values are automatically loaded when running locally (using `npm run dev`), and are automatically uploaded to your Kubernetes cluster as a ConfigMap object, which is then loaded when the container starts. Therefore, you need not do any magic to get environment variable working locally or in the cluster.

## Tutorials

- [From AWS Lambda & API Gateway To Knative & Kong API Gateway](https://www.pmbanugo.me/blog/2022-02-13-from-aws-lambda-api-gateway-to-knative-kong-api-gateway/)

## CLI

```
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

	Examples
		$ kazi deploy
		$ kazi deploy -c docker-desktop
```

## Contributing

This repo is still a work in progress, so contributiong rules might change. But you're free to send PR, see [RELEASE doc](/RELEASE.md) for release information and [CONTRIBUTING](#) for contributiong guideline.
