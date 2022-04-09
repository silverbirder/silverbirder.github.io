---
title: Cloudflare Workers (Edge Worker) で Micro Frontends
published: true
date: 2020-11-15
description: 今回、またMicro Frontendsの構築を試みようと思います。構築パターンの内、サーバーサイド統合パターン、特にエッジサイド統合を試しました。その内容を紹介します。サンプルコードは、下記に残しています。
tags: ["Cloudflare Workers", "Edge Worker", "Micro Frontends"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614430655/silver-birder.github.io/blog/cloudflare_worker_micro_frontends.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614430655/silver-birder.github.io/blog/cloudflare_worker_micro_frontends.png
---

今回、またMicro Frontendsの構築を試みようと思います。構築パターンの内、サーバーサイド統合パターン、特にエッジサイド統合を試しました。
その内容を紹介します。サンプルコードは、下記に残しています。

<ogp-me src="https://github.com/Silver-birder/micro-frontends-sample-code-5/"></ogp-me>

<!--  TODO: TOC -->

# Edge Side Include (ESI)って？

<ogp-me src="https://www.w3.org/TR/esi-lang/"></ogp-me>

ESIは、SSIと似たようなもので、サーバーサイド側でコンテンツを挿入する仕組みの1つです。ESIの場合、挿入するコンテンツ(ページフラグメント)がEdge側にあると理解しています。
そのため、Edgeキャッシュをコンテンツ毎に効かせれるメリットがあります。
現状、ESI言語仕様はW3Cへ提出していますが、承認が降りていない状況です。AkamaiなどのCDN企業や、Varnishなどのキャッシュプロキシサーバは、ESIを一部実装しています。

個人で試すのに、Akamaiは金銭的に厳しいですし、varnishのVCLを記述したくない(好き嫌い)です。
そこで、Edge Workerと呼ばれる仕組みを試そうと思います。

次の引用はAkamaiブログからです。

> EdgeWorkersは、世界中に分散配置されたAkamaiのEdgeサーバー上で、カスタムしたプログラムコードを実行できるようになる新しいサービスです

※ [https://blogs.akamai.com/jp/2019/10/edgeworker.html](https://blogs.akamai.com/jp/2019/10/edgeworker.html)

要は、Edge WorkersとはCDNが提供するプラットフォーム上で、プログラムコード、例えばJavascriptなどが実行できるサービスです。

# Edge Workers

個人で使えるEdge Workersだと、[fly.io](https://fly.io)や[Cloudflare Workers](https://developers.cloudflare.com/workers/) があります。後者のCloudflare Workersには、[HTMLRewriter](https://developers.cloudflare.com/workers/runtime-apis/html-rewriter) というHTMLを書き換える機能があり、Micro Frontendsに使えそうだったため、今回はCloudflare Workersを使用します。


# 構成

次のような構成を考えてみました。

<figure title="Cloudflare worker + Micro Frontends">
<img alt="Cloudflare worker + Micro Frontends" src="https://res.cloudinary.com/silverbirder/image/upload/v1614430655/silver-birder.github.io/blog/cloudflare_worker_micro_frontends.png">
<figcaption>Cloudflare Workers + Micro Frontends</figcaption>
</figure>

※ [Podium](https://podium-lib.io/)と[Ara-Framework](https://ara-framework.github.io/website/) に影響されています。  
※ [draw.io](https://draw.io/)のsketch styleで書きました。

それぞれのブロックがCloud Workersとなります。

簡単に、図の左から右の順に説明していきます。
Routerで、Webアプリケーションのルーティングを管理します。
ルーティングでは、HTTPリクエストの内容に基づいて、どのページか振り分けます。
振り分けられたページでは、後述するフラグメントを含めてHTMLを構築します。
そのHTMLをHTMLRewiterで処理し、Proxyに存在するフラグメントがあれば、フラグメントのHTMLへ置換されます。
フラグメントでは、HTML,CSS,JSを取得するPATHをJSON形式で返却するようにします。
JSONを返すURLは、/manifest.json と統一しています。

このような構成を取ることで、担当領域を分割することができます。
例えば、フラグメントAとページXをチーム1が管理し、フラグメントB、C、ページYをチーム2が管理するなどです。

また、RustのWebAssemblyを下記のようなテンプレートで組み込むことができます。

<ogp-me src="https://github.com/cloudflare/rustwasm-worker-template"></ogp-me>

特定の重い処理をRustのWebAssemblyで処理するようなフラグメントをページに混ぜることができます。

# 構築して困ったこと
## 同一ドメイン内でのEdge Workers通信が不可

Cloudflare Workersは、任意のドメインで動かすことになります。
例えば、ドメインA内に複数のCloudflare Workers XとYがあったとすると、
XからYへの通信ができないです。

<ogp-me src="https://community.cloudflare.com/t/issue-with-worker-to-worker-https-request/94472/37"></ogp-me>

そのため、複数のCloudflare Workersを使用する場合は 複数のドメインが必要になります。
先程の例なら、ドメインAに属するCloudflare Workers XからドメインBに属するCloudflare Workers Yへ通信することができます。
私は、freenomのtkドメイン(無料)を複数購入しました。

<ogp-me src="https://freenom.com/"></ogp-me>

## 直接IPアドレスへリクエストできない

ローカル開発時に困ったことがあります。
Cloudflare Workersをローカル開発する場合、[wrangler:dev](https://github.com/cloudflare/wrangler#-dev) というコマンドで検証します。
検証中に、他のCloudflare WorkersのURL(localhost:XXXX)へアクセスしようとしても、直接IPとなるため失敗します。

<ogp-me src="https://support.cloudflare.com/hc/ja/articles/360029779472-Cloudflare-1XX-%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E3%83%88%E3%83%A9%E3%83%96%E3%83%AB%E3%82%B7%E3%83%A5%E3%83%BC%E3%83%86%E3%82%A3%E3%83%B3%E3%82%B0#error1003"></ogp-me>

そのため、下記のようなサービスを使って、私は解決させました。

<ogp-me src="https://ngrok.com/"></ogp-me>

<ogp-me src="https://github.com/localtunnel/localtunnel"></ogp-me>

## Cloudflare Workersによる制約が大きい

Cloudflareのプラットフォーム上では、下記のランタイムAPIが使用できます。

<ogp-me src="https://developers.cloudflare.com/workers/runtime-apis"></ogp-me>

Cloudflare Workersの仕組みを把握していないのですが、この提供されているAPI以外は、
確か使えなかったような気がします。

# 最後に

Edgeって、私の印象では、単なる静的コンテンツを置くだけのものと考えていました。
それが、動的なコンテンツ、つまりEdge Workersのような存在を知り、Edgeの世界が広がったように感じます。
Webアプリケーションを、よりユーザーに近いEdgeへ配置するようにすれば、レスポンス速度改善が期待できます。

Micro Frontendsというより、Edge Workersの話が多かったですね。(笑)
