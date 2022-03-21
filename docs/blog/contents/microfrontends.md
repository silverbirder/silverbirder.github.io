---
title: Micro Frontends を学んだすべて
published: true
date: 2020-05-04
description: Micro FrontendsというWebフロントエンドアーキテクチャがあります。このアーキテクチャを知るために、書籍を読み、簡単なサンプルWebアプリを開発しました。そこから学んだことをすべて議事録として残したいと思います。
tags: ["Micro Frontends", "Learning"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614431108/silver-birder.github.io/blog/everything_I_ve_learned_about_Micro_Frontends.jpg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614431108/silver-birder.github.io/blog/everything_I_ve_learned_about_Micro_Frontends.jpg
---

Micro FrontendsというWebフロントエンドアーキテクチャがあります。
このアーキテクチャを知るために、書籍を読み、簡単なサンプルWebアプリを開発しました。
そこから学んだことをすべて議事録として残したいと思います。

<!--  TODO: TOC -->

# モノリシックな Webアプリケーション
マイクロサービスという考え方の多くは、バックエンドへ適用されることが一般的です。
一方で、フロントエンドは依然モノリシックなままの状態です。

ECサイトのようなWebアプリケーションでは、様々な専門知識(商品、注文、検索など)を必要とし、フロントエンド開発者の守備範囲がとても広くなってしまいます。
開発者には限界があり、いつしか<b>トラブルシューティングに追われる日々</b>になってしまいます。

そこで、Micro Frontendsというアーキテクチャの出番です。

# Micro Frontends とは

> それはマイクロサービスの考え方をフロントエンドに拡張したものです。

![micro frontends monolith-frontback-microservices](https://micro-frontends-japanese.org/resources/monolith-frontback-microservices.png)

![micro frontends verticals-headline](https://micro-frontends-japanese.org/resources/verticals-headline.png)

※ [https://micro-frontends-japanese.org](https://micro-frontends-japanese.org)

要は、バックエンドだけでなく、バックエンドからフロントエンドまでをマイクロサービス化することです。

さらに詳しく知りたい方は、次のページをご参考下さい。とてもわかりやすいです。

<iframely-embed card="small" url="https://micro-frontends-japanese.org/"></iframely-embed>

また、次の書籍を読むと、
<iframely-embed card="small" url="https://www.manning.com/books/micro-frontends-in-action"></iframely-embed>

> Amazon does not talk a lot about its internal development structure. However, there are reports that <b>the teams who run its e-commerce site have been working like this </b>for a long time.  ...

> <b>Micro frontends are indeed quite popular in the e-commerce</b> sector.  <b>In 2012</b> the Otto Group, a Germany based mail order company and one of the world’s largest e-commerce players started to split up its monolith.  ...

> The Swedish furniture company <b>IKEA and Zalando</b>, one of Europes biggest fashion retailers, moved to this model. ...

> But micro frontends are also used in other industries. <b>Spotify</b> organizes itself in autonomous end-to-end teams they call Squads. ...

Excerpt From: Michael Geers. “Micro Frontends in Action MEAP V03.” iBooks. 

という内容があります。

IKEAやZalando といった<b>ECサイトがMicro Frontendsを採用する</b>ケースが多く、公には言っていませんが、AmazonもMicro Frontendsで取り組んでいるようです。
ECサイトだけでなく、Spotifyのようなサービスにも適用されるケースがあります。

# Micro Frontends の良さ

私が思う Micro Frontends から得られる最大の恩恵は、"<b>局所化</b>" だと思います。

フロントエンドをサービス毎(商品、注文、検索など)に分割することで

* サービスの<b>専門性</b>向上
  * ex. 対象サービスのフロントエンドだけに集中できる
* サービスの<b>開発速度</b>向上
  * ex. 対象サービスのソースコードだけ読めば良い
  * ex. 対象サービスだけにライブラリアップデートすれば良い
  * ex. フレームワークの切り替えは対象サービスだけすれば良い

少し薄っぺらいかも知れませんが、↑のように実感しています。

※ Micro Frontendsは Webベースのアーキテクチャになります。

# Micro Frontends の難しさ

ここは、まだちゃんと掘り下げれていませんが、次のようなものがあります。

* 特定チームが改善しても、チーム全体が改善しない
  * ex. あるチームがwebpackのビルド時間短縮に成功しても、他のチームは影響を受けない
  * ex. 全てのチームが採用しているライブラリのセキュリティパッチは、それぞれのチームが更新しなければならない
* チーム全体へ共有する仕組みを考える必要がある
  * ex. デザインシステム、パフォーマンス、ナレッジ
* エッジな技術スタック採用は、チームメンバー移動を困難にする
  * ex. パラダイムシフトが発生してしまう 技術スタック

# Micro Frontends の作る上で考えること

フロントエンドをマイクロサービス化するということは、各サービスで HTML/CSS/JSを作ることになります。
それらの<b>サービスを統合するサービス</b>が重要になってきます。

大きく分けて2つの統合パターンがあります。

|種類|解決手段|メリット|デメリット| 
| ---- | ---- | ---- | ---- | 
|サーバーサイド統合| SSI, ESI, Tailor, Podium  |・SEO対策上良い<br>・ユーザーのネットワークレイテンシーが少ない<br>・初回ロードパフォーマンスが優れている|・インタラクションアプローチが不得意|
|クライアントサイド統合|<s>Ajax, Iframe,</s> Web Components  |・Web標準<br>・シャドウDOMによる堅牢な作り|・サポートブラウザに依存する<br>・クライアント側のJavaScriptが有効であること|

また、これら2つの選択基準は次のようになります。

|種類|選択基準|
| ---- | ---- | 
|サーバーサイド統合|良好な読み込みパフォーマンスと検索エンジンのランキングがプロジェクトの優先事項であること|
|クライアントサイド統合|さまざまなチームのユーザーインターフェイスを1つの画面に統合する必要があるインタラクティブなアプリケーションを構築すること|

今回、私はサーバーサイド統合(Podium)を選択しました。
ただ、インタラクティブなアプローチも必要だったため、<b>Hydration</b>を使いました。

> Hydration refers to the client-side process during which Vue takes over the static HTML sent by the server and turns it into dynamic DOM that can react to client-side data changes.

※ [https://ssr.vuejs.org/guide/hydration.html](https://ssr.vuejs.org/guide/hydration.html)

Hydrationは、サーバーサイドでレンダリングした静的HTMLに、クライアントサイドの動的レンダリングができるようにするようなものです。

※ クライアントサイド統合(Web Components)でも良かったのですが、私都合により却下となりました。

# Micro Frontends サンプルWebアプリ

apple, banana, orangeという商品を検索するだけのサンプルWebアプリを作りました。

概要図はこちらです。

![micro frontends sample overview](https://res.cloudinary.com/silverbirder/image/upload/v1588513402/micro-frontends-sample-code/micro_frontends_sample.jpg)

サンプルコードは、ここに置いています。
<iframely-embed card="small" url="https://github.com/Silver-birder/micro-frontends-sample-code"></iframely-embed>

## サービス

|サービス|役割|JSフレームワーク|
|----|----|----|
|team-search|商品を検索するサービス|Vue.js|
|team-product|商品を表示するサービス|React.js|
|team-page|サービスを統合するサービス|フレームワーク未使用 (Node.js)|


##  仕組み
Podium というライブラリを採用しました。

<iframely-embed card="small" url="https://github.com/podium-lib/"></iframely-embed>

これは、フロントエンドのサービスを簡単に統合できるようなライブラリになっています。
Podium には大きく分けて3つの機能があります。

* [@podium/podlet](https://www.npmjs.com/package/@podium/podlet)
  * ページフラグメントサーバーを構築する
  * ex. team-search, team-product
* [@podium/layout](https://www.npmjs.com/package/@podium/layout)
  * Podletを集めて、ページ全体のレイアウトを構築する
  * ex. team-page
* [@podium/browser](https://www.npmjs.com/package/@podium/browser)
  * ブラウザベースの機能を提供する
  * MessageBus による Podlet同士のコミュニケーション
  * ex. team-search, team-product で publish/subscribe

### @podium/podlet

Podletには、manifest.json と呼ばれる値を返却することが必須になっています。
menifest.jsonには、サービスのエンドポイントや、Asset(JSやCSS)のパスが明記されています。

team-search では

```shell
$ curl https://team-search.fly.dev/manifest.json | jq .
  {
    "name": "search",
    "version": "1.0.0",
    "content": "/",
    "fallback": "",
    "assets": {
      "js": "/search/static/fragment.js",
      "css": ""
    },
    "css": [],
    "js": [
      {
        "value": "/search/static/fragment.js",
        "async": true,
        "defer": true,
        "type": "default"
      }
    ],
    "proxy": {}
  }
```

というレスポンス結果になります。

### @podium/layout

Layoutでは、Podletのmanifest.jsonの定義に従って fetchすることになります。

team-page では

```javascript
// server.js (express)
app.get(`/`, async (req, res) => {
    const incoming = res.locals.podium;

    const [searchBox] = await Promise.all([
        podletSearch.fetch(incoming, {pathname: '/search/box', query: req.query}),
    ]);
    const [items] = await  Promise.all([
       podletProduct.fetch(incoming, {pathname: '/product/items', query: {id: searchBox.headers['x-product-items']}})
    ]);

    res.podiumSend(`
        <html>
            <head>
                <title>Shop</title>
                ${searchBox.js.map(js => js.toHTML())}
                ${items.js.map(js => js.toHTML())}
            </head>
            <body>
                <div id="app-shell">
                    ${searchBox.content}
                    ${items.content}
                </div>
            </body>
        </html>
    `);
});
```

のようにPodletを使って、ページ全体を構築します。このようにサーバーサイドで統合しています(SSR)。
しかし、インタラクティブなアクションも必要なため、PodletからHydrateするためのjsを読み込んでいます。

また、team-searchの検索結果(x-product-items)をteam-productへ渡しているため、商品の検索結果を含めてSSRが実現できます。

### @podium/browser

サーバーサイドは、podium/podlet, podium/layoutで連携できます。
クライアントサイドは、この @podium/browserのMessageBusで連携できます。

今回のサンプルWebアプリでは、次のようなユースケースに使用しています。

1. ユーザーが検索ボックスにキーワードを入力する
2. team-searchがキーワードから商品を検索する
3. team-searchが2の結果をpublishする
4. team-productが3をsubscribeし、商品を更新する


```javascript
// team-search.js
messageBus.publish('search', 'search.word', {items: hitItems});
```

```javascript
// team-product.js
messageBus.subscribe('search', 'search.word', event => {
    hydrate(<Items {...{items: event.payload.items}} />, document.querySelector('#team-product-items'));
});
```

このようにすることで、画面更新ではなく部分更新ができました。
インタラクティブな操作も実現可能です。

## 状態管理, ルーティング

ここは、まだきちんと作っていませんが、次のようなコンセプトで設計するのが良いと思います。

* 状態管理
  * 各サービスが状態管理する。状態は共有しない。
  * 統合サービスが共通的な状態を管理する。
* ルーティング
  * 各サービスがqueryを設定する。
  * 統合サービスがURLパスを管理する。

## その他

各サービスは、fly.io というPaaSへデプロイしています。

<iframely-embed card="small" url="https://fly.io/"></iframely-embed>

CDNでSSRが実行できる <b>Edge Worker</b>を使用しています。
これにより、SSR結果をキャッシュし、高速にレスポンスを返却できます。

ただ、サンプルWebアプリでは、全くその力を引き出せていないです...

※ 参考記事
<o-embed src="https://mizchi.hatenablog.com/entry/2019/02/21/235403"></o-embed>

# サンプルWebアプリで分かったこと
## SSR + CSR (Hydration) が実現可能

<b>サーバーサイド統合であっても、CSRは実現可能</b>です。
ただし、Hydrationには<b>パフォーマンス面に難有り</b>なため、このあたりは課題として残ります。
また、CSRするためのbundleしたjavascriptのsizeには注意が必要です。

例えば、次のリポジトリにある "shared_vendor_webpack_dll" のように、vendorファイルを共有することで、
javascriptのsizeを減らすといった手段があります。

<iframely-embed card="small" url="https://github.com/naltatis/micro-frontends-in-action-code"></iframely-embed>

また、次のリポジトリにある zalando tailorは、script loadをstreamingすることで、
全体のscript load完了時間を短縮するツールもあります。

<iframely-embed card="small" url="https://github.com/zalando/tailor"></iframely-embed>

## サービス内で技術スタックを選択できる

マイクロサービスでは、よくあるメリットとして挙げられるものです。
フロントエンドでも、同様に技術スタックを自由に選択できます。

今回では、React.jsとVue.jsを使用しています。
これを Riot.jsやSvelte.jsにも切り替えることも可能です。
<b>フロントエンド界隈では、JSフレームワークの変化が激しい</b>ので、
このメリットは大切だと思います。

ただし、Podiumのmanifest.jsonを返却しなければなりません。
今の所、Podiumに対応しているのはExpressのみなので、Expressを使用する
フレームワークのみとなります。

## サービス毎のフロントエンドに集中できる

検索サービスだと、検索に特化したフロントエンドのみに集中することができます。
商品サービスだと、商品の表示内容のみに集中することができます。

ただ、どうしても他サービスと連携する要件が出てきます。
これは、マイクロサービスとしての難しさだと思います。
例えば、各サービスがどのタイミングでイベント登録するのかを考える必要があります。

# 最後に
ECサイトのようなアプリケーションでは『商品を探しやすくする』『買いたくなるような商品を表示する』
『商品を簡単に購入できる』などフロントエンドでやるべきことが多くあります。

そういうサービスにおけるフロントエンドがモノリシックであれば、
統一性が欠けてしまったり、知らぬ間にバグを埋め込んでしまうケースが発生してしまいます。

Micro Frontendsは、このような<b>複雑化するフロントエンドにメスを入れる良いアーキテクチャ</b>だと思います。
ただし、バックエンドにおけるマイクロサービス化による課題があるように、フロントエンドにおける
マイクロサービス化にも課題はあるはずです。

日本では、Micro Frontendsの導入実績が少なく、まだまだ発展途上だと思います。
この記事が、どこかのサービスへの参考になればと思います。

最後まで読んで頂き、ありがとうございました。

# 参考リンク

<iframely-embed card="small" url="https://github.com/ChristianUlbrich/awesome-microfrontends"></iframely-embed>
