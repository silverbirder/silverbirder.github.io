---
title: WebComponentsでライブラリ作ってみた
published: false
date: 2022-03-22
description: 
tags: []
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

## 書きたいこと

* o-embed を軽く紹介
* 素のwcだと型がなく開発体験悪いので、lit.dev使う
  * ts, storybook, test, かな
  * wcだけでも良いけど、、、カスケード更新のレンダリング苦労を考えるとlit-htmlは必要？
* webcomponents.dev、最初慣れるには良いかも。スタートに。
* webcomponents.org、bower.jsonが必須みたい。
* storybookで動作確認。
* googleのwcのベストプラクティスは読んでもよい
  * 属性にリッチデータ渡しちゃだめ。
* コードが複雑化しそうな気配があり、CAの構造を持ってTDDした。
* shadow dom向けには、やっぱopen-wcのtestするのが便利だ
* リリースするときは、open-wcのpublishの記事、良い。
  * bundleしない、minifyしない、
* 提供するとき、HTMLElementの拡張オブジェクトが良い。cusotomelement.defineだと勝手に定義されて困るだろう
* パフォーマンスとかチューニングしてみたい
  * カスケード更新の超多段レンダリングとか、propデータの巨大化とか
* 関係ないけど、wildcardのjsコード、ほしい
* APIのバリデータもほしい
* iframe、レスポンシブじゃないので、mdnのレスポンシブの記事読んで解決した。max-width
