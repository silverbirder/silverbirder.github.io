---
title: WebComponentsでoEmbedのコンポーネントを開発して、学んだこと
published: true
date: 2022-03-25
description: WebComponents で、oEmbed ぼコンポーネントを開発し、公開しました。開発していく上で、学んだことを列挙しようと思います。
tags: ["Web Components", "oEmbed", "Publish", "Learn"]
---

WebComponents で、oEmbed コンポーネントを開発し、公開しました。

- https://www.webcomponents.org/element/Silver-birder/o-embed
- https://www.npmjs.com/package/@silverbirder/o-embed

開発していく上で、学んだことを列挙しようと思います。

## スターターキット

Web Components を開発する場合、次のどちらかのスターターキットを使うのが良さそうです。

- [webcomponents.dev](https://webcomponents.dev/)
- [open-wc](https://open-wc.org/)

これらを使わずとも、Web Components を開発できるのですが、Typescript で書いたり、テストをしたりするには、
それなりに準備が必要です。そのため、開発の初速を高めたいなら、スターターキットを使いましょう。

もしくは、先にスターターキットを使わず素の Javascript だけで Web Components を作ってみて、その後にスターターキットを使うと良さを実感できるかもしれません。

個人的に、open-wc をお勧めします。なぜなら、以下のツールが揃っているからです。

- Testing
- Demoing
- Building
- Linting

もちろん、Typescript もサポートしています。

## キャッチアップ

Web Components ってどういうものなのか、キャッチアップするには MDN のサイトが参考になります。

- [ウェブコンポーネント | MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components)

また、日本語で WebComponents(Custom Elements)の仕様書もあります。

- [HTML Standard — Custom elements（日本語訳）](https://triple-underscore.github.io/HTML-custom-ja.html)

Chrome の中にある Chromium におけるレンダリングエンジン blink の実装コードも、公開されています。

- [chromium/third_party/blink/renderer/core/html/custom/README.md](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/custom/README.md)

## ベストプラクティス

Google より、Custom Elements のベストプラクティスが公開されています。

[Custom Element Best Practices  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/web-components/best-practices)

例えば

> Always accept primitive data (strings, numbers, booleans) as either attributes or properties.

にあるように、プリミティブなデータのみ HTML の属性に渡すようにしましょう。
オブジェクトや配列のようなリッチなデータは、シリアル化する必要がありオブジェクト参照がなくなってしまう欠点があります。

## テスト

Web Components のテストを書くには、Shadow DOM に対応する必要があります。
JSDOM のように、ブラウザ API をラップするライブラリを使っても良いのですが、ヘッドレスブラウザを使ったほうが妥当です。
そこで、[@web/test-runner](https://www.npmjs.com/package/@web/test-runner)が便利です。
このテストライブラリは、open-wc と同じ Modern Web というモノの 1 つです。
@web/test-runner には、Puppeteer、Playwright、Selenium の 3 つをサポートしています。

## Publish

作成した Web Components を Publish したい場合、次の記事を読むと良いです。

[Developing Components: Publishing: Open Web Components](https://open-wc.org/guides/developing-components/publishing/)

特に、してはいけないことを読むと、なるほどな〜ってなります。

> ❌ Do not optimize  
> ❌ Do not bundle  
> ❌ Do not minify  
> ❌ Do not use .mjs file extensions  
> ❌ Do not import polyfills

詳しくは、上記の記事を読んでください。

## 終わりに

Web Components をプロダクションレベルで使えるようになりたいなと思います。
