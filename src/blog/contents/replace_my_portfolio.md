<!-- 
title: silverbirderのポートフォリオページ刷新
date: 2021-03-03T20:41:00+09:00
draft: true
description: 
image: 
icon: ⚡️
-->

この度、私のポートフォリオページを刷新致しました。本記事では、
刷新することになった動機から、刷新内容、今後について紹介したいと思います。

[:contents]

# 動機

元々、私のポートフォリオページは、静的ページジェネレーターであるHugoを使って
構築していました。

[http://kohki.hatenablog.jp/entry/hugo-portfolio:embed]

こちらの記事を参考にして、Hugoでポートフォリオページを作りました。
その当時、なぜポートフォリオを作ったのかというと、確か次の3つの思いがありました。

* 私がどういった人かを知ってもらいたい
* 自分のサイトを持ちたい
* 静的ページジェネレーターを使ってみたい

Hugoで記事を管理する対象は、Markdownであるため、エンジニアにとって書きやすいです。
また、デザインテーマは、公開されているテーマがあるので、好きなものを選びます。

導入当初は、とても快適でした。手軽にオシャレなポートフォリオサイトを公開できて満足でした。
しかし、ずっと使っていると、やっぱりかゆいところに手が届ないのに、もどかしさがあります。
これは、便利さとのトレードオフだと思いますが、デメリットの方が大きく感じるようになりました。
例えば、下記のようなことにデメリットと感じるようになりました。

* Javascriptで技術的な挑戦が難しい
* デザインテーマのカスタマイズが難しい
* SEOのチューニングが難しい

そのため、独自にポートフィリオサイトを作成することにしました。

# やったこと

AMPを存分に使ったポートフォリオサイトを作成しました。全体像は、下記のとおりです。

![overview](https://raw.githubusercontent.com/Silver-birder/Silver-birder.github.io/main/overview.png)

ソースコードは、下記のリポジトリにあります。

[https://github.com/Silver-birder/silver-birder.github.io:embed]

# 技術選択

今回のポートフォリオサイトに、必要以上の機能を持つWebフレームワーク(e.g. Next.js)を使うのは、ちょっとメンテナンスコストが高くなるので、
必要最小限の構成にしたいと思いました。そのため、ざっくり、次の流れの構成にしました。

1. コンテンツを用意する(Markdown,HTML,JSON)
2. 1をインプットとして[AMP Optimizer](https://www.npmjs.com/package/@ampproject/toolbox-optimizer)でAMP化する

これらの順序を制御するタスクランナーとして、[Gulp](https://www.npmjs.com/package/gulp) を採用しました。
AMP Optimizerは、NPMでインストールするので、nodeと相性が良いタスクランナーを求めていました。
その選択肢として、GruntやGulpがあったのですが、[AMPの公式サイトではGulpを紹介されていた](https://amp.dev/documentation/guides-and-tutorials/optimize-and-measure/amp-optimizer-guide/node-amp-optimizer/)ので、Gulpを選択しました。

大きな技術選択としては、これくらいで、あとは細かい技術周りは、簡単にまとめておきますと

* highlightjs
  * プログラムコードのハイライト
* jsdom
  * htmlの各処理
    * h1~h6タグのAnchor設定(anchorJS風)
    * HTMLのテンプレートとメインコンテンツのMix
    * ...etc
* ampcssframework
  * dark themeとかgridとか欲しかったので
* cloudinary
  * 画像管理。OGPなどに利用
* SEO向け
  * google search console
  * google analytics

# ポートフォリオコンテンツ

ポートフォリオサイトにどういったコンテンツを用意しようか悩みました。
[AMP OptimizerにMarkdownオプション](https://github.com/ampproject/amp-toolbox/tree/main/packages/optimizer#markdown)があります。
これは、HTMLだけではなく、Markdownも(HTML経由で)AMP化することができるようです。
そのため、ブログのようなコンテンツもポートフォリオページに加えることができそうと気づきました。

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

# 刷新してどうだったか

想定通り、Hugoではできなかったような様々なポートフォリオサイトの機能拡張ができるようになりました。

* Javascriptで技術的な挑戦が難しい
  * AMPや、Web Worker(amp-script)を試せた
* デザインテーマのカスタマイズが難しい
  * CSSフレームワークや、CSSのチューニングができた
* SEOのチューニングが難しい
  * SearchConsoleやGoogleAnalyticsが使えた
  * sitemapやmetaタグのチューニングができた

想定通りにできなかったのは、AMPの制約なのですが、WebComponentsのようなamp-script上で動かせない技術が使えないことでした。
また、WebWorker(amp-script)上で、ES Module([skypack](https://skypack.dev/))をImportしようとしても、Safariが未対応だったりで、断念したりもしました。

# [WIP] 刷新を通して学んだこと

まずは、具体的な所での学びは、AMPの使い方を知りました。当初、AMPは使ったことなかったのですが、
イメージとしてはJavascriptが一切使えない？と思ったりしていましたが、実際に使ってみると、そうでもなかったです。

これを抽象的に捉えると、使ったことがない技術を使おうとしたときに、想定している課題は、以外は解決していて、
別の課題が見えたりするのかなと思います。

そう思うと、もう一度具体的に見ると、AMPだけじゃなくて、デザインの変更も、同様だったなと思いました。
当初、GithubのCSSデザインを適用すれば良いと思っていたのですが、それだとDarkThemeやBlockquoteなどが
イマイチでした。であれば、AMPに最適なcssフレームワークを別で選択することとなり、ampcssframeworkを使うようになりました。

# 終わりに

TODO
