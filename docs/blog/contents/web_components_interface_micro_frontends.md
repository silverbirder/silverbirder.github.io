---
title: Micro Frontendsで組成するフラグメントのインターフェースをWeb Componentsとするアイデア
published: true
date: 2022-05-23
description: xxxx
tags: ["Web Components"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1649683816/silver-birder.github.io/blog/kelly-sikkema-JRVxgAkzIsM-unsplash.jpg
---

Micro Frontends (以降、MFE) で組成するフラグメントを Web Components で定義しようというアイデアです。
MFE については、私のブログ記事 https://silver-birder.github.io/blog/contents/mfe/ をお読みください。

## 用語

- フラグメント
  - Micro Frontends の各フロントエンドコンポーネント
- 組成
  - フラグメントを使って、ページ全体を構成する

## 背景、モチベーション

MFE を実現するための設計は、大きく分けて 3 パターン考えられます。

- ビルドタイム組成パターン
  - フラグメントのモジュールも含めてビルド(`npm run build`)する
- サーバーサイド組成パターン
  - ESI や SSI のような手法で、サーバーサイドでフラグメントから HTML を組み立てる
- クライアントサイド組成パターン
  - ブラウザ上で、フラグメントから HTML を組み立てる

フラグメントは、具体的には、bit.dev を使ったり、React や Vue などのコンポーネントを使うかもしれません。
もしくは、HTML と JS,CSS をワンセットとするコードかもしれません。
また、組成に関して、上記の方法を取れば、フラグメントの実装依存になります。
MFE には、single-spa や zalando/tailor のようなライブラリも存在します。

ライブラリに依存する Micro Frontends の設計は、ライブラリへ密結合となってしまい、アジリティが低下し得ると思っています。
そこで、Web Components に依存するアイデアを考えました。

## 具体的なコード

リポジトリは、こちら。

https://github.com/Silver-birder/playground/tree/main/node/web-components-is-api-for-micro-frontends

```
- フラグメント
  - search-button
  - json-div
```

`search-button`

```typescript
// SearchButton.tsx
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
    const root = ReactDOM.createRoot(mountPoint as HTMLElement);
    root.render(
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
// App.tsx
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

```typescript
// remoteEntry.ts
export { SearchButton } from "./SearchButton";
```

```js
// webpack.config.js
  plugins: [
    new ModuleFederationPlugin({
      name: "search",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./remoteEntry",
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
```

組成レイヤ

```typescript
// @see: https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
import("./bootstrap");
export {};
```

```typescript
// bootstrap.tsx
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
// App.tsx
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
