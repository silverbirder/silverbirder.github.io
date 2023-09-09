---
title: GraphQL Guildのエコシステムって便利だね
published: true
date: 2022-10-15
description: GraphQL Guild ってご存知ですか？GraphQL 界隈だと、Code Generator が有名と思いますが
tags: ["GraphQL", "GraphQL Config", "GraphQL Schema"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1665838875/silver-birder.github.io/blog/sangga-rima-roman-selia-LjbjWeXRbs0-unsplash.jpg
---

GraphQL Guild ってご存知ですか？
GraphQL 界隈だと、Code Generator が有名と思いますが、GraphQL Guild は、それら GraphQL 関連の OSS を開発しているグループです。([詳しくは、こちら](https://the-guild.dev/about-us))

GraphQL Guild のエコシステムって便利だな〜って感じたことがあったので、紹介します。
試したソースコードは、こちらにあります。

- https://github.com/silverbirder/playground/tree/main/node/supabase-graphql-guild-app

## GraphQL Schema をダウンロードできる

スキーマ駆動開発をすると、GraphQL のクライアントとサーバーのリポジトリ(GraphQL Schema が置いてある)が分かれることがあります。そうすると、クライアントのリポジトリに、サーバーのリポジトリにある GraphQL の Schema が欲しくなると思います。その状況では、次の解決手段が想像できると思います。

- git submodule で、サーバーリポジトリをクライアントリポジトリに入れる
- git clone で、GraphQL Schema ファイルをダウンロードするスクリプトを書く

git を扱うと、CI/CD のプロセスやいくつかの場面で、面倒なことがあります。
そこで、GraphQL の SchemaURL を指定するだけで、Schema をダウンロードする機能が、`GraphQL CLI` にあります。

- https://www.graphql-cli.com/introduction

具体的には、`GraphQL Config` を作成し、`graphql codegen` と実行します。

- https://the-guild.dev/graphql/config/docs

Schema をダウンロードするために、GraphQL のエンドポイント URL を指定します。

Config ファイルの形式は、yml、json、js、ts のどれかを選べます。
私の場合、(supabase を使っている関係で)GraphQL のエンドポイントへアクセスする認証情報を環境変数から読み込みたかったため、Typescript(ts)を選びました。

具体的には、次の Config ファイルを生成します。

```typescript
// graphql.config.ts
import type { IGraphQLConfig } from "graphql-config";
import { config } from "dotenv";

config();

/** @type {import('graphql-config').IGraphQLConfig} */
const graphqlConfig: IGraphQLConfig = {
  schema: [
    {
      [`${process.env.SUPABASE_URL}/graphql/v1`]: {
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY || "",
          authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
      },
    },
  ],
  extensions: {
    codegen: {
      generates: {
        "generated/schema.graphql": {
          plugins: ["schema-ast"],
        },
      },
    },
  },
};

export default graphqlConfig;
```

必要なパッケージをインストールした状態で、`graphql codegen` と実行すると `generated/schema.graphql` が生成されます！

## GraphiQL が Config だけで動く

GraphQL を利用する側としては、どのようなクエリが書けるか試せす場所が欲しくなります。
サーバー側から GraphiQL を用意頂くでも全然良いのですが、`GraphQL Yoga` というものを使えば簡単にできます。

- https://the-guild.dev/graphql/yoga-server

`yarn add graphql-yoga` したあとに、先程の `graphql.config.ts` が存在すれば、`yarn yoga` するだけで GraphiQL が手に入ります！一切、サーブするコードを書いていません。最高でした。

## GraphQL CLI には色々便利な機能がある

`GraphQL CLI` には、GraphQL 関連で便利な機能があります。

- https://github.com/Urigo/graphql-cli

具体的には、次の 3 つです。

- `@graphql-cli/coverage`
  - Document のオペレーションを元に、Schema がどれくらい使われているかわかる
- `@graphql-cli/diff`
  - ローカルとリモートの GraphQL Schema の違いを教えてくれる
- `@graphql-cli/validate`
  - Document のオペレーション が、GraphQL Schema 定義に反していないかチェックしてくれる

## 終わりに

GraphQL Guild は、GraphQL Config が中心になっている印象を受けました。
Config があれば、他のエコシステムはそれを見て機能が動くため、準備するものが少なくて済みます。

関係ないですが、supabase で GraphQL を使うのもすごく簡単で、ありがたいです。
