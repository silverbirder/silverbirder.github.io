---
title: Micro Frontendsで組成するフラグメントをWeb Componentsとするアイデア
published: true
date: 2022-05-23
description: xxxx
tags: ["Web Components"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1649683816/silver-birder.github.io/blog/kelly-sikkema-JRVxgAkzIsM-unsplash.jpg
---

## 書くこと

Micro Frontends で組成するフラグメントを Web Components とするアイデアです。
Web Components は、Shadow DOM というサンドボックス環境でコンポーネント開発できます。
そのため、フラグメントとして完全に独立することができます。
また、Web Components は標準技術であるため、React や Vue などどのライブラリでも適用することができるはずです。

フラグメントを組成する側は、内部のライブラリを意識せず、Web Components というカスタム HTML タグを組み立てるだけです。これも同様で、組成する側のライブラリも、どのライブラリでも使えるはずです。

フラグメントは、独立しなければならないです。依存してはマイクロフロントエンドの意味がありません。
フラグメント間のやりとりは、イベント・ドリブンで設計します。
具体的には、Custom Events です。

フラグメント内部で使っているライブラリを、別フラグメントでも使っていると、重複したライブラリロードとなってしまいます。そこで、Webpack の Module Federation で共有しましょう。
importmap でもできなくはないです。

## 実際にやってみた

図は、こちら。

リポジトリは、こちら。

https://github.com/Silver-birder/playground/tree/main/node/web-components-is-api-for-micro-frontends

## 最後に

クライアント組成やサーバーサイド組成、ビルドタイム組成、どのタイミングでもこのアイデアは使えると思います。
