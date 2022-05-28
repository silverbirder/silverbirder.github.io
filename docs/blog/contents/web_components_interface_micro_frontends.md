---
title: Micro Frontendsで組成するフラグメントをWeb Componentsで定義してModule Federationで共有する
published: true
date: 2022-05-23
description: xxxx
tags: ["Web Components"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1649683816/silver-birder.github.io/blog/kelly-sikkema-JRVxgAkzIsM-unsplash.jpg
---

Micro Frontends(以降、MFE)で組成するフラグメントを Web Components で定義して Module Federation で共有する方法を、ざっくり紹介します。
MFE については、以下のブログ記事をお読みください。

<ogp-me src="https://silver-birder.github.io/blog/contents/mfe/"></ogp-me>

サンプルコードについては、次のリポジトリにあります。

<ogp-me src="https://github.com/Silver-birder/playground/tree/main/node/web-components-is-api-for-micro-frontends"></ogp-me>

## 用語

- フラグメント
  - 各フロントエンドチームが提供する UI 部品(HTML,CSS,JS,etc)
- 組成
  - フラグメントを使って、ページ全体を構築する

MFE で有名な Michael Geers さんの記事より、MFE のサンプル例が、次の図です。

<figure title="[翻訳記事]マイクロフロントエンド > mfe-three-teams">
<img alt="[翻訳記事]マイクロフロントエンド > mfe-three-teams" src="https://micro-frontends-japanese.org/resources/three-teams.png">
<figcaption><a href="https://micro-frontends-japanese.org/">[翻訳記事]マイクロフロントエンド</a></figcaption>
</figure>

この例は、EC サイトのサンプルです。
チェックアウトチームは React を使っていて、フラグメントは次の 2 つです。

- 購入ボタン(`buy for 66.00`)
- バスケット(`busket: 0 items(s)`)

組成は、プロダクトチームが担っています。

## フラグメントを WebComponents で定義

MFE を実現するための設計は、大きく分けて 3 パターン考えられます。

- ビルドタイム組成パターン
  - フラグメントのコードを含めてビルドしてから、デプロイする
- サーバーサイド組成パターン
  - ESI や SSI のような手法で、サーバーサイドでフラグメントから HTML を組み立てる
    - 例
      - https://silver-birder.github.io/blog/contents/ara-framework/
      - https://silver-birder.github.io/blog/contents/cloudflare_workers_mfe/
- クライアントサイド組成パターン
  - ブラウザ上で、フラグメントから HTML を組み立てる
  - 例
    - https://silver-birder.github.io/blog/contents/client_microfrontends/

フラグメントは、各フロントエンドチームが自由に定義できます。React で書いたり、Vue で書いたりできます。
ただ、フラグメントを組成するチームからすると、フラグメントのインターフェースが揃っている方が使いやすいと思います。

そこで、フラグメントを WebComponents で定義し、その中身は React や Vue などで書くようにします。
次から、サンプルコードを紹介します。

## 検索ボタンのフラグメント

例えば、React の場合、次のようなコードを書きます。
コードは、ボタンとクリックハンドラを定義した簡単なものです。

```typescript
// ./packages/team-search/src/components/SearchButton/SearchButton.tsx
import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

export const CustomElementContext = createContext<HTMLElement>(
  document.createElement("div")
);

export class SearchButton extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    ReactDOM.createRoot(mountPoint as HTMLElement).render(
      <React.StrictMode>
        <CustomElementContext.Provider value={this}>
          <App />
        </CustomElementContext.Provider>
      </React.StrictMode>
    );
  }
}
```

```typescript
// ./packages/team-search/src/components/SearchButton/App.tsx
import { useContext } from "react";
import { CustomElementContext } from "./SearchButton";

const App = () => {
  const customElement = useContext(CustomElementContext);
  const onClick = () => {
    customElement.dispatchEvent(
      new CustomEvent("search", { detail: { num: Math.random() } })
    );
  };
  return <button onClick={onClick}>Search</button>;
};

export default App;
```

他のフラグメントと連携する場合、イベントを使います。
このフラグメントは、クリックボタンを押したら、`CustomEvent("search", { detail: <object> })` というイベントを発火しています。

## JSON を表示するフラグメント

次に、このイベントのデータ(`<object>`)を表示するフラグメントを書きます。
具体的には、JsonDiv というフラグメントを書きます。json の文字列を表示するだけのシンプルなものです。
WebComponents へデータを与える手段は、2 つあります。

- HTML の属性 (ex. `<div attribute="value">`)
  - プリミティブな値(数値、文字など)に使う
- イベントリスナー (`eventlistener`)
  - 非プリミティブな値(配列など)に使う

今回は、前者を選択しました。

```typescript
// ./packages/team-content/src/components/JsonDiv/JsonDiv.tsx
import ReactDOM from "react-dom/client";
import App from "./App";

export class JsonDiv extends HTMLElement {
  root: ReactDOM.Root | undefined;
  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback() {
    const value = this.getAttribute("value") || ("{}" as string);
    const props = { json: value };
    if (this.root) {
      this.root.render(<App {...props} />);
    }
  }

  connectedCallback() {
    const value = this.getAttribute("value") || ("{}" as string);
    const props = { json: value };
    const mountPoint = document.createElement("span");
    this.attachShadow({ mode: "open" }).appendChild(mountPoint);
    this.root = ReactDOM.createRoot(mountPoint as HTMLElement);
    this.root.render(<App {...props} />);
  }
}
```

この WebComponents は、`<json-div value="{}" />` のように使います。

```typescript
// ./packages/team-content/src/components/JsonDiv/App.tsx
type AppProps = {
  json: string;
};

const App = (props: AppProps) => {
  const { json } = props;
  return <div>{json}</div>;
};

export default App;
```

`App.tsx`は、与えられた value を`<div>`で表示しているだけです。

## 組成

これまで紹介したフラグメントを組成します。
組成するためには、フラグメントを提供する仕組みが必要です。
そこで、Webpack の Module Federation を使います。

※ 提供する仕組みとして、`importmap` が使えないかなと思ったんですが、分かりませんでした。

## Module Federation

Module Federation は、Webpack@5 から導入された機能です。

<ogp-me src="https://webpack.js.org/concepts/module-federation/"></ogp-me>

> Each build acts as a container and also consumes other builds as containers. This way each build is able to access any other exposed module by loading it from its container.
> Shared modules are modules that are both overridable and provided as overrides to nested container. They usually point to the same module in each build, e.g. the same library.

今回のケースで言うと、検索ボタンと JSON 表示の 2 つを、それぞれコンテナとしてビルドします。
それらのコンテナをロードすることができます。
具体的なコードを紹介します。

### コンテナ化

検索ボタン、JSON 表示をコンテナ化していきます。
同じコードなので、検索ボタンのコードを紹介します。

```typescript
// .packages/team-search/src/remoteEntry.ts
export { SearchButton } from "./SearchButton";
```

何をコンテナとして提供するか export します。
次に、webpack の plugins コードを定義します。

```js
// .packages/team-search/webpack.config.js
...
const config = {
  entry: "./src/index",
  plugins: [
    new ModuleFederationPlugin({
      name: "search",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/remoteEntry",
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
          eager: true,
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
          eager: true,
        },
      },
    }),
  ]
};
...
```

先程の export したファイルを exposes で設定します。
また、Module Federation では、モジュールの重複ロードを防ぐために shared を設定します。

### 組成

コンテナをロードします。

```js
// ./webpack.config.js
const URL_MAP = {
  content: process.env.CONTENT_URL || "http://localhost:3001",
  search: process.env.SEARCH_URL || "http://localhost:4001",
};

const config = {
  entry: "./src/index",
  plugins: [
    new ModuleFederationPlugin({
      name: "all",
      remotes: {
        content: `content@${URL_MAP.content}/remoteEntry.js`,
        search: `search@${URL_MAP.search}/remoteEntry.js`,
      },
      shared: {
        react: {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
        },
        "react-dom": {
          singleton: true,
          strictVersion: true,
          requiredVersion: "^18.0.0",
        },
      },
    }),
  ],
};
```

remotes で、コンテナをロードします。ロード URL は、提供しているサーバー URL です。
次に、エントリーコードです。

```typescript
// ./src/index.ts
// @see: https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
import("./bootstrap");
export {};
```

`@see`を読むと分かりますが、エントリーコードは、`import`で動的ロードする必要があります。
次に、bootstrap コードです。

```typescript
// ./src/bootstrap.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

```typescript
// ./src/App.tsx
import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    import("content/App").then((module) => {
      const { JsonDiv } = module;
      if (customElements.get("json-div") === undefined) {
        customElements.define("json-div", JsonDiv);
      }
    });
    import("search/App").then((module) => {
      const { SearchButton } = module;
      if (customElements.get("search-button") === undefined) {
        customElements.define("search-button", SearchButton);
      }
      const SearchButtonElement = document.querySelector("search-button");
      SearchButtonElement?.addEventListener("search", ((e: CustomEvent) => {
        document
          .querySelector("json-div")
          ?.setAttribute("value", JSON.stringify(e.detail));
      }) as EventListener);
    });
  }, []);

  return (
    <>
      <search-button />
      <json-div />
    </>
  );
};

export default App;
```

ここにある `import("content/App")` や`import("search/App")` がコンテナを動的ロードしているところです。
ロードするものは、WebComponents なので`customElements.define`で定義します。
また、`search-button`の`search`イベントハンドラをリッスンし、イベントデータを`json-div`の`value`属性に設定する処理を書きます。
これで、組成が完了です。

## メリット・デメリット

Web Components は、Shadow DOM というサンドボックス環境でコンポーネント開発できます。
そのため、フラグメントとして完全に独立することができます。
また、Web Components は標準技術であるため、React や Vue などどのライブラリでも適用することができるはずです。

フラグメントを組成する側は、内部のライブラリを意識せず、Web Components というカスタム HTML タグを組み立てるだけです。これも同様で、組成する側のライブラリも、どのライブラリでも使えるはずです。

フラグメントは、独立しなければならないです。依存してはマイクロフロントエンドの意味がありません。
フラグメント間のやりとりは、イベント・ドリブンで設計します。
具体的には、Custom Events です。

フラグメント内部で使っているライブラリを、別フラグメントでも使っていると、重複したライブラリロードとなってしまいます。そこで、Webpack の Module Federation で共有しましょう。
importmap でもできなくはないです。

## 最後に

クライアント組成やサーバーサイド組成、ビルドタイム組成、どのタイミングでもこのアイデアは使えると思います。
