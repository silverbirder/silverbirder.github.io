---
title: MarkdownとWebComponentsだけで完結する、モダンな静的ページジェネレータ、Rocketの紹介
published: true
date: 2021-12-22
description: 
tags: ["Web", "Rocket", "Modern Web Family"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

静的ページは、皆さんどのように作っていますか？

## Modern Web Family とは？
### Modern Web とは？

### 事例

* https://modern-web.dev/
* https://rocket.modern-web.dev/
* https://open-wc.org/
* https://apolloelements.dev/

## Rocketの特徴
### 11tyベース

Nunjucks(njk)

### Markdown + Web Components が使える

````md
```js script
// execute me
```
````

### Modern Web による 標準に従う

Modern Webは、標準的なWeb技術の開発を支援するプロジェクトです。
成り立ち的に、Web Componentsを中心としてテストランナー、リンター、フォーマッタ、開発サーバがあります。

標準にこだわるのは、Javascriptを扱う人の疲労が大きいところからと思います。
romaの話もありますが、webpackやbabelなどjavascriptを扱う周辺ツールが山程あり、それらの習得が大変です。
本来、プログラミング言語やプラットフォームに標準的な技術が備わっているはずですが、言語の成り立ち的に後追いで色々と生まれてしまいました。
そういった苦労を、かけず、Web標準の技術に従って開発することが、エンジニアのアジリティ向上につながるのだと思っています。

## 具体例

## 私のポートフォリオページ

## 終わりに

## 話の流れ

タイトル:
MarkdownでWebサイト構築するなら、Web Componentsが使えるSSG、Rocketがお勧め!

対象読者:
* 執筆活動に集中したい人
* 見た目はこだわらないし、得意ではない人
* Markdownだけでは機能的に物足りない人
* 移行コストを極力減らしたい人

Markdown とは？
Webライター向けのHTMLへ変換するための軽量マークアップ言語。
Webライターは、執筆に集中するべきであり、Webサイトの装飾、つまりCSSには拘りが低いはずです。
そのため、Markdownというのはコンテンツを作成できればよく、CSSをコーディングするというのは、目的から外れています。

Markdownでカバーできないもの?
Markdownでは、見出しやテーブル、箇条書きなどが揃っています。
しかし、Markdownにはサポートされていない機能が必要になった場合、どうすれば良いでしょうか。

例えば、zennやはてなブログでもよくある機能である、埋め込みコンテンツ(embed)や、目次作成(TOC)です。
これらは、Markdownの機能になく、HTMLの機能としてもありません。
そういった場合、HTMLの機能を拡張、つまりCustom Element(Web Component)を使いましょう。
標準技術なので、他のSSG、例えばHugoとかでも使えるはずです。

Rocketとは？

MarkdownとWeb Componentsで、Webサイトを作成できるSSGです。
公式には、事前レンダリング、ゼロ構成、ビルドサイズ縮小などがあります。

(あまり詳しくないですが)技術的には、11tyというMarkdownをHTMLへ変換する静的ジェネレータをラップしているようです。
単純にMarkdownとWeb Componentsだけを使いたいだけであれば、11tyでMarkdownをHTMLに変換し、Custom Element定義のjsを
ロードするだけでも良いです。ただ、Rocketは、Modern Webのメタフレームワークの上で動くので、Modern Web(後述します)の支援を享受できます。
例えば、Web Componentsの自動リロードや、テストランナーなども用意されています。
開発アジリティを向上したいならば、Rocketをおすすめします。

ちなみに、11tyはテンプレートとしてNunjucksを使っています。やろうと思えば、Web ComponentsではなくNumjucksでも同じものを実現できますが、
これは私は推奨しません。なぜなら、Numjucksに依存し、移行コストがあがるためです。

Modern Webとは？

https://modern-web.dev/

Web標準の技術を活用するためのガイドやツール、ライブラリを開発しているプロジェクトです。
ベンダーライブラリを利用することによる複雑さが激しいフロントエンド界隈で、Web標準技術を使うことでその複雑さを軽減する狙いがあります。
Web Componentsに対するテストランナー、開発サーバ、リンター、フォーマッタが整備されています。

Rocketの紹介:
事例は、○○○です。

機能的に良い点
* Preset
* Js script
* html link check

最後に:

## メモ

推しポイント、一言で。

Markdownでサイト(ブログやガイド、ドキュメント)を作るなら、WebComponentsがシームレスに使えるRocketがお勧め！

良いところは、Web標準であるWebComponentsでMarkdownと組み合わせできるところ。
MDXが、近いものだが、あれはJSX、つまりReact向けであって、標準ではない。
標準ではないため、その技術から別技術への移行のコストが大きい。

Markdownだけでブログを書きたかったが、Markdownでは物足りない(Markdown脳。本来の用途から逸脱しているのかもしれない)場合、
WebComponentsが使える。

Markdown って何？

https://daringfireball.net/projects/markdown/
https://en.wikipedia.org/wiki/Markdown

Webライター向けのテキストからHTMLへ変換するための軽量マークアップ言語。
つまり、Markdown→HTMLというのは本来の目的に合っている。
MarkdownにはStyleを当てるように機能はなく、Webデザイナーのように
装飾する機能はない。私も、Webライター寄りだ。

Markdownには不足する機能があったとする。例えばTOCやembedなどだ。
これらを補うためには、Markdown側で拡張するか、Markdown→htmlのコンバータに補うか、HTMLで補うかの3つだ。
MDXの場合は、MDX→JSX→HTMLであり、カスタム部品は、MDXにある。
これと同じく、Rocketも、Markdownにカスタム要素(WebComponents)を含めることができる。
ちなみに、Markdownに、HTML要素を含めるのは

> For any markup that is not covered by Markdown’s syntax, you simply use HTML itself. There’s no need to preface it or delimit it to indicate that you’re switching from Markdown to HTML; you just use the tags.

と書いてある通り、Markdownに不足するシンタックスは、HTMLで補うとのこと。つまり、WebComponentsで補うというのは、間違っていない。(正しい路線)

