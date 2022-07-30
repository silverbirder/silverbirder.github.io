---
title: GraphQLを使い始めたので、歴史や
published: true
date: 2022-07-30
description: XX
tags: ["Graphql"]
---

書くことメモ

## 脳内アウトプット

grapql は、次の 2 つの課題の解決のため (?)

- 1. データ取得に、API の通信が何度も往復する
  - ネットワークレイテンシ
  - データが大きいと、なお影響する
- 2. クライアントとサーバーサイドの開発体験
  - API の開発を待って、クライアントが動く

1 は、ファザード(BFF)を建てて、そこで吸収することで解決できないか
2 は、スキーマ駆動の開発で、解決できないか

graphql の特徴として、欲しいデータだけを取得できる機能がある。
必要最小限のデータのみを返却してくれるのは、
では、全部のデータを返してくれるのは、何にこまるのか。

確かに、大きなバイト数をサーバーサイドで組み立てると、サーバー負荷にもつながるし、ネットワーク帯域の圧迫につながりレイテンシにつながるでしょう。
3G 回線のモバイルユーザーなら、確かに困るだろうなと思う一方で...
サーバー負荷にしては、そこまでクリティカルにこまるのか。まあ、マシンリソースを潤沢にすれば、解消できるが、困ることにはつながるのかな。

データの取捨選択は、従来の手段なら、

1. BE: API のオプションパラメータを用意して、大・中・小 のようなものを作る
2. FE: URL のパラメータに、ブラックリスト/ホワイトリスト でフィールドを指定する
3. FE: POST で、必要なフィールド情報をおくる

私としては、① の手段で十分じゃないのかと思っている。そこまで、取捨選択するバリエーションって多いのだろうか。API の進化に伴っても、大中小のどこかに増減させればと考えている。

私には、どうしても GraphQL を使うことで得られるメリット(-デメリット)が大きいケースが、想像できない。ただ、brief の話にある課題は、要約しただけであり、もっと深い問題があったんだろう。
Facebook のようなデータ構造が、再帰的だったり深すぎたり、複雑な場面には、めちゃくちゃ良さそうと思う一方で、そこまでの規模感のデータって、滅多に無い？

## Brief history of graphql

https://www.youtube.com/watch?v=VjHWkBr3tjI
https://dev.to/tamerlang/a-brief-history-of-graphql-2jhd
https://levelup.gitconnected.com/what-is-graphql-87fc7687b042

## GraphQL

https://graphql.org/faq/#why-should-i-use-graphql
https://www.howtographql.com/basics/1-graphql-is-the-better-rest/

## why

https://www.apollographql.com/blog/graphql/basics/why-use-graphql/
https://wundergraph.com/blog/why_not_use_graphql

## キーワード

- 階層化
- データの取捨選択
- さまざまなデータとの関係性(?)
- client と server との開発効率・密結合さ
- BFF、ファザードを建てれば
- モバイル普及・ネットワークレイテンシ

## 違和感

これまでは、rest api を使っていた。

graphql は、メタ産で、graph 理論に基づいた〜。

特徴:

操作として

- query
  - GET のような参照
- mutation
  - POST,PUT,DELETE のような更新
- subscribe
  - データの購読と監視. WebSocket

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
