---
title: WebComponentsでoEmbedのコンポーネントを開発して、学んだこと
published: true
date: 2022-03-25
description:
tags: ["Web Components", "oEmbed", "Publish", "Learn"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

WebComponents で、oEmbed ぼコンポーネントを開発し、公開しました。

- https://www.webcomponents.org/element/Silver-birder/o-embed
- https://www.npmjs.com/package/@silverbirder/o-embed

開発していく上で、学んだことを列挙しようと思います。

## スタートキット

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

もちろん、Typescript をサポートしています。

## キャッチアップ

- [ウェブコンポーネント | MDN](https://developer.mozilla.org/ja/docs/Web/Web_Components)
- [HTML Standard — Custom elements（日本語訳）](https://triple-underscore.github.io/HTML-custom-ja.html)

## ベストプラクティス

[Custom Element Best Practices  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/web-components/best-practices)

## テスト

Shadow DOM に対応するテストツールが必要です。

## Publish

open-wc の記事が良い
webcomponents.org には、bower.json が必須。

[Developing Components: Publishing: Open Web Components](https://open-wc.org/guides/developing-components/publishing/)

## 終わりに
