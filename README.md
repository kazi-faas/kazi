# kazi - your serverless function tool for Knative

Serverless functions allow developers to quickly implement and deploy functionality that can be invoked via HTTP requests. This CLI enables easy development and deployment of serverless functions to Knative. 

> Knative provides reduced operational overhead, auto-scaling, automatic domain and TLS provisioning. Add functions to it, you get the features of serverless functions that has become popular and loved among developers.

## Install

```bash
$ npm install --global kazi
```

## Pre-requisite

1. Docker
2. pack CLI
3. Node 16.3.x (some commands may not run smoothly in versions below 16)

## CLI

```
$ kazi --help

  Usage
    $ kazi

  Options
    --name  Your name

  Examples
    $ kazi --name=Jane
    Hello, Jane
```
