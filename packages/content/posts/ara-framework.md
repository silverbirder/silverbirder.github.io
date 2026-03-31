---
title: 'Ara-Framework で Micro Frontends with SSR'
publishedAt: '2020-08-23'
summary: 'みなさん、こんにちは。silverbirder です。、Micro Frontends があります。今、Ara-Frameworkというフレームワークを使った Micro Frontends のアプローチ方法を学んでいます。'
tags: ["バックエンド", "フロントエンド", "成果物"]
keywords: ['Ara-Framework', 'Micro Frontends']
---

みなさん、こんにちは。silverbirder です。
私の最近の興味として、Micro Frontends があります。

https://silverbirder.github.io/blog/contents/microfrontends

今、Ara-Framework というフレームワークを使った Micro Frontends のアプローチ方法を学んでいます。

## Ara-Framework とは

> Build Micro-frontends easily using Airbnb Hypernova

※ [https://ara-framework.github.io/website/](https://ara-framework.github.io/website/)

Ara-Framework は、Airbnb が開発した Hypernova というフレームワークを使って、Micro Frontends を構築します。

## Airbnb Hypernova とは

> A service for server-side rendering your JavaScript views

※ [https://github.com/airbnb/hypernova](https://github.com/airbnb/hypernova)

簡単に説明すると、Hypernova はデータを渡せばレンダリング結果(HTML)を返却してくれるライブラリです。
これにより、データ構築とレンダリングを明確に分離することができるメリットがあります。

## Ara-Framework アーキテクチャ

Ara-Framework のアーキテクチャ図は、次のようなものです。

![ara framework overview](https://res.cloudinary.com/silverbirder/image/upload/v1693362600/silver-birder.github.io/blog/1%2A43CBDwIZ8P2q_ZfGg_ktUQ.png?ar=1181%3A835)

※ [https://ara-framework.github.io/website/docs/nova-architecture](https://ara-framework.github.io/website/docs/nova-architecture)

構成要素は、次のとおりです。(↑ の公式ページにも説明があります)

- Nova Proxy
  - ブラウザのアクセスを Layout へプロキシします。
  - Layout から返却された HTML をパースし、Hypernova のプレースホルダーがあれば、Nova Cluster へ問い合わせします。
  - Nova Cluster から返却された HTML を、Hypernova のプレースホルダーに埋め込み、ブラウザへ HTML を返却します。
- Nova Directive (Layout)
  - 全体の HTML を構築します。Hypernova のプレースホルダーを埋め込みます。
  - Node.js, Laravel, Jinja2 が対応しています。
- Nova Cluster
  - Nova Binding を管理するクラスタです。
  - Nova Proxy と Nova Bindings の間に位置します。
- Nova Bindings (Hypernova)
  - データを渡されて、HTML をレンダリングした結果を返します。 (Hypernova をここで使います)
  - React, Vue.js, Angular, Svelte, Preact が対応しています。

このように、Layout と Rendering (Nova Bindings) を明確に分けることで、独立性、スケーラビリティ性が良いのかなと感じます。
各レイアの間にキャッシュレイヤを設けることでパフォーマンス向上も期待できます。

詳しくは、公式ページをご確認下さい。

## Ara-Framework サンプルコード

Ara-Framework を実際に使ってみました。サンプルコードは下記にあげています。
https://github.com/silverbirder/micro-frontends-sample-code-2

package.json はこんな感じです。

package.json

```json
  "scripts": {
    "cluster": "cd cluster && PORT=5000 ara run:cluster --config ./views.json",
    "layout": "cd layout && PORT=8080 node ./bin/www",
    "proxy": "cd proxy && HYPERNOVA_BATCH=http://localhost:5000/batch PORT=8000 ara run:proxy --config ./nova-proxy.json",
    "search:dev": "cd search && PORT=3000 ./node_modules/webpack/bin/webpack.js --watch --mode development",
    "product:dev": "cd product && PORT=3001 ./node_modules/webpack/bin/webpack.js --watch --mode development",
    "dev": "concurrently -n cluster,layout,proxy,search,product \"npm run cluster\" \"npm run layout\" \"npm run proxy\" \"npm run search:dev\" \"npm run product:dev\"",
  }
```

作っていく手順は、次の流れです。

1. Nova Proxy を作成
1. Nova Directive (Layout) を作成
1. Nova Cluster を作成
1. Nova Bindings (Hypernova) を作成

Ara-Framework を使うためには、次の準備をしておく必要があります。

```text
npm i -g ara-cli
```

## Nova Proxy

Nova Proxy は、Nova Directive へ Proxy しますので、その host を書きます。

nova-proxy.json

```json
{
  "locations": [
    {
      "path": "/",
      "host": "http://localhost:8080",
      "modifyResponse": true
    }
  ]
}
```

また、Nova Proxy は、Nova Cluster へ問い合わせするため、`HYPERNOVA_BATCH` という変数に URL を指定する必要があります。
Nova Proxy を動かすときは、次のコマンドを実行します。

```text
HYPERNOVA_BATCH=http://localhost:5000/batch PORT=8000 ara run:proxy --config ./nova-proxy.json
```

## Nova Directive (Layout)

Nova Directvie は、`hypernova-handlebars-directive` を使います。
これは、Node.js の handlebars テンプレートエンジン(hbs)で使えます。

Express の雛形を生成します。

```text
npx express-generator -v hbs layout
```

詳細は割愛しますが、次の HTML ファイル(hbs)を作成します。

※ 詳しくはこちら [https://ara-framework.github.io/website/docs/render-on-page](https://ara-framework.github.io/website/docs/render-on-page)

layout/index.hbs

```text
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>

{{>nova name="Search" data-title=title }}

<script src="http://localhost:3000/public/client.js"></script>
<script src="http://localhost:3001/public/client.js"></script>
```

`{{>nova}}` が Hypernova のプレースホルダーである `hypernova-handlebars-directive` です。
name は、Nova Bindings の名前 (後ほど説明します)、data-\*は、Nova Bindings に渡すデータです。
また、script で client.js を load しているのは、CSR を実現するためです。

動かすのは、Express を動かすときと同じで、次になります。

```text
PORT=8080 node ./bin/www
```

## Nova Cluster

Nova Cluster は、Nova Bindings を管理します。

views.json

```json
{
  "Search": {
    "server": "http://localhost:3000/batch"
  },
  "Product": {
    "server": "http://localhost:3001/batch"
  }
}
```

Search や Product は、後ほど作成する Nova Bindings の名前です。server は、Nova Bindings が動いている URL です。

Nova Cluster を動かすときは、次のコマンドを実行します。

```text
PORT=5000 ara run:cluster --config ./views.json
```

## Nova Bindings

Nova Bindings を作るために、次のコマンドを実行します。

```text
ara new:nova search -t react
ara new:nova product -t vue
```

そこから、自動生成されたディレクトリから、少し修正したものが次のとおりです。

search/Search.jsx

```text
import React, { Component } from 'react'
import { Nova } from 'nova-react-bridge'

class Search extends Component {
  render() {
      <div>
        <div>Search Components!</div>
        <table>
          <tr>
            {['🐙', '🐳', '🐊', '🐍', '🐷', '🐶', '🐯'].map((emoji, key) => {
              return <td key={key}>
                <Nova
                  name="Product"
                  data={{title: emoji}}/>
              </td>
            })}
          </tr>
        </table>
      </div>
  }
}
```

今までの説明ではなかったですが、Nova Bridge である `nova-react-bridge` を使っています。
これは、Nova Directive に似ているのですが、使えるファイルが React や Vue.js などの JS フレームワークに対応しています。
そのため、Nuxt.js や Next.js,Gatsby.js にも使えるようになります。

※ わかりにくいですが、このサンプルの Nova Bridge は、CSR で動作します。SSR で動作させるためには、Nova Proxy を挟む必要が (たぶん) あります。

product/Product.vue

```text
<template>
  <div>{{title}}</div>
</template>

<script>
export default {
  props: ['title']
}
</script>
```

Nova Bindings のこれらを動作させるためには、次のコマンドを実行します。

```text
## search
PORT=3000 ./node_modules/webpack/bin/webpack.js --watch --mode development
## product
PORT=3001 ./node_modules/webpack/bin/webpack.js --watch --mode development
```

## 動作確認

今まで紹介したものを同時に実行する必要があります。
そこで、`concurrently` を使います。

```text
concurrently -n cluster,layout,proxy,search,product "npm run cluster" "npm run layout" "npm run proxy" "npm run search:dev" "npm run product:dev"
```

動作として、次のような画像になります。

![nova results](https://res.cloudinary.com/silverbirder/image/upload/v1614430832/silver-birder.github.io/blog/nova_results.png?ar=970%3A850)

## 最後に

繰り返しますが、Ara-Framework を使うとデータ構築(Nova Directive)とレンダリング(Nova Bindings)を明確に分離できます。
また、レンダリング部分は、それぞれ独立できます。今回紹介していない API 部分は、誰がどのように管理するのか考える必要があります。

ただ、Nova Bindings で使用する CSR 用 javascript は、重複するコードが含まれてしまい、ブラウザロード時間が長くなってしまいます。
そこで、webpack 5 から使えるようになった Federation 機能を使って解決するとった手段があります。

Ara-Framework の紹介でした！
