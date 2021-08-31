<!-- 
title: TikTokスクレイプ基盤をGCP上で構築してハマったこと
date: 2021-08-28T16:52:00+09:00
draft: false
description: 
image: 
icon: 😞
-->

TikTokへスクレイプするバッチをGCP上で構築しました。
その構築時に、ハマったことを共有します。

[:contents]

# きっかけ

2020年、最もダウンロードされたアプリがFacebookを抜いて**TikTok**が一位になったそうです。

[https://gigazine.net/news/20210811-tiktok-overtakes-facebook/:embed]

私もTikTokを利用しています。

ネットサーフィンをしている時に、[tiktok-scraper](https://www.npmjs.com/package/tiktok-scraper)というライブラリを[cloudflareのサイト](https://workers.cloudflare.com/works)で発見しました。これを使って、TikTokの情報収集できるんじゃないかなと思い始めましたのがきっかけです。

※ スクレイプは私的利用であることが前提です。また、TikTokへ負荷をかけないようスクレイプ間隔に配慮しましょう。

# tiktok-scraper

[https://www.npmjs.com/package/tiktok-scraper:embed]

> Scrape and download useful information from TikTok.
No login or password are required.
This is not an official API support and etc. This is just a scraper that is using TikTok Web API to scrape media and related meta information.

上記とおり、TikTokのWebAPIを通してスクレイプします。
ライブラリでは、特定のTikTok動画をダウンロードすることができますが、次の切り口で、TikTok動画を一括ダウンロードすることもできます。

* ユーザー
* ハッシュタグ
* トレンド
* 音楽

<figure title="tiktok_scraper_doc1">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1630224934/silver-birder.github.io/blog/tiktok_scraper_doc1.png" alt="tiktok_scraper_doc1">
<figcaption>動画をダウンロード</figcaption>
</figure>

<figure title="tiktok_scraper_doc2">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1630224935/silver-birder.github.io/blog/tiktok_scraper_doc2.png" alt="tiktok_scraper_doc2">
<figcaption>様々な切り口で、動画をダウンロード</figcaption>
</figure>


加えて、メタ情報(フォロワー数やいいね数など)も手に入ります。

中には、ユーザー画像や動画カバー画像などのTikTok CDNへのリンクもあります。([https://p16-sign-va.tiktokcdn.com](https://p16-sign-va.tiktokcdn.com))

リンクには、有効期限を示す文字が含まれており、一定の時間が経過すると `Access Denied` となります。

<figure title="tiktok_scraper_doc3">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1630224935/silver-birder.github.io/blog/tiktok_scraper_doc3.png" alt="tiktok_scraper_doc3">
<figcaption>様々な切り口で、メタ情報をダウンロード</figcaption>
</figure>

手に入れられない情報は、**ログインが必要なもの**です。
例えば、私がフォローしているユーザーとかです。
その情報が欲しかったので、どうにかして手に入れました。(詳細は省きます)
そのユーザー情報を使って、先程のユーザーという切り口でTikTokの動画やメタ情報を収集するバッチを作ろうと考えました。


※ WebAPIを叩きすぎると、TikTok側のブラックリストに追加され、アクセス拒否されます。

# システム設計

バッチを動かす環境ですが、プライベートでよく使っているGCP上で構築しようと思いました。
バッチで収集したデータを閲覧するWebアプリケーションも作ろうと考え、NetlifyとReactで動かすことにしました。

<figure title="tiktok_scraper_web_app_sample">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1630404283/silver-birder.github.io/blog/tiktok_scraper_web_app_sample.png" alt="tiktok_scraper_web_app_sample">
<figcaption>Webアプリケーション UI</figcaption>
</figure>

## 目的
私がフォローしているユーザーのTikTok動画やメタ情報を集めること。

## I/O

* インプット
  * ユーザー情報
* アウトプット
  * TikTok動画
  * メタ情報

## GCPリソース選定

* TikTok動画
  * Cloud Storage へ保存
* メタ情報
  * Cloud SQL へ保存
* コンピューティングリソース
  * Cloud Run

## 設計図

実際に構築したGCPのシステム設計図が、次の画像のとおりです。

![tiktok scrape platform overviews](https://res.cloudinary.com/silverbirder/image/upload/v1630160345/silver-birder.github.io/blog/tiktok_scrape_platform_overviews.png)

GCPリソースの用途は、次のとおりです。

|GCPリソース|用途|
|--|--|
|Cloud Scheduler|バッチ起動のスケジュールを管理|
|Cloud Worlflows|バッチのワークフローを制御|
|Cloud Run|役割に応じて処理|
|PubSub|Cloud Runを繋げる|
|Cloud Storage|動画を保存|
|AutoML Vision|動画のカバー画像をラベル検出|
|Cloud SQL|全てのメタ情報を管理|

各Clour Runの役割は、次のとおりです。

|Cloud Run名|役割|
|--|--|
|Loader|ユーザー情報を読み込む|
|Processor|一連の処理を行む|
|Scraper|TikTokへスクレイプする|
|Storer|渡された情報を保存する|
|Uploader|動画をダウンロードし、Storageへアップロードする|
|Visioner|画像を(Vision APIを通して)ラベル情報を抽出する|
|API|Cloud SQLとのインターフェース|

# ハマったこと
## Cloud Workflowsの制限が厳しい

当初、PubSubは使わずに、Cloud Runの連携はCloud Workflowsで行おうと考えていました。
PubSubでワークフローを制御するよりも、Cloud Workflowsのyamlでワークフローを制御した方が分かりやすいと思ったからです。
具体的には、Cloud RunへHTTPリクエストし、HTTPレスポンスに応じて、次のCloud Runを呼び出そうと考えていました。

ただ、Cloud Workflowsには、次のページに書いてあるとおり、いくつかの制限があります。

[https://cloud.google.com/workflows/quotas?hl=ja:embed]

特に困ったのが、全ての変数のメモリ合計が、**64kb** だということです。
HTTPレスポンスのBodyを変数保持する構成を取ると、そのサイズを考慮しなければいけません。
いくつかやり方を見直してみたのですが、思うような形に仕上げることができず、断念しました。
つまりは、PubSubを使ってCloud Runを連携することになりました。

## Firestoreのページカーソルに±2ページ以降への移動が難しい

GCPでデータストレージで、無料枠があるFirestoreを当初使っていました。
理由は、単純にGCP無料枠としてFirestoreがあったからです。

当初、Firestoreを使って、バッチとWebアプリを書いていました。
Webアプリには、バッチで収集したTikTokの動画を一覧表示するViewを用意しました。

閲覧するTikTok動画が多くなると、ページネーションが欲しくなりました。
そこで、Firestoreでページネーションの実現方法を調べてみると、次の資料を発見しました。

[https://firebase.google.com/docs/firestore/query-data/query-cursors?hl=ja:embed]

これを見ると、ページネーションは、現在位置から±1ページの移動は簡単です。
資料にあるサンプルコードのように、`startAfter`を使えばよいだけです。

```javascript
var first = db.collection("cities")
        .orderBy("population")
        .limit(25);

return first.get().then((documentSnapshots) => {
  // Get the last visible document
  var lastVisible = documentSnapshots.docs[documentSnapshots.docs.length-1];
  console.log("last", lastVisible);

  // Construct a new query starting at this document,
  // get the next 25 cities.
  var next = db.collection("cities")
          .orderBy("population")
          .startAfter(lastVisible)
          .limit(25);
});
```

しかし、現在位置から±2ページ目以降への遷移がしたい場合は、どうすれば良いでしょうか。
上記のサンプルコードで言えば、`first`をコピペして`second`変数を生成するのでしょうか。
それよりも、`offset`メソッドがほしいところです。
しかし、次の資料を発見し、諦めることになります。

[https://firebase.google.com/docs/firestore/best-practices?hl=ja:embed]

> オフセットは使用しないでください。その代わりにカーソルを使用します。オフセットを使用すると、スキップされたドキュメントがアプリケーションに返されなくなりますが、内部ではスキップされたドキュメントも引き続き取得されています。スキップされたドキュメントはクエリのレイテンシに影響し、このようなドキュメントの取得に必要な読み取りオペレーションは課金対象になります。

という訳で、クエリカーソルを推奨されています。

解決策としては、順序を示すフィールドがあれば、解決するかもしれません。
例えば、`order`というフィールドを用意し、1,2,3とインクリメントしたデータがあれば、クリアできるかもしれません。
`startAfter`の引数はdocumentオブジェクトだけではなく、orderBy句で指定したフィールドの変数を含めることができます。

```javascript
  var next = db.collection("cities")
          .orderBy("order")
          .startAfter(50)
          .limit(25);
```

これだと、1ページ25個のデータを表示するならば、3ページ目(51~75)を取得できます。(`startAfter`は開始点を含めません)

[https://cloud.google.com/nodejs/docs/reference/firestore/latest/firestore/query:embed]

そこで、FirestoreからCloud SQLへデータストレージを切り替えるようにしました。
改修自体、Cloud Runの役割が明確に分離されていたので、一部の処理を書き換えるだけで、簡単にできました。

## Eventacのリソース選択が物足りない

Cloud RunとPubSubの連携には、Eventacを使用します。

[https://cloud.google.com/blog/ja/products/serverless/eventarc-unified-eventing-experience-google-cloud:embed]

> 昨年 10 月、60 を超える Google Cloud ソースから Cloud Run にイベントを送信できる新しいイベント機能、Eventarc を発表いたしました。Eventarc は、さまざまなソースから監査ログを読み取り、それらを CloudEvents 形式のイベントとして Cloud Run サービスに送信します。また、カスタム アプリケーションの Pub/Sub トピックからイベントを読み取ることもできます。

このEventarcのソースとして、Cloud StorageのObject.createをトリガーとして設計を考えていました。
しかし、そのイベントをフィルタリングする選択肢は、2つしかありません。

[https://cloud.google.com/blog/ja/products/serverless/demystifying-event-filters-eventarc:embed]

できるのは、次の2つです。

* All resource
* Specific resource

All resourceは、Cloud Storageの全てのバケットにおけるObject.createイベントがトリガーとなります。
Specific resourceは、特定のObeject名がObject.createされた場合のみ、トリガーとなります。
欲しいなと思ったのは、Specific resouceの正規表現によるフィルタリング、任意のバケットやフォルダの配下で限定など
のフィルタリングです。例えば、`gs://bucket/folder/*.json` のような形式です。現状は、`gs://bucket/folder/A.json`とするしかありません。

今回は、PubSubのイベントのみでトリガーするようにしました。

## PubSubをトリガーとするCloudRunでHTTPレスポンス500を返却すると、PubSubが再試行される

Cloud Runで、5XX系のエラーとなった場合、PubSubの再試行されます。

[https://cloud.google.com/pubsub/docs/admin?hl=ja#using_retry_policies:embed]

何度もPubSubが実行されると、Cloud Runのコンピューティングリソースが消費され続けます。
そうすると、課金が発生するので、対策が必要です。

## Cloud Workflowsの処理は、あまりカスタマイズできない

Cloud Workflowsは、あくまでワークフローの管理です。
変数処理などは、基本的に使わず、ワークフローのタスクを連結するだけにした方が良いです。
次の資料には、Cloud Workflowsで使える標準機能です。

[https://cloud.google.com/workflows/docs/reference/stdlib/overview:embed]

また並列処理は、まだ実験段階なので、本番環境は使えないようです。

[https://cloud.google.com/workflows/docs/reference/stdlib/experimental.executions/map:embed]

# 終わりに

システム設計変更が度々変更がありつつも、目的とするTikTok動画やメタ情報を収集することは達成できました。
変更があったとしても、役割をできる限り小さく保つことで、変更に柔軟に対応することができます。
また、実際に動かすことで、気付けるポイントもあるので、フィードバックサイクルを短くすることも大切です。

まだまだ改善する余地はあります。ユーザー情報という切り口で情報収集していましたが、トレンドやハッシュタグなどからも
取得できるようにしたいです。また、ユーザーのRSSを作ることで、金銭的な節約もしてみたいと思っています。
