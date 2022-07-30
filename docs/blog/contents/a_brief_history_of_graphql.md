---
title: Graphqlの歴史
published: true
date: 2022-07-30
description: XX
tags: ["Graphql"]
---

最近、業務で GraphQL を使う機会が増えてきました。
GraphQL って、なんで生まれたのか歴史が気になりました。

## 参考資料

<ogp-me src="https://www.youtube.com/watch?v=VjHWkBr3tjI"></opg-me>

GraphQL の共同開発者で、GraphQL Foundation エグゼクティブディレクターである Lee Byron さんから、GraphQL の歴史について、紹介されています。

次の資料も参考になります。

- https://dev.to/tamerlang/a-brief-history-of-graphql-2jhd
- https://levelup.gitconnected.com/what-is-graphql-87fc7687b042

## 歴史の流れ

まず、次のような歴史がありました。

- 2004 年、FaceBook は Web アプリとして生まれました
- 2007 年、iPhone の登場により、モバイルが急速に普及し始めましたが、FaceBook は HTML5 に賭けすぎて失敗しました
- 2012 年、FaceBook はネイティブ iOS のニュースフィードを RESTFul API で開発し始めました

開発すると、次の 3 つの課題を抱えたようです。

## 3 つの課題

次の 3 つの課題を抱えました。

- Slow on network
  - 1 つの API から必要なデータが全て返ってこないため、複数のリクエストを何度も往復する必要がありました
- Fragile client/server relationship
  - API の変更を、クライアントコードに慎重に引き継がなければ、クラッシュしてしまいます
- Tedious code & process
  - クライアントの開発は、API のレスポンスに非常に連動しているので、API のレスポンスの変更があれば、クライアントも変更しなければなりません

その課題を解決すべく、スーパーグラフと呼ばれるプロトタイプを開発しました。
そのベストプラクティスを集めたものが、GraphQL となりました。

## GraphQL のメリット

GraphQL により、次のメリットが生まれました。
※ 課題解決を目的とするため、課題の逆話になります。

- Fast on network
  - 必要なものだけを記述できるため、1 回のリクエストで十分です
- Robust static types
  - どのようなデータが利用可能か、どのような型か、クライアントは知ることができます
- Empowering client evolution

  - レスポンスのフォーマットはクライアントが制御できます。そのため、サーバーサイドはシンプルになり、メンテナンスも容易になります
  - 古いフィールドを非推奨とし、機能は継続できます。この後方互換性によりバージョニング管理が不要になります

## GraphQL の公式ページを見る

これらの歴史を知ってから、次の GraphQL の公式ページを見てみます。

- https://graphql.org/faq/#why-should-i-use-graphql

```
Why should I use GraphQL

It depends on your use case, but in general, GraphQL has a few key features that stand out. For example, GraphQL enables you to:

1. Aggregate data from multiple UI components.

2. Create a representation of your data that feels familiar and natural (a graph).

3. Ensure that all of your data is statically typed and these types inform what queries the schema supports.

4. Reduce the need for breaking changes, but utilize a built-in mechanism for deprecations when you need to.

5. Access to a powerful tooling ecosystem with GUIs, editor integrations, code generation, linting, analytics, and more.
```

なぜ、GraphQL を使うべきなのかという話から、GraphQL の特徴について紹介されています。これらは、さきほどの `GraphQL のメリット` の話と関連がありそうですね。

- 1, 2
  - `Fast on network`
- 3
  - `Robust static types`
- 4
  - `Empowering client evolution`

`Fast on network` について関連する記事も、公式ページにありました。

## GraphQL is the better REST

次のページから、REST と GraphQL での違いについて、紹介されていました。

- https://www.howtographql.com/basics/1-graphql-is-the-better-rest/

例として、ユーザー情報、ユーザーが投稿したコンテンツ、ユーザーのフォロワーという 3 つの情報を取得するケースです。

REST API の場合は、次の画像のように 3 往復することになります。

![REST_API](https://imgur.com/VRyV7Jh.png)

GraphQL の場合は、1 回の往復だけでデータが取得できます。

![GraphQL](https://imgur.com/z9VKnHs.png)

## 2012 年の 3 つの課題を 2022 年で改めて考える

2012 年での問題を、2022 年の今で改めて考えてみました。

- Slow on network
  - 2012 年は、3G 回線が普及していた
    - 複数リクエストや、API のペイロードが大きいと、ネットワークレイテンシに大きく影響していそう
  - 2022 年は、5G 回線が普及している
    - ネットワークレイテンシは、そこまでクリティカルな問題にはならないのでは
    - もちろん、低ネットワークを利用するユーザーが多いプロダクトなら、考慮が必要
  - 複数リクエストは、BFF のようなファザードを建てることで、解決できないか
- Fragile client/server relationship
  - バージョニングと後方互換性については、今の REST API も変わりなく課題の 1 つ
- Tedious code & process
  - スキーマ駆動な開発で、問題解決できるのではないか

※ 簡単に書いていますが、2012 年の問題は、もっと深い・困難な問題だったのかもしれません。

## GraphQL の魅力

### クエリーによるデータの取捨選択

GraphQL の必要なデータを記述できるクエリーは、確かに魅力的です。
従来の REST API の開発設計では、次のようなパターンがあります。

- レスポンスのデータのバリエーションをグループ分けするクエリパラメータを作る
  - Response group
    - small
      - 最小セット
    - middle
      - small と large の中間
    - large
      - 全てのフィールド
- データの取捨選択をホワイトリスト/ブラックリストで指定するクエリパラメータを作る

これまで、前者の設計方法を、よく利用していました。これで、開発や運用は、そこまで大きな問題には感じませんでした。
それよりも、データの取捨選択は、API のスケールがしやすさがメリットのように思います。

### データは、階層構造を表せる

GraphQL は、リクエスト・レスポンスのデータに、階層構造を表せます。
これも、魅力的です。

従来の REST API では、リクエストのクエリパラメータは、フラットな形で送るしかありませんでした。POST の body を使って、JSON を送るという手段もあります。(まあ、これが GraphQL なんですが)

REST API のレスポンスは、JSON で返却できるので、レスポンスには階層構造を表すことができます。

REST API のリクエストに、階層構造を表せるのは、柔軟性が高く良さそうです。

## ただ、個人的な違和感

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

## 参考: なぜ GraphQL を使うべきか、使わないべきか

- https://www.apollographql.com/blog/graphql/basics/why-use-graphql/
- https://wundergraph.com/blog/why_not_use_graphql
