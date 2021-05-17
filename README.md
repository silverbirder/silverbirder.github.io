# Silver-birder.github.io

## Overview

![overview](./overview.png)

## Dev

```
$ npm install
$ npm run start
$ ngrok http 5000
$ BASE_URL=<ngrok> npm run build:dev
# Specify the blog name as a regular expression
$ BASE_URL=<ngrok> TARGET_BLOG_NAME="cloud_.*" npm run build:dev
```

## Prod

```
$ npm run build:prod
```
