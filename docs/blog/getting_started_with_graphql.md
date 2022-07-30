---
title: GraphQLを使い始めた所感
published: true
date: 2022-07-30
description: XX
tags: ["Graphql"]
---

書くことメモ

これまでは、rest api を使っていた。

graphql は、メタ産で、graph 理論に基づいた〜。

特徴:

操作として

- query
  - GET のような参照
- mutation
  - POST,PUT,DELETE のような更新
- subscribe
  - データの購読と監視

post 送信に変わる。
従来は、HTTP GET のパラメータで、データ参照。
URL 毎にキャッシュ戦略ができた。(FE と BE の間に redis とか)
枯れた。

すべて POST に変わるので、従来のキャッシュ戦略が使いにくい。
そもそも、HTTP 的にずっと POST ってどうなんだ？(query を body)
使い方として。
クライアントライブラリでキャッシュ戦略が様々でてくる。
HTTP の URL キーは難しく、query などの HTTP POST の body を parse 解析して...
などコストかかる。

が、利用者側としては、使い勝手は良い。
わざわざ複数 API を叩いて結合する手間が減る。

従来は、いろいろ戦法はあった。
例。商品データと購買データ。
商品リストに、これは買ったかどうかを示したい場合

- 1. FE: 商品データを fetch して、それと購買データを fetch して、UI で結合
- 2. BE: new API を作ってもらって、そこには商品データと購買データの mix する
- 3. BE: 商品リスト API に、オプショナルとして購買情報を付与してもらう (拡張)

graphql になると

- 1. BE: 商品データと購買データを fetch して、結合するリゾルバを書く
- 2. FE: graphql で商品と購買ステータスを query 実行する

従来の取り口として、BE で改修を任せた場合は、FE のやることはあまり変わらない。
FE に結合しろという場面には、Graphql のほうが楽ちん。

んー、、、ケースバイケースで、どういうケースで graphql が従来の restapi の開発よりも優れるのか、知りたい。
graphql の公式ページで、モチベーションやバックグラウンドを読もう。

graphql client 戦国時代

https://zenn.dev/seya/scraps/9d64f2e9cae500

- apollo client
- relay
- urql

- swr
- react-query
- graphql-request

開発者や、開発言語、スポンサー、などの軸や、
さっきの話題にあったとおりのキャッシュ戦略は、必ず考えたい。
