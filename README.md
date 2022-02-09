# kazi - your serverless function tool for Knative

Serverless functions allow developers to quickly implement and deploy functionality that can be invoked via HTTP requests. This CLI enables easy development and deployment of serverless JS functions to Knative. Currently supports deploying only Node.js functions, but hopefully include a Deno runtime in the near future (perhaps you can sponsor this feature. Check out the [sponsors pages](#)

> Knative provides reduced operational overhead, auto-scaling, automatic domain and TLS provisioning. Add functions to it, you get the features of serverless functions that has become popular and loved among developers.

## Features

- **Standard:** The function runtime is just HTTP. It runs anywhere Node.js is supported!
- **Lightweight:** The function has just one dependency, which weighs less than 1MB.
- **Simple:** Designed for single purpose functions.
- **Easy:** Super easy deployment and containerization. Local development experience is the same as any Node.js application development.
  - For local development, environment variables are automatically read from a `.env` file.
  - For Kubernetes deployment, environment variables from `.env` is saved in a ConfigMap and used at runtime.
  - JSON parsing is opt-in.

## Install

```bash
$ npm install -g kazi
```

## Pre-requisite

1. Docker
2. pack CLI
3. Node 16.3.x (some commands may not run smoothly in versions below 16)

## CLI

```
Commands
  $ kazi create: Scaffold a new project
  $ kazi list: List the functions deployed using kazi
  $ kazi deploy: Deploy a function (only works if you're inside the function's directory)
	$ kazi --help: Show help text

Usage
  $ kazi create <Function_Name>

Options
  --registry (-r),  Your registry namespace
	--use-yarn, Use Yarn to install dependencies (default: false)
	--skip-install, Skip installing the dependencies (default: false)

Examples
  $ kazi create hello --registry=docker.io/pmbanugo
```

## Contributing

This repo is still a work in progress, so contributiong rules might change. But you're free to send PR, see [RELEASE doc](/RELEASE.md) for release information and [CONTRIBUTING](#) for contributiong guideline.
