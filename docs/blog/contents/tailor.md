---
title: Zalando tailor で Micro Frontends with ( LitElement  & etcetera)
published: true
date: 2020-10-04
description: Zalando社が開発したTailorを使って、サンプルWebアプリをMicro Frontendsで構築してみました。Tailorはサーバーサイドで統合するアーキテクチャです。クライアントサイドは、Web Componentsで作られているLit Elementを使って統合しました。どういった内容か、ここに投稿しようと思います。
tags: ["Zalando Tailor", "Micro Frontends", "Lit Element"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614429982/silver-birder.github.io/blog/Photo_by_Kenny_Luo_on_Unsplash.jpg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614429982/silver-birder.github.io/blog/Photo_by_Kenny_Luo_on_Unsplash.jpg
---

<!-- <span>Photo by <a href="https://unsplash.com/@kennyluoping?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Kenny Luo</a> on <a href="https://unsplash.com/s/photos/tailor?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span> -->

Zalando社が開発したTailorを使って、サンプルWebアプリをMicro Frontendsで構築してみました。Tailorはサーバーサイドで統合するアーキテクチャです。クライアントサイドは、Web Componentsで作られているLit Elementを使って統合しました。どういった内容か、ここに投稿しようと思います。

作ったリポジトリは、下記に残しています。
[https://github.com/Silver-birder/micro-frontends-sample-code-4](https://github.com/Silver-birder/micro-frontends-sample-code-4)  <!--  TODO: embed  -->

<!--  TODO: TOC -->

# 全体構成

<figure title="アプリケーション構成">
<img alt="アプリケーション構成" src="https://res.cloudinary.com/silverbirder/image/upload/v1614430036/silver-birder.github.io/blog/tailor_and_application_configuration.png">
<figcaption>アプリケーション構成</figcaption>
</figure>

ざっくり説明すると、HTMLからTailorに対してフラグメント(コンポーネント)を取得・返却するようにします。各フラグメントは、LitElementでWebComponentsを定義させたJavascriptを指します。フラグメントを読み込むだけで、カスタムエレメントを使えるようになります。

# Tailor
![image](https://camo.githubusercontent.com/3018354754cc0c9f1f6b27ac68bd8060a11db5a7/68747470733a2f2f7261776769746875622e636f6d2f7a616c616e646f2f7461696c6f722f6d61737465722f6c6f676f2f7461696c6f722d6c6f676f2e737667)

[https://github.com/zalando/tailor](https://github.com/zalando/tailor)  <!--  TODO: embed  -->

> A streaming layout service for front-end microservices

tailorは、ストリーミングレイアウトサービスというだけあって、fragmentのloadをストリーミングするそうです。(こちらのライブラリは、Facebookの[BigPipe](https://www.facebook.com/notes/facebook-engineering/bigpipe-pipelining-web-pages-for-high-performance/389414033919/) に影響されたそう)

まず、tailor.jsのHTMLテンプレートは次のとおりです。

templates/index.html
```html
<body>
  <div id="outlet"></div>
  <fragment src="http://localhost:7000" defer></fragment>
  <fragment src="http://localhost:8000" defer></fragment>
  <fragment src="http://localhost:9000" defer></fragment>
</body>
```

これらのfragmentの取得は、tailor.jsを経由します。

tailor.js
```javascript
const http = require('http')
const Tailor = require('node-tailor')
const tailor = new Tailor({
    templatesPath: __dirname + '/templates'
})

http
    .createServer((req, res) => {
        req.headers['x-request-uri'] = req.url
        req.url = '/index'
        tailor.requestHandler(req, res)
    })
    .listen(8080)
```

x-request-uriは、後ろのフラグメントにURLを引き継ぐためのようです。
そして、フラグメントサーバーは、次のとおりです。

fragments.js
```javascript
const http = require('http')
const url = require('url')
const fs = require('fs')

const server = http.createServer((req, res) => {
  const pathname = url.parse(req.url).pathname
  const jsHeader = { 'Content-Type': 'application/javascript' }
  switch(pathname) {
    case '/public/bundle.js':
      res.writeHead(200, jsHeader)
      return fs.createReadStream('./public/bundle.js').pipe(res)
    default:
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Link': '<http://localhost:8000/public/bundle.js>; rel="fragment-script"'
      })
      return res.end('')
  }
})

server.listen(8000)
```

fragments.jsは、Response HeaderにLinkヘッダを追加するようにします。Tailorは、このヘッダのJavascriptを読み込むことになります。
さらに、fragments.jsは、Linkヘッダで指定されたリクエストを `return fs.createReadStream('./public/bundle.js').pipe(res)`  でストリームのパイプを返すそうです。

# Lerna

![lerna](https://res.cloudinary.com/silverbirder/image/upload/v1614430061/silver-birder.github.io/blog/Lerna.png)

それぞれのフラグメントをLernaで管理するようにします。
私は、下記のようなpackages分けをしました。

* common
  * 共通する変数・ライブラリ
* fragment
  * LitElementのカスタムエレメント定義
* function
  * フラグメントと連携する関数 (ヒストリーやイベントなど)

具体的に言うと、次のようなものを用意しました。

|directoy name| package name|
|--|--|
|packages/common-module|@type/common-module|
|packages/common-variable|@type/common-variable|
|packages/fragment-auth-components|@auth/fragment-auth-components|
|packages/fragment-product-item|@product/fragment-product-item|
|packages/fragment-search-box|@search/fragment-search-box|
|packages/function-event-hub|@controller/function-event-hub|
|packages/function-history-navigation|@controller/function-history-navigation|
|packages/function-renderer-proxy|@controller/function-renderer-proxy|
|packages/function-search-api|@search/function-search-api|
|packages/function-service-worker|@type/function-service-worker|

どの名前も、その時の気分で雑に設定したので、気にしないでください。（笑）
伝えたいのは、@XXX が1チームで管理する領域みたいなことをしたかっただけです。

packageを使いたい場合は、次のような依存を設定します。

package.json
```json
{
  "dependencies": {
    "@controller/function-event-hub": "^0.0.0",
    "@type/common-variable": "^0.0.0",
  }
}
```

# LitElement

![LitElement](https://res.cloudinary.com/silverbirder/image/upload/v1614430086/silver-birder.github.io/blog/LitElement.jpg)

[https://lit-element.polymer-project.org/](https://lit-element.polymer-project.org/)  <!--  TODO: embed  -->
> LitElement
A simple base class for creating fast, lightweight web components

純粋なWebComponentsだけを使えばよかったのですが、次のような理由で LitElementを使いました。

* Typescriptが書ける
* レンダリングパフォーマンスの良いlit-html が使える
* プロパティ変化によるレンダリング更新ができる

まあ、特にこだわりはないです。
書き方は、次のとおりです。

```typescript
import {LitElement, html, customElement, css, property} from 'lit-element';

@customElement('product-item')
export class ProductItem extends LitElement {
    static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;
    @property({type: String})
    name = ``;

    render() {
        return html`<div>${this.name}</div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'product-item': ProductItem;
    }
}
```

LitElement + Typescript では、open-testing を使ってテストすることができます。
[https://github.com/PolymerLabs/lit-element-starter-ts/blob/master/src/test/my-element_test.ts](https://github.com/PolymerLabs/lit-element-starter-ts/blob/master/src/test/my-element_test.ts)  <!--  TODO: embed  -->

また、jestでもテストができるようです。

[https://www.ninkovic.dev/blog/2020/testing-web-components-with-jest-and-lit-element](https://www.ninkovic.dev/blog/2020/testing-web-components-with-jest-and-lit-element)  <!--  TODO: embed  -->

# DynamicRendering

![rendertron](https://res.cloudinary.com/silverbirder/image/upload/v1614430107/silver-birder.github.io/blog/rendertron.png)

このサンプルでは、カスタムエレメントを使って、ブラウザ側でレンダリングする 所謂SPAの動きで構築しています。
『SEOガー！』とSSRしなきゃと思う訳ですが、正直SSRを考えたくないです。(ハイドレーションなんて無駄なロードをブラウザにさせたくない）
次の記事のように、ボットのアクセスのみに、ダイナミックレンダリングした結果（SPAのレンダリング結果HTML）を返すようにしたいです。

[https://developers.google.com/search/docs/guides/dynamic-rendering?hl=ja](https://developers.google.com/search/docs/guides/dynamic-rendering?hl=ja)  <!--  TODO: embed  -->

技術的には、次のようなものを使えば良いです。

[https://github.com/GoogleChrome/rendertron](https://github.com/GoogleChrome/rendertron)  <!--  TODO: embed  -->

function-renderer-proxy/src/renderer.ts
```typescript
...
const page = await this.browser.newPage(); // browser: Puppeteer.Browser
...
const result = await page.content() as string;  // Puppeteerのレンダリング結果コンテンツ(HTML)
```

要は、Puppeteerで実際にレンダリングさせた結果をBotに返却しているだけです。

# EventHub

フラグメント同士は、CustomEventを通して連携します。

[https://developer.mozilla.org/ja/docs/Web/Guide/Events/Creating_and_triggering_events](https://developer.mozilla.org/ja/docs/Web/Guide/Events/Creating_and_triggering_events)  <!--  TODO: embed  -->

全て、このCustomEventとAddEventListenerを管理するEventHub(packages名)を経由するようにします。(理想)

# History

ページ全体のヒストリーは、HistoryNavigation(packages名)で管理したいと考えています。(理想)

[https://developer.mozilla.org/en-US/docs/Web/API/History_API](https://developer.mozilla.org/en-US/docs/Web/API/History_API)  <!--  TODO: embed  -->

また、ルーティングを制御する Web Components向けライブラリ vaadin/router も便利そうだったので導入してみました。

[https://vaadin.com/router](https://vaadin.com/router)  <!--  TODO: embed  -->

# ShareModule

LitElementのようなどこでも使っているライブラリは、共通化してバンドルサイズを縮めたいです。
Webpackのようなバンドルツールには、ExternalやDLLPlugin、ModuleFederationなどの共通化機能があります。

[https://webpack.js.org/concepts/module-federation/](https://webpack.js.org/concepts/module-federation/)  <!--  TODO: embed  -->

今回は、externalを使っています。

common-module/common.js
```javascript
exports['rxjs'] = require('rxjs')
exports['lit-element'] = require('lit-element')
exports['graphql-tag'] = require('graphql-tag')
exports['graphql'] = require('graphql')
exports['apollo-client'] = require('apollo-client')
exports['apollo-cache-inmemory'] = require('apollo-cache-inmemory')
exports['apollo-link-http'] = require('apollo-link-http')
```

common-module/webpack.config.js
```javascript
module.exports = {
    entry: './common.js',
    output: {
        path: __dirname + '/public',
        publicPath: 'http://localhost:6006/public/',
        filename: 'bundle.js',
        libraryTarget: 'amd'
    }
}
```

共通化したライブラリは、次のTailorのindex.htmlで読み込みます。

templates/index.html
```html
    <script>
        (function (d) {
            require(d);
            var arr = [
                'lit-element',
                'rxjs',
                'graphql-tag',
                'apollo-client',
                'apollo-cache-inmemory',
                'apollo-link-http',
                'graphql'
            ];
            while (i = arr.pop()) (function (dep) {
                define(dep, d, function (b) {
                    return b[dep];
                })
            })(i);
        }(['http://localhost:6006/public/bundle.js']));
    </script>
```

そうすると、例えばsearchBoxのwebpackでは、次のようなことが使えます。

fragment-search-box/webpack.config.js
```javascript
externals: {
    'lit-element': 'lit-element',
    'graphql-tag': 'graphql-tag',
    'apollo-client': 'apollo-client',
    'apollo-cache-inmemory': 'apollo-cache-inmemory',
    'apollo-link-http': 'apollo-link-http',
    'graphql': 'graphql'
}
```

# その他

その時の気分で導入したものを紹介します。(or 導入しようと考えたもの)

## GraphQL

APIは、雑にGraphQLを採用しました。特に理由はありません。

## SkeltonUI

Skelton UIも使ってみたいなと思っていました。

[https://material-ui.com/components/skeleton/](https://material-ui.com/components/skeleton/)  <!--  TODO: embed  -->

Reactを使わなくても、CSSの@keyframesを使えば良いでしょう。が、まあ使っていません。(笑)

[https://developer.mozilla.org/ja/docs/Web/CSS/@keyframes](https://developer.mozilla.org/ja/docs/Web/CSS/@keyframes)  <!--  TODO: embed  -->

## Rxjs

typescriptの処理をリアクティブな雰囲気でコーディングしたかったので導入してみました。

(リアクティブに詳しい人には、怒られそうな理由ですね...笑)

[https://rxjs.dev/](https://rxjs.dev/)  <!--  TODO: embed  -->

# 所感
これまで、Podium、Ara-Framework, そして Tailor といったMicro Frontendsに関わるサーバーサイド統合ライブラリを使ってみました。

[./microfrontends](./microfrontends.md)  <!--  TODO: embed  -->

[./ara-framework](./ara-framework.md)  <!--  TODO: embed  -->

これらは、どれも考え方が良いなと思っています。
Podiumのフラグメントのインターフェース設計、Ara-FrameworkのRenderとデータ取得の明確な分離、そしてTailorのストリーム統合です。
しかし、これらは良いライブラリではありますが、プロダクションとしてはあんまり採用したくない(依存したくない)と思っています。

むしろ、もっと昔から使われていた Edge Side Includeや Server Side Include などを使ったサーバーサイド統合の方が魅力的です。
例えば、Edge Worker とか良さそうです。(HTTP2やHTTP3も気になります)

まあ、まだ納得いくMicro Frontendsの設計が発見できていないので、これからも検証し続けようと思います。
