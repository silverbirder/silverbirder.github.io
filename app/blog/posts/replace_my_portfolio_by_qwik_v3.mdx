---
title: 'Qwikでブログページを刷新して学んだこと'
publishedAt: '2023-10-23'
summary: 'こんにちは。@silverbirderです。最近、私のブログページを Qwik フレームワークで刷新しました。以下のリンクが、刷新したページになります。'
tags: ["Portfolio", "Artifact", "Qwik"]
index: false
---

こんにちは。[@silverbirder](https://x.com/silverbirder)です。
最近、私のブログページを Qwik フレームワークで刷新しました。以下のリンクが、刷新したページになります。

https://silverbirder.github.io/blog/

これで、私のブログページの刷新は 4 回目になります。この記事では、その過程で得た学びや経験を共有します。

ちなみに、これまでの刷新に関する記事は、以下のリンクより確認できますので、よければご覧ください。

https://silverbirder.github.io/blog/tags/portfolio/

GitHub のリリースタグも利用していますので、以下のリンクから過去のソースコードを参照できます。

https://github.com/silverbirder/silverbirder.github.io/tags

ソースコードも公開しているので、こちらもよければ参考にしてみてください。

https://github.com/silverbirder/silverbirder.github.io

## なぜ刷新したのか

刷新の動機は主に好奇心です。
それに続いて、自分の技術的知見を広げるためでもあります。
過去には静的サイトジェネレータの Hugo や Google が推奨する AMP、WebComponents を活用できる Rocket などを試してきました。
それぞれの技術には当時の流行や興味を反映していました。今回も、現在のトレンドや興味を持っている技術を中心に選択しました。

## Qwik フレームワークの選択

Qwik はパフォーマンスを重視した Web フレームワークですが、そこはあまり重要視していませんでした。
私が Qwik を選んだ主な理由は 以下の点です。

- Markdown のサポート
  - ブログ記事を書くのに Markdown が使うため
- `State of JS`での高い評価
  - 評価が高いからこそ、学ぶ価値があると思った
- React に近い構文
  - 自身の学習コストを下げたかった

ブログ記事の Markdown の Frontmatter にタグ情報を記入していたので、それを活用したいと考えました。調べていくと、 `import.meta.glob` という構文を知り(Vite の機能)、Frontmatter を抽出する方法を発見しました。これを参考にブログページの構築を開始しました。

## 機能実装したこと

実際にブログで実装した機能は、[silverbirder/silverbirder.github.io - GitHub](https://github.com/silverbirder/silverbirder.github.io) の README に詳しく記載しています。
主な機能や導入技術を以下に列挙します。

- **@unpic/qwik** 🚀📸
- **Partytown** 🥳🌐
- **PandaCSS** 🐼💃
- **Playwright & Vitest** 🎭🔬
- **Qwik** ⚡🕸️
- **qwik-speack** 🌏🔊
- **Storybook** 📓🌟
- **Buy me a coffee** ☕💖
- **Chromatic** 🌈📊
- **Cloudinary** 🌌🖼️
- **giscus** 🐦🗨️
- **Google Analytics** 🕵️‍♂️📈
- **icones.js** 📌🌈
- **lottiefiles** 🎬📁
- **OpenAI** 🧠🌐
- **OpenReplay** 🎥🔄
- **OneSignal** 📡💌

また、Markdown の Frontmatter を抽出し JSON 化し、それを使ってブログページを構築しています。(RSS フィードも同様)

## 学んだこと

元々は、Qwik というフレームワークのコンセプトを知り学びを深めようと考えていました。

https://qwik.builder.io/docs/concepts/think-qwik/

しかし、Qwik でブログ構築する過程で、フレームワーク自体ではなく、関連する技術やツールに興味関心が移りました。私の知る範囲でキャッチアップするよりも、こういった伸び代ある技術を学ぼうすることで、知らない技術を知る良い機会となりました。
以下は、その中で学んだことです。

### PandaCSS

PandaCSS というスタイルエンジンを知りました。
私は、これまで Bootstrap や materialUI のような CSS フレームワークを使うことが多かったのです。
しかし、最近業務でランディングページの開発をする経験から、CSS を書いてみたくなりました。
そこで、PandaCSS を使って、自分で CSS を書いてみました。

global.css を初めて 0 から書いてみましたし、タイポグラフィ定義やセマンティックトークン定義を使ってみたりしました。こういった再利用性の高い CSS を書けるのは良いなと思いました。CSS-in-JS の記法が使えつつ、CSS ファイルを生成できていて、便利だなと思いました。(詳しくない)

### 多言語対応

多言語対応、初めてチャレンジしました。といってもなんちゃってです。
多言語対応の対象は、Markdown の日本語記事やコンポーネントに含まれる日本語です。日本語を英語に翻訳します。
本来は、日本語から英語に翻訳したものをチェックする人が必要だと思います。しかし個人レベルなら、そこまでやる必要はないかなと思いました(というより能力がない)。そこで、qwik-speack、chatgpt-md-translator の 2 つを使って翻訳しました。内部では、OpenAI の使っているようです。

多言語対応をすると、WebPush する通知コンテンツやリンクコンテンツにも気を使うようになりました。
実際に業務として使うならば、最初の段階からあると良いかもなぁと思います。(仕組みだけでもあると良い)

### SaaS の利用

今回は、SaaS を色々使ってみました。

#### OpenReplay

OpenReplay というものを導入しました。

https://openreplay.com/

これは、ユーザーの行動を監視するものです。
実際の運用としては、トラブルシュートや UX 改善などに使えそうなものに思いました。

これをブログページに入れたので、どのページのどのあたりにマウスカーソルが動かすのか見れるので、リンク配置や動線を考えさせられるきっかけとなりました。

#### OneSignal

WebPush 通知もやってみたいと思いました。
しかし、WebPush 通知するサーバー側の用意が必要と思うのですが、それを掛けるコストはなくしたいと思い、
よく知られている OneSignal というものを入れてみました。

https://onesignal.com/

通知をするときに、言語の選択や、通知を受け取るためのベストプラクティスが OneSignal に書いてあり、勉強になりました。

https://documentation.onesignal.com/docs/permission-requests#what-are-some-best-practices-around-web-push-prompting

#### Giscus

Qwik を選ぶ前、技術調査をしていたときに Material for MkDocs というのを発見し、
その中で、giscus というを見つけました。

https://giscus.app/ja

これは、GitHub の Discussions をブログに埋め込むことができます。これにより、ブログにコメントを残せるようになりました。

## 途中で諦めたもの

### Changesets

`changesets`を利用してバージョン管理を試みましたが、途中で運用が面倒になり挫折しました。

### Turborepo

`turborepo`での monorepo 構成も夢見ていましたが、挫折しました。考えていた構成は以下の通りです。

- apps/docs
- packages/ui
- packages/blog-contents
- packages/translate

しかし、PandaCSS や Qwik の UI ライブラリをうまく組み合わせるのが難しく、実現できませんでした。

## 今後の展望

例えば、dark モード対応、もしくはテーマカラーの変更ができる機能を作ってみたいなと思いました。
他には、Playwright を使って、cucumber を試してみたいなと思っています。
デザインは、初めて CSS でフルスクラッチでやったので、デザインにもっと強くなりたいと思いました。

## 最後に

この刷新を通じて、多くの新しい技術やツールに触れることができました。
それぞれの技術には独自の魅力や学びがあり、非常に充実した経験となりました。
これからも、新しい技術やアイディアを追求していきたいと思います。
