---
title: クローリングでシュッとやるのに、Crawleeが便利だった
published: true
date: 2022-09-13
description: XXXX
tags: ["Crawlee"]
---

スクレイピングしたいときって、あると思います。
Crawlee という OSS が便利だったので、共有します。

## 背景

スクレイピングしようと思うと、得意な言語でクローリングプログラムを書いて、html をスクレイピングすると思います。
私は、node.js が得意なので、fetch + cherrio or jsdom で書くことが多いです。
ブラウザのレンダリングも必要になると、ヘッドレスブラウザを使うことになります。

で、毎回これを組み立てるのが、ちょっと面倒だなと思うときがあります。
そういうときに、Crawle という OSS が便利でした。

## Crawle

https://crawlee.dev/

> Crawlee is a web scraping and browser automation library.
> It helps you build reliable crawlers. Fast.

そう、クローラーを素早く作ることができます。

## Crawle の良いところ

- template で テンプレートがある

```
npx crawlee create my-crawler
```

typescript もサポートしています。

- JSDOMCrawler があり、puppeteer や playwright は別で入れる

ヘッドレスブラウザは、オプトインのため、デフォルトでは含まれません。

- RequestQueue という仕組みが、良い

anchor をなめて、キューをためて、URL の重複も消して、クローリング。
ありがたい。glob もある。

## 終わりに
