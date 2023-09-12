---
title: クローリングをシュッとやるのに、Crawleeが便利だった
published: true
date: 2022-09-14
description: スクレイピングしたいときって、あると思います。Crawlee という OSS が便利だったので、共有します。
tags: ["Crawlee"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1663163849/silver-birder.github.io/blog/hans-peter-gauster-3y1zF4hIPCg-unsplash.jpg
---

スクレイピングしたいときって、あると思います。
Crawlee という OSS が便利だったので、共有します。

## 背景

スクレイピングしようと思うと、得意な言語でクローリングプログラムを書いて、html をスクレイピングすると思います。
私は、Node.js が得意なので、fetch + jsdom で書くことが多いです。ブラウザレンダリングが必要な場合、ヘッドレスブラウザを使うこともあります。
毎回これを組み立てるのが、ちょっと面倒だなと思います。そういうときに、Crawle という OSS が便利でした。

## Crawle

https://crawlee.dev/ より引用します。

> Crawlee is a web scraping and browser automation library.
> It helps you build reliable crawlers. Fast.
> Crawlee won't fix broken selectors for you (yet), but it helps you build and maintain your crawlers faster.

Crawlee は壊れたセレクタを直せませんが、クローラーを素早く作ることができます。

## Crawle の良いところ

Crawle の良いなとおもった特徴を挙げます。

### crawlee のテンプレートがある

crawlee は、`npx crawlee create` でコード生成できます。

```bash
$ npx crawlee create my-crawler
? Please select the template for your new Crawlee project (Use arrow keys)
❯ Getting started example [TypeScript]
  Getting started example [JavaScript]
  CheerioCrawler template project [TypeScript]
  PlaywrightCrawler template project [TypeScript]
  PuppeteerCrawler template project [TypeScript]
  CheerioCrawler template project [JavaScript]
  PlaywrightCrawler template project [JavaScript]
```

TypeScript のサポートがあります。
また、Crawler はデフォルトで plain HTTP crawler である Cherrio を採用しています。
必要に応じて、Playwright や Puppeteer を使うことができますし、Crawler の切り替えもインターフェースが揃っているため、簡単にできます。

- https://crawlee.dev/docs/quick-start#choose-your-crawler

### RequestQueue という仕組み

クローラで、復数の URL にアクセスすることは、よくあると思います。
リクエストは、RequestQueue というキューで管理され、自動的にクローラがアクセスしていきます。
キューはユニークな URL で管理されるため、重複したアクセスはありません。

- https://crawlee.dev/api/core/class/RequestQueue

この仕組みは、次のような簡単なコードで実現できます。

```javascript
import { RequestQueue } from "crawlee";
const requestQueue = await RequestQueue.open();
await requestQueue.addRequest({ url: "https://crawlee.dev" });
```

さらに、enqueueLinks という機能があります。これは、アクセスしているページの anchor の URL を RequestQueue に追加します。
次のコードが、enqueueLinks の例です。

```javascript
import { CheerioCrawler } from "crawlee";
const crawler = new CheerioCrawler({
  async requestHandler({ enqueueLinks }) {
    await enqueueLinks();
  },
});
await crawler.run(["https://crawlee.dev"]);
```

enqueueLinks には、様々なオプションがあります。

- https://crawlee.dev/api/core/function/enqueueLinks

例えば、リンクを globs でフィルタリングしたり、anchor のセレクタを指定できたりします。

### データは JSON で保存される

スクレイピングで手に入れたデータは、json で保存できます。

- https://crawlee.dev/docs/introduction/saving-data

例えば、リクエストした URL を集めたいときは、次のようなコードです。

```javascript
import { CheerioCrawler, Dataset } from "crawlee";

const crawler = new CheerioCrawler({
  async requestHandler({ request }) {
    await Dataset.pushData({ url: request.url });
  },
});
await crawler.run(["https://crawlee.dev"]);
```

保存先は、`{PROJECT_FOLDER}/storage/datasets/default/` になります。
めちゃくちゃく簡単にデータが保存できます。

## 終わりに

Crawlee の SaaS として、Apify があります。これで気軽に試してみるのもありかもしれません。

- https://apify.com/
