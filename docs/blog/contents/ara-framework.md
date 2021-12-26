---
title: Ara-Framework で Micro Frontends with SSR
published: true
date: 2020-08-23
description: みなさん、こんにちは。silverbirder です。、Micro Frontends があります。今、Ara-Frameworkというフレームワークを使った Micro Frontends のアプローチ方法を学んでいます。
tags: ["Ara Framework", "Micro Frontends", "SSR"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614430802/silver-birder.github.io/blog/Photo_by_Artem_Sapegin_on_Unsplash.jpg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614430802/silver-birder.github.io/blog/Photo_by_Artem_Sapegin_on_Unsplash.jpg
---

<!-- TODO: <span>Photo by <a href="https://unsplash.com/@sapegin?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Artem Sapegin</a> on <a href="https://unsplash.com/s/photos/html?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span> -->

みなさん、こんにちは。silverbirder です。
私の最近の興味として、Micro Frontends があります。

<iframely-embed url="https://silver-birder.github.io/blog/contents/microfrontends"></iframely-embed>

今、Ara-Frameworkというフレームワークを使った Micro Frontends のアプローチ方法を学んでいます。

# Ara-Framework とは

> Build Micro-frontends easily using Airbnb Hypernova

※ [https://ara-framework.github.io/website/](https://ara-framework.github.io/website/)

Ara-Frameworkは、Airbnbが開発したHypernovaというフレームワークを使って、Micro Frontendsを構築します。

# Airbnb Hypernova とは
> A service for server-side rendering your JavaScript views

※ [https://github.com/airbnb/hypernova](https://github.com/airbnb/hypernova)

簡単に説明すると、Hypernovaはデータを渡せばレンダリング結果(HTML)を返却してくれるライブラリです。
これにより、データ構築とレンダリングを明確に分離することができるメリットがあります。

# Ara-Framework アーキテクチャ
Ara-Frameworkのアーキテクチャ図は、次のようなものです。

![ara framework overview](https://cdn-images-1.medium.com/max/2400/1*43CBDwIZ8P2q_ZfGg_ktUQ.png)

※ [https://ara-framework.github.io/website/docs/nova-architecture](https://ara-framework.github.io/website/docs/nova-architecture)

構成要素は、次のとおりです。(↑の公式ページにも説明があります)

*  Nova Proxy
    * ブラウザのアクセスをLayoutへプロキシします。
    * Layoutから返却されたHTMLをパースし、Hypernovaのプレースホルダーがあれば、Nova Clusterへ問い合わせします。
    * Nova Clusterから返却されたHTMLを、Hypernovaのプレースホルダーに埋め込み、ブラウザへHTMLを返却します。
* Nova Directive (Layout)
    * 全体のHTMLを構築します。Hypernovaのプレースホルダーを埋め込みます。
    * Node.js, Laravel, Jinja2 が対応しています。
* Nova Cluster
    * Nova Bindingを管理するクラスタです。
    * Nova ProxyとNova Bindings の間に位置します。
* Nova Bindings (Hypernova)
    * データを渡されて、HTMLをレンダリングした結果を返します。 (Hypernovaをここで使います)
    * React, Vue.js, Angular, Svelte, Preact が対応しています。

このように、LayoutとRendering (Nova Bindings) を明確に分けることで、独立性、スケーラビリティ性が良いのかなと感じます。
各レイアの間にキャッシュレイヤを設けることでパフォーマンス向上も期待できます。

詳しくは、公式ページをご確認下さい。

# Ara-Framework サンプルコード

Ara-Frameworkを実際に使ってみました。サンプルコードは下記にあげています。
<iframely-embed url="https://github.com/Silver-birder/micro-frontends-sample-code-2"></iframely-embed>

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

```
$ npm i -g ara-cli
```

## Nova Proxy
Nova Proxyは、Nova DirectiveへProxyしますので、そのhostを書きます。 

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

また、Nova Proxyは、Nova Clusterへ問い合わせするため、`HYPERNOVA_BATCH` という変数にURLを指定する必要があります。
Nova Proxyを動かすときは、次のコマンドを実行します。

```
$ HYPERNOVA_BATCH=http://localhost:5000/batch PORT=8000 ara run:proxy --config ./nova-proxy.json
```


## Nova Directive (Layout)
Nova Directvieは、`hypernova-handlebars-directive` を使います。
これは、Node.jsのhandlebarsテンプレートエンジン(hbs)で使えます。

Expressの雛形を生成します。

```
$ npx express-generator -v hbs layout
```

詳細は割愛しますが、次のHTMLファイル(hbs)を作成します。  

※ 詳しくはこちら [https://ara-framework.github.io/website/docs/render-on-page](https://ara-framework.github.io/website/docs/render-on-page)

layout/index.hbs
```
<h1>{{title}}</h1>
<p>Welcome to {{title}}</p>

{{>nova name="Search" data-title=title }}

<script src="http://localhost:3000/public/client.js"></script>
<script src="http://localhost:3001/public/client.js"></script>
```

`{{>nova}}` がHypernovaのプレースホルダーである `hypernova-handlebars-directive` です。
nameは、Nova Bindingsの名前 (後ほど説明します)、data-*は、Nova Bindingsに渡すデータです。
また、scriptでclient.jsをloadしているのは、CSRを実現するためです。

動かすのは、Expressを動かすときと同じで、次になります。

```
$ PORT=8080 node ./bin/www
```

## Nova Cluster
Nova Clusterは、Nova Bindingsを管理します。

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

SearchやProductは、後ほど作成するNova Bindingsの名前です。serverは、Nova Bindingsが動いているURLです。

Nova Clusterを動かすときは、次のコマンドを実行します。

```
$ PORT=5000 ara run:cluster --config ./views.json
```

## Nova Bindings

Nova Bindings を作るために、次のコマンドを実行します。

```
$ ara new:nova search -t react
$ ara new:nova product -t vue
```

そこから、自動生成されたディレクトリから、少し修正したものが次のとおりです。

search/Search.jsx
```
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
これは、Nova Directiveに似ているのですが、使えるファイルが ReactやVue.jsなどのJSフレームワークに対応しています。
そのため、Nuxt.jsやNext.js,Gatsby.js にも使えるようになります。

※ わかりにくいですが、このサンプルのNova Bridgeは、CSRで動作します。SSRで動作させるためには、Nova Proxyを挟む必要が (たぶん) あります。

product/Product.vue
```
<template>
  <div>{{title}}</div>
</template>

<script>
export default {
  props: ['title']
}
</script>
```

Nova Bindingsのこれらを動作させるためには、次のコマンドを実行します。

```
# search
$ PORT=3000 ./node_modules/webpack/bin/webpack.js --watch --mode development
# product
$ PORT=3001 ./node_modules/webpack/bin/webpack.js --watch --mode development
```

## 動作確認

今まで紹介したものを同時に実行する必要があります。
そこで、`concurrently` を使います。

```
$ concurrently -n cluster,layout,proxy,search,product "npm run cluster" "npm run layout" "npm run proxy" "npm run search:dev" "npm run product:dev"
```

動作として、次のような画像になります。

![nova results](https://res.cloudinary.com/silverbirder/image/upload/v1614430832/silver-birder.github.io/blog/nova_results.png)

# 最後に
繰り返しますが、Ara-Framework を使うとデータ構築(Nova Directive)とレンダリング(Nova Bindings)を明確に分離できます。
また、レンダリング部分は、それぞれ独立できます。今回紹介していないAPI部分は、誰がどのように管理するのか考える必要があります。

ただ、Nova Bindingsで使用するCSR用javascriptは、重複するコードが含まれてしまい、ブラウザロード時間が長くなってしまいます。
そこで、webpack 5から使えるようになったFederation機能を使って解決するとった手段があります。

Ara-Frameworkの紹介でした！
