---
title: connect-webやってみた
published: true
date: 2022-08-20
description: connect-web の記事が、はてブでトレンドになっていました。気になったので、試してみました。サンプルコードは、次のリポジトリに置いています。
tags: ["gRPC", "Connect", "React"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1660991073/silver-birder.github.io/connect-web-sample.png
---

[connect-web の記事](https://future-architect.github.io/articles/20220819a/)が、はてブでトレンドになっていました。気になったので、試してみました。

サンプルコードは、次のリポジトリに置いています。

- https://github.com/silverbirder/playground/tree/main/node/connect-web-example/frontend

## 前置き: gRPC と connect-web の雑な理解

RPC (Remote Procedure Call) を実現するためのプロトコルとして、gRPC があります。
このプロトコルは、ブラウザ側からは使えない(?)ため、gRPC-Web というブラウザ向けの gRPC というものを使うことになります。
その場合、ブラウザとサーバーとの間に、プロキシを建てる必要があるようです。(たぶん)

そこで、Connect という gRPC 互換の HTTP API を構築するためのライブラリ群が開発されました。
これのおかげで、プロキシを建てる必要がなく、ブラウザ側から gRPC を使うことが可能になります。

- https://connect.build/docs/introduction

上記ページに、バックエンドは connect-go、フロントエンドは connect-web という項目があります。
connect-web は、ブラウザから RPC を動かすための小さなライブラリです。タイプセーフなライブラリなため、
型補完が効きます。
connect-go は、go で Connect のサービスを作ることができます。

そのため、フロントエンドの開発は、connect-web を使うことになります。
以降は、フロントエンドの作業を、紹介します。ちなみに、React を使います。

## やってみた

フロントエンド側は、主に、次の 2 つの作業になります。

1. Protocol Buffer スキーマから TypeScript ファイルを生成
2. 生成された TypeScript ファイルから gRPC クライアントを実装

## 1. Protocol Buffer スキーマから TypeScript ファイルを生成

gRPC で通信するためのスキーマ、ProtocolBuffer スキーマが必要です。
これは、すでにあるものを使います。

- https://buf.build/bufbuild/eliza

具体的には、次のようなスキーマです。

```protobuf
syntax = "proto3";

service ElizaService {
  rpc Say(SayRequest) returns (SayResponse) {}
}

message SayRequest {
  string sentence = 1;
}

message SayResponse {
  string sentence = 1;
}
```

TypeScript コードを生成するために、`buf` という CLI を使います。
buf で利用する、次の定義ファイルを書きます。

```yaml
# buf.gen.yaml

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

これは、後述する `buf generate` するときにどういう出力をするかの設定情報です。
codegen の yaml ファイルみたいなものかなと思います。
これを動かすために、次の module をインストールしましょう。

```bash
# plugin
yarn add --dev @bufbuild/protoc-gen-connect-web @bufbuild/protoc-gen-es
# runtime
yarn add @bufbuild/connect-web @bufbuild/protobuf
```

- plugin
  - protoc-gen-es
    - リクエストやレスポンスメッセージのような基本型を生成
  - protoc-gen-connect-web
    - Protocol Buffer スキーマからサービスを生成
- runtime
  - bufbuild/connect-web
    - Connect および gRPC-web プロトコルのクライアントを提供
  - bufbuild/protobuf
    - 基本型に対するシリアライズなどを提供

次に、`buf`をインストールしましょう。
私は、brew でインストールしました。

```bash
brew install bufbuild/buf/buf
# ref: https://github.com/bufbuild/buf#installation
```

では、ProtocolBuffer スキーマから TypeScript ファイルを生成しましょう。

```bash
buf generate --template buf.gen.yaml buf.build/bufbuild/eliza
```

成功すると、次の 2 つの TypeScript ファイルが生成されます。

- gen/buf/connect/demo/eliza/v1/eliza_connectweb.ts
- gen/buf/connect/demo/eliza/v1/eliza_pb.ts

`eliza_connectweb.ts`は、次のコードが含まれています。

```typescript
// eliza_connectweb.ts
import { SayRequest, SayResponse } from "./eliza_pb.js";
import { MethodKind } from "@bufbuild/protobuf";

export const ElizaService = {
  typeName: "ElizaService",
  methods: {
    say: {
      name: "Say",
      I: SayRequest,
      O: SayResponse,
      kind: MethodKind.Unary,
    },
  },
} as const;
```

`eliza_pb.ts`は、次のコードが含まれています。

```typescript
export class SayRequest extends Message<SayRequest> {
  /**
   * @generated from field: string sentence = 1;
   */
  sentence = "";

  constructor(data?: PartialMessage<SayRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "buf.connect.demo.eliza.v1.SayRequest";
  # ... 省略 ...
}

/**
 * SayResponse describes the sentence responded by the ELIZA program.
 *
 * @generated from message buf.connect.demo.eliza.v1.SayResponse
 */
export class SayResponse extends Message<SayResponse> {
  /**
   * @generated from field: string sentence = 1;
   */
  sentence = "";

  constructor(data?: PartialMessage<SayResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime = proto3;
  static readonly typeName = "buf.connect.demo.eliza.v1.SayResponse";
  # ... 省略 ...
}
```

これで、準備はできました。

## 2. 生成された TypeScript ファイルから gRPC クライアントを実装

では、gRPC のクライアントを実装しましょう。
gRPC のクライント生成は、`createPromiseClient` でできます。
生成時の引数に、サービスとトランスポート(?)というものを渡す必要があります。
コードを見たほうがわかりやすいと思うので、次のコードを見てください。

```typescript
// client.ts
import { useMemo } from "react";
import { ServiceType } from "@bufbuild/protobuf";
import {
  createConnectTransport,
  createPromiseClient,
  PromiseClient,
  Transport,
} from "@bufbuild/connect-web";

const transport = createConnectTransport({
  baseUrl: "https://demo.connect.build", # バックエンド側のURL
});

export function useClient<T extends ServiceType>(service: T): PromiseClient<T> {
  return useMemo(() => createPromiseClient(service, transport), [service]);
}
```

このクライアントを、使ってみましょう。

```typescript
// App.tsx

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

このように、ProtocolBuffers の ElizaService が、型補完として使えるようになります。
良い感じです！

## 終わりに

意外とあっさり動いて、びっくりしました。
