---
title: connect-webやってみた
published: true
date: 2022-08-20
description:
tags: ["gRPC", "Connect-Web", "React"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1660991073/silver-birder.github.io/connect-web-sample.png
---

connect-web の記事が、はてブでトレンドになっていました。気になったので、試してみました。

<ogp-me src="https://future-architect.github.io/articles/20220819a/"></ogp-me>

サンプルコードは、次のリポジトリに置いています。

<ogp-me src="https://github.com/Silver-birder/playground/tree/main/node/connect-web-example/frontend"></ogp-me>

## gRPC と connect-web の雑な理解

RPC (Remote Procedure Call) を実現するためのプロトコルとして、gRPC があります。
このプロトコルは、ブラウザ側からは使えない(?)ため、gRPC-Web というブラウザ向けの gRPC というものを使うことになります。
その場合、ブラウザとサーバーとの間に、プロキシを建てる必要があるようです。

そこで、Connect という gRPC 互換の HTTP API を構築するためのライブラリ群が開発されました。
これのおかげで、プロキシを建てる必要がなくなります。

- https://connect.build/docs/introduction

上記ページに、バックエンドは connect-go、フロントエンドは connect-web という項目があります。
connect-web は、ブラウザから RPC を動かすための小さなライブラリです。タイプセーフなライブラリなため、
型補完が効きます。

## やってみた

フロントエンド側は、次の 2 つの作業だけです。

1. Protocol Buffer スキーマから TypeScript コードに変換する
2. 生成された TypeScript ファイルから gRPC クライアントを書く

## 1. Protocol Buffer スキーマから TypeScript コードに変換する

```yaml
# buf.gen.yaml defines a local generation template.
# For details, see https://docs.buf.build/configuration/v1/buf-gen-yaml
version: v1
plugins:
  - name: es
    path: node_modules/.bin/protoc-gen-es
    out: gen
    # With target=ts, we generate TypeScript files.
    # Use target=js+dts to generate JavaScript and TypeScript declaration files
    # like remote generation does.
    opt: target=ts
  - name: connect-web
    path: node_modules/.bin/protoc-gen-connect-web
    out: gen
    # With target=ts, we generate TypeScript files.
    opt: target=ts
```

```
buf generate buf.build/bufbuild/eliza
```

@see: https://buf.build/bufbuild/eliza

↓

protoc-gen-es: ProtocolBuffers の Request/Response の基本セット
protoc-gen-connect-web: ProtocolBuffers スキーマのサービス

## 2. 生成された TypeScript ファイルから gRPC クライアントを書く

```typescript
import { useMemo } from "react";
import { ServiceType } from "@bufbuild/protobuf";
import {
  createConnectTransport,
  createPromiseClient,
  PromiseClient,
  Transport,
} from "@bufbuild/connect-web";

const transport = createConnectTransport({
  baseUrl: "https://demo.connect.build",
});

export function useClient<T extends ServiceType>(service: T): PromiseClient<T> {
  return useMemo(() => createPromiseClient(service, transport), [service]);
}
```

```typescript
import { createConnectTransport, Interceptor } from "@bufbuild/connect-web";
import { ElizaService } from "../gen/buf/connect/demo/eliza/v1/eliza_connectweb";
import { useClient } from "./client";

function App() {
  const client = useClient(ElizaService);
  client
    .say({
      sentence: "hello",
    })
    .then(({ sentence }) => {
      console.log(sentence);
    });
  // ...
}
```
