---
title: GraphQL Guildのエコシステムって便利だね
published: true
date: 2022-10-14
description: XXXX
tags: ["GraphQL", "Config"]
---

GraphQL Guild ってご存知ですか？
GraphQL Code Generator が有名と思いますが、GraphQL 関連の OSS を開発しているグループです。

- https://the-guild.dev/about-us

GraphQL Guild のエコシステムって便利だな〜って感じたことがあったので、紹介します。

## GraphQL Schema をダウンロードできる

GraphQL のクライアント(フロントエンド)と、サーバー(バックエンド)のソースコードが分かれていると、
フロントエンドのコードから、GraphQL の Schema が欲しくなるときがあると思います。

そのときは、次のような手段を取ることがあると思います。

- Git サブモジュールで、バックエンドコードをクローンする
- git clone コマンドで schema ファイルをダウンロードするスクリプトを書く

git を扱うと、CI/CD のプロセスやいくつかの面で、面倒なことがあります。
そこで、GraphQL の SchemaURL を指定してダウンロードする機能があります。

- https://www.graphql-cli.com/migration

スキーマの URL は、認証がかかっている場面もあると思います。
そういうときは、

- https://the-guild.dev/graphql/config/docs/user/schema

header を付与することができます。また、js や ts で書けるため、環境変数から読むこともできます。

schema-ast のプラグインを入れれば、schema をダウンロードできます。

## Graphiql が Config だけで動く

yoga を入れたら、config を勝手にみてくれて、graphiql が動きます。

- https://the-guild.dev/graphql/yoga-server

わざわざ、サーブするコードを書くことはない。

## CLI で いろいろ便利なのがある

- coverage
  - document は、schema のどれをよく使っているかわかる
- diff
  - ローカルの schema とリモートの schema の違いを教えてくれる
- validate
  - document が、schema 定義に反していないかチェックしてくれる

## 終わりに
