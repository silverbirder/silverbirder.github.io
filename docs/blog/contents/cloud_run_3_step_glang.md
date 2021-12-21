---
title: Cloud Runをたった3ステップでデプロイしてみた (golang)
published: true
date: 2019-04-11
description: Cloud Run とは？ Cloud Run is a managed compute platform that enables you to run stateless containers that are invocable via HTTP requests. Cloud Run is serverless ※ https://cloud.google.com/run/ 詳しくは割愛するが、Cloud FunctionsやApp Engineと同じようなサーバーレスで動作するもの。コンテナをdeployするため、GKEから制御することもできる。
tags: ["GCP", "Cloud Run", "Golang", "Deploy"]
cover_image: https://japan.zdnet.com/storage/2019/04/10/2f758123dc855c1aa3533aea8d507950/190410-abrigednews-02-google-devops-with-serverless.png
socialMediaImage: https://japan.zdnet.com/storage/2019/04/10/2f758123dc855c1aa3533aea8d507950/190410-abrigednews-02-google-devops-with-serverless.png
---

# Cloud Run とは？

> Cloud Run is a managed compute platform that enables you to run stateless containers that are invocable via HTTP requests. Cloud Run is serverless

※ [https://cloud.google.com/run/](https://cloud.google.com/run/)

詳しくは割愛するが、Cloud FunctionsやApp Engineと同じようなサーバーレスで動作するもの。
コンテナをdeployするため、GKEから制御することもできる。

<figure title="Cloud Run Deploy">
<img alt="Cloud Run Deploy" src="https://japan.zdnet.com/storage/2019/04/10/2f758123dc855c1aa3533aea8d507950/190410-abrigednews-02-google-devops-with-serverless.png">
<figcaption><a href="https://japan.zdnet.com/article/35135525/">Cloud Run Deploy</a></figcaption>
</figure>

# デプロイしてみた

[https://cloud.google.com/run/docs/quickstarts/build-and-deploy](https://cloud.google.com/run/docs/quickstarts/build-and-deploy)

を参考に進めていく。

ちなみに、動作環境は下記コンテナ内に行う。

[https://hub.docker.com/r/google/cloud-sdk](https://hub.docker.com/r/google/cloud-sdk)

## step1. gcloudの各種設定

```shell 
$ gcloud components update
$ gcloud components install beta
$ gcloud config set run/region us-central1
```

※ 2019/04/11時点では、Cloud Runはbeta.

## step2. アプリケーションコードの作成

```shell
$ mkdir helloworld-go && cd helloworld-go
$ touch helloworld.go Dockerfile
```

```go
package main

import (
        "fmt"
        "log"
        "net/http"
        "os"
)

func handler(w http.ResponseWriter, r *http.Request) {
        log.Print("Hello world received a request.")
        target := os.Getenv("TARGET")
        if target == "" {
                target = "World"
        }
        fmt.Fprintf(w, "Hello %s!\n", target)
}

func main() {
        log.Print("Hello world sample started.")

        http.HandleFunc("/", handler)

        port := os.Getenv("PORT")
        if port == "" {
                port = "8080"
        }

        log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
```

```Dockerfile
# Use the offical Golang image to create a build artifact.
# This is based on Debian and sets the GOPATH to /go.
# https://hub.docker.com/_/golang
FROM golang:1.12 as builder

# Copy local code to the container image.
WORKDIR /go/src/github.com/knative/docs/helloworld
COPY . .

# Build the command inside the container.
# (You may fetch or manage dependencies here,
# either manually or with a tool like "godep".)
RUN CGO_ENABLED=0 GOOS=linux go build -v -o helloworld

# Use a Docker multi-stage build to create a lean production image.
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM alpine

# Copy the binary to the production image from the builder stage.
COPY --from=builder /go/src/github.com/knative/docs/helloworld/helloworld /helloworld

# Run the web service on container startup.
CMD ["/helloworld"]
```

## step3. 登録&デプロイ
```shell
$ gcloud builds submit --tag gcr.io/[PROJECT-ID]/helloworld
$ gcloud beta run deploy --image gcr.io/[PROJECT-ID]/helloworld
```

![result](https://res.cloudinary.com/silverbirder/image/upload/v1613818551/silver-birder.github.io/blog/D34Fl0ZU4AA-dhU.png)

# 感想
普段私は、個人開発をしているときによくつかっている [now.sh](https://zeit.co/now)というServerless Deploymentsを使っている。こちらは、v1のときはdockerコンテナを使えていたのだが、v2になると使えなくなってしまった。ただ、無料で簡単にデプロイできるものを選んでいると、こちらのサービスが最善だと感じていた。

しかし、今回のGoogleCloudNext19の発表で、CloudRunというものをBeta版でリリースされたことを知り、早速使ってみた。
何事もなく、今回の手順を進めて一切失敗することなく、3分以内にデプロイまで進めることができた。
これは、なんて楽で便利なんだと感心してしまった。
また、[価格テーブル](https://cloud.google.com/run/pricing)を見ると、CloudFunctionsのようなリクエストによる従量課金制で、月2百万リクエストまで無料だ。個人開発においては、AppEngineのようなインスタンス起動時間による料金設定よりも、こちらの方が断然オトク。
これはもうnow.shをやめて、こっちに乗り換えるっきゃない!!
