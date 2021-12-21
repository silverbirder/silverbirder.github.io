---
title: silverbirderのポートフォリオページ刷新
published: true
date: 2021-03-03
description: この度、私のポートフォリオページを刷新致しました。本記事では、刷新することになった動機から、刷新内容、今後について紹介したいと思います。
tags: ["Portfolio", "Renewal"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1640068525/silver-birder.github.io/blog/silverbirder_portfolio_amp_overview.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1640068525/silver-birder.github.io/blog/silverbirder_portfolio_amp_overview.png
---

この度、私のポートフォリオページを刷新致しました。本記事では、
刷新することになった動機から、刷新内容、今後について紹介したいと思います。

<!--  TODO: TOC -->

# 動機

元々、私のポートフォリオページは、静的ページジェネレーターであるHugoを使って
構築していました。

[http://kohki.hatenablog.jp/entry/hugo-portfolio](http://kohki.hatenablog.jp/entry/hugo-portfolio)  <!--  TODO: embed  -->

こちらの記事を参考にして、Hugoでポートフォリオページを作りました。
その当時、なぜポートフォリオを作ったのかというと、確か次の3つの思いがありました。

* 私がどういった人かを知ってもらいたい
* 自分のサイトを持ちたい
* 静的ページジェネレーターを使ってみたい

Hugoで記事を管理する対象は、Markdownであるため、エンジニアにとって書きやすいです。
また、デザインテーマは、公開されているテーマがあるので、好きなものを選びます。

導入当初は、とても快適でした。手軽にオシャレなポートフォリオサイトを公開できて満足でした。
しかし、ずっと使っていると、かゆいところに手が届ないもどかしさを感じるようになりました。
これは、便利さとのトレードオフだと思いますが、下記のようなデメリットがあると認識し始めました。

* Javascriptで技術的な挑戦が難しい
* デザインテーマのカスタマイズが難しい
* SEOのチューニングが難しい

便利さというメリットよりも、デメリットの方が大きいように思い始めました。
そのため、独自にポートフィリオサイトを作成することにしました。

# やったこと

AMPを存分に使ったポートフォリオサイトを作成しました。全体像は、下記のとおりです。

![overview](https://res.cloudinary.com/silverbirder/image/upload/v1640068525/silver-birder.github.io/blog/silverbirder_portfolio_amp_overview.png)

[AMP Optimizer](https://www.npmjs.com/package/@ampproject/toolbox-optimizer)を中心とした構成です。
ソースコードは、下記のリポジトリにあります。

[https://github.com/Silver-birder/silver-birder.github.io](https://github.com/Silver-birder/silver-birder.github.io)  <!--  TODO: embed  -->

# 技術選択

今回のポートフォリオサイトに、必要以上の機能を持つWebフレームワーク(e.g. Next.js)を使うのは、メンテナンスコストが高くなるので、却下としました。
また、静的ページジェネレーター(e.g. Gatsby)も、動機の理由より却下としました。
そのため、必要最小限な構成を目指しました。結果、次のような流れとなりました。

1. コンテンツを用意する(Markdown,HTML,JSON)
2. 1をインプットとして[AMP Optimizer](https://www.npmjs.com/package/@ampproject/toolbox-optimizer)でAMP化する

これらの順序を制御するタスクランナーとして、[Gulp](https://www.npmjs.com/package/gulp) を採用しました。
[AMP Optimizer](https://www.npmjs.com/package/@ampproject/toolbox-optimizer)は、NPMでインストールするので、Node.jsと相性が良いタスクランナーを求めました。
その選択肢として、GruntやGulpがあったのですが、[AMPの公式サイトではGulpを紹介されていた](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/amp-optimizer-guide/node-amp-optimizer/)ので、Gulpを選択しました。

大きな技術選択としては、これくらいです。他の細かい所は、下記のとおりです。

* highlightjs
  * プログラムコードのハイライト機能
* jsdom
  * htmlの各処理
    * h1~h6タグのAnchor設定(anchorJS風)
    * HTMLのテンプレートとメインコンテンツのMix
    * ...etc
* ampcssframework
  * Dark ThemeやGrid機能が欲しかった
* Cloudinary
  * 画像管理SaaS。OGPなどに利用
* SEO向け
  * Google search console
  * Google analytics

# ポートフォリオコンテンツ

ポートフォリオサイトにどういったコンテンツを用意しようか悩みました。
[AMP OptimizerにMarkdownオプション](https://github.com/ampproject/amp-toolbox/tree/main/packages/optimizer#markdown)があります。
これは、HTMLだけではなく、Markdownも(HTML経由で)AMP化することができるようです。
そのため、ブログのようなコンテンツもポートフォリオページに加えることができそうと気づきました。
また、これまで私が書いたブログコンテンツは、Markdownで管理していたので、ちょうど使えそうでした。

結果、次のようなコンテンツを用意しました。

* 自己紹介
* ブログ
* 持っている本検索
* 買ったものリスト
  * アマゾンで買ったもの、サブスク
* ウォッチ
  * チェックしてるRSS
* プロジェクト
  * 作ったものの紹介

ウォッチページで、RSSのWebPush機能を追加しようとしましたが、Pushする側であるServerが必要となり、開発が伸びそうだったのでやめておきました。

# 刷新してどうだったか

想定通り、Hugoではできなかったような様々なポートフォリオサイトの機能拡張ができるようになりました。

* Javascriptで技術的な挑戦が難しい
  * AMPや、Web Worker(amp-script)を試せた
* デザインテーマのカスタマイズが難しい
  * CSSフレームワークや、CSSのチューニングができた
* SEOのチューニングが難しい
  * SearchConsoleやGoogleAnalyticsが使えた
  * sitemapやmetaタグのチューニングができた

想定通りにできなかったのは、AMPの制約なのですが、WebComponentsのようなamp-script上で動かせない技術もあるということでした。
また、WebWorker(amp-script)上で、ES Module([skypack](https://skypack.dev/))をImportしようとしても、Safariが未対応だったりで、断念したりもしました。

ただ、最終的な感想としては、HTMLを柔軟に処理できるようになったので、AMP上でできることは何でもできるようになり、刷新してよかったと思います。

# 学んだこと

経験学習モデルより、簡単に振り返ります。(はじめて)

|経験|省察|概念化|試行|
|---|---|---|---|
|AMPを初めて使ってみた|AMP使ったことなかったけど、思っていたより課題は少なかった。<br>しかし、想定していなかった課題もあった。|使ったことがない技術要素の課題は、想定していても未知数|未知数な技術は、軽く試してみる|
|Next.jsやGatsbyなど、フレームワークを使わなかった|シンプルな構成にしたかった。<br>必要以上に機能が多いフレームワークを入れたくなかった。|保守性を担保するため、最小限の機能で構成|大掛かりな技術の選択は、保守性と天秤にかける|

# 終わりに

ポートフォリオ刷新をしました。これまで1からWebサイトを作ったことがなかったので、
sitemapやJSON-LDなど全て手作りで開発したので、良い勉強になりました。
まだまだポートフォリオの課題は山積みですが、少しずつ改善していきたいと思います。
