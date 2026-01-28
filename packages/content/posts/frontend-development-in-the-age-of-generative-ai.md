---
title: '生成AI時代のフロントエンド開発術'
publishedAt: '2024-05-22'
summary: '2022年11月にChatGPTがリリースされて、1年と約半年が経過しました。私はChatGPTが話題になった頃から、継続して利用しています。ChatGPTを使い続けていると、Webアプリケーションのフロントエンド開発に役立つことがありました。そこで、本記事ではフロントエンド開発でChatGPTを活用して効率よく進める3つのパターンにまとめました。これらのパターンを紹介し、読者の皆さんの開発に役立ててもらえればと思います。以下は、本記事で紹介するFigma、ソースコード、デプロイ先URLです。'
tags: ["AI", "フロントエンド"]
index: false
---

2022年11月にChatGPTがリリースされて、1年と約半年が経過しました。
私はChatGPTが話題になった頃から、継続して利用しています。
ChatGPTを使い続けていると、Webアプリケーションのフロントエンド開発に役立つことがありました。

そこで、本記事では**フロントエンド開発でChatGPTを活用して効率よく進める3つのパターン**にまとめました。
これらのパターンを紹介し、読者の皆さんの開発に役立ててもらえればと思います。

以下は、本記事で紹介するFigma、ソースコード、デプロイ先URLです。

- [Wireframing photo - Figma](https://www.figma.com/design/aYRsXAqHD2AQp2OHbrnDn1/Wireframing-in-Figma)
- [silverbirder/figma-photo-sample-app-for-ai - GitHub](https://github.com/silverbirder/figma-photo-sample-app-for-ai)
- https://figma-photo-sample-app-for-ai.vercel.app

## ChatGPTを使う前に

ChatGPTにフロントエンドのソースコードなどを学習させないために、データコントロールをOFFにしておきましょう。

[Data Controls FAQ | OpenAI Help Center](https://help.openai.com/en/articles/7730893-data-controls-faq)

## 前提

これから紹介する方法は特定の技術スタックに限定されるものではありません。
皆さんのお好みのものに読み替えていただければと思います。今回は以下の技術スタック・ツールを使用します。

- デザインツール: Figma
- Webアプリフレームワーク: Next.js
- スタイル: CSS Module
- テスト: Vitest

### デモ対象

対象となる画面は、[Wireframing in Figma](https://www.figma.com/design/aYRsXAqHD2AQp2OHbrnDn1/Wireframing-in-Figma)にあるPhotoというサービスの1画面です。

![Photo - Wireframing in Figma](http://res.cloudinary.com/silverbirder/image/upload/v1716296631/xmpiivtyzkq5wnelcwde.png)

ソースコードは、[silverbirder/figma-photo-sample-app-for-ai - GitHub](https://github.com/silverbirder/figma-photo-sample-app-for-ai) にありますのでご参考にください。

## 紹介する内容

今回紹介するのは、フロントエンド開発における以下の流れです。

① FigmaのデザインからReactコンポーネント作成  
② 仕様を満たすビジネスロジックの実装  
③ 開発したReactコンポーネントのテストコード作成  

新規開発や既存改修のどちらでも、この流れは大きく変わりません。今回は上記の順番で進めます。

## FigmaのデザインからReactコンポーネント作成

FigmaのデザインからReactコードを生成するための方法をご紹介します。

ちなみに、Figmaのデザインからコード生成するプラグインやサービスは、ネットで検索すると沢山見つかりますが、コード生成結果の精度はあまり芳しくありませんでした。

### FigmaからCSSをエクスポート

以下の図のように、Figmaから対象のデザインのCSSを抽出します。また、デザインのスクリーンショットも撮っておきます。

![Figma > Copy as code > CSS (all layers)](http://res.cloudinary.com/silverbirder/image/upload/v1716296634/cccbdmvxlhbr0pkkbskn.png)

### エクスポートしたCSSをChatGPTに渡し、ReactとStyleのコードを生成してもらう

以下のようなメッセージをChatGPT(GPT-4o)に送ります。

```plaintext
以下は、Figmaから抽出したCSSです。
---
<コピーしたCSS> (内容は確認しておいてください。)
---

添付画像は、上記CSSのスクリーンショットです。
これらから、ReactとCSS Moduleのコードを生成してください。
コード生成は、以下のコードを参考にしてください。
---
import React from "react";
import styles from "./Hoge.module.css";

const Hoge = () => {
  return ();
};

export default Hoge;
---
```

返答されたコードを基にReactコンポーネントを作成します。
Figmaのデザインを忠実に再現しようとするため、適宜「positionを使わずに」や「横幅は固定せず」といった指示を出して調整します。
レスポンシブデザインやアニメーション、ホバーなども適宜調整します。

以下の画像は、実際にコード生成されたものを適用したものです。完璧ではありませんが、**数分程度でFigmaの1画面が構築できました**。(修正は2度ぐらい)

![React Photo - Wireframing in Figma](http://res.cloudinary.com/silverbirder/image/upload/v1716297392/nlcwjvbsbsnv2oaya43e.png)

ゼロから開発するよりも、ある程度**雛形となるコードを作成してくれる方が時間短縮になります**。
また、**自身では知らない方法でコード作成してくれる場合もあり、勉強になります**。

## 仕様を満たすビジネスロジックの実装

Webアプリケーションのフロントエンドで、仕様を満たすための実装をします。
例えば、フォームのバリデーションやAPI通信、クリックなどのインタラクションなどがあります。
このような実装方法について、ChatGPTに尋ねることが多いです。

尋ねる内容は、Reactのコードと仕様文書をChatGPTに送って回答をもらいます。
たびたび仕様を満たせない回答もありますが、基本的には自分の設計案を確認するために使います。

以下は、ナビゲーションヘッダーを固定し、透過グラデーションさせたい場合の例です。

```plaintext
以下のReactコードとスタイルから、ヘッダーを固定させて かつ 透過しグラデーションしてほしい。
---
<Reactのコード>
---
<スタイルのコード>
---
```

生成されたCSSと画面の例です。

```css
.navbar {
  position: fixed; /* 固定表示にする */
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: 1000; /* 他の要素より前面に表示するためにz-indexを追加 */
  backdrop-filter: blur(10px); /* 背景をぼかして通過させる */
}
```

![Photo Navbar](http://res.cloudinary.com/silverbirder/image/upload/v1716341355/eqolmpun1a5o34wclgxf.png)

これは単なる例に過ぎませんが、**生成されたコードから設計方法について参考にしたり、知らない方法を学べる良い機会**になります。

このプロセスは仕様に依存するため、具体的な方法を紹介することは少ないです。

## 開発したReactコンポーネントのテストコード作成

プロダクトのコード（Reactコード）をChatGPTに渡し、単体テストを書いてもらいます。
参考になるテストコードも一緒に渡すと、それに合わせたコードを生成してくれます。
テストが動作しない場合や型の誤りがある場合は、指示を出して修正します。

```plaintext
以下のReactコードに対して、テストコードを書いてください。
---
<Reactコード>
---

テストコードは、以下のコードを参考にしてください。
---
import { expect, it, describe } from "vitest";
import { render } from "@testing-library/react";
import Hoge from "./Hoge";

describe("Hoge", () => {
  const setup = () => {
    const utils = render(<Hoge />);

    return { ...utils };
  };

  it("should render correctly and match snapshot", () => {
    // Act
    const { asFragment } = setup();

    // Assert
    expect(asFragment()).toMatchSnapshot();
  });
});
---
```

以下は、生成されたテストコードの例です。

```tsx
import { expect, it, describe } from "vitest";
import { render } from "@testing-library/react";
import Navbar from "./Navbar";

describe("Navbar Component", () => {
  const setup = () => {
    const utils = render(<Navbar />);

    return { ...utils };
  };

  it("should render correctly and match snapshot", () => {
    // Act
    const { asFragment } = setup();

    // Assert
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the logo", () => {
    // Act
    const

 { getByText } = setup();

    // Assert
    expect(getByText("photo")).toBeDefined();
  });

  it("should render all navigation links", () => {
    // Act
    const { getByText } = setup();

    // Assert
    const navLinks = ["Features", "Pricing", "Community", "Support"];
    navLinks.forEach((linkText) => {
      expect(getByText(linkText)).toBeDefined();
    });
  });

  it("should render the login and register buttons", () => {
    // Act
    const { getByRole } = setup();

    // Assert
    expect(getByRole("button", { name: "Log in" })).toBeDefined();
    expect(getByRole("button", { name: "Register" })).toBeDefined();
  });
});
```

仕様が複雑になると、テストケースが増え、ChatGPTの便利さをより実感できます。

個人的に、テストコードが書きやすいプロダクトコードは、設計として見通しの良いものになると考えています。
そのため、テストコードが読みにくい場合は、プロダクトコードを修正するようにしています。

## なぜChatGPTを選んだのか

もともと、生成AIが話題になった頃から使っていたツールだからです。
GitHub Copilotも良いツールですが、**デザインなど視覚的な情報が必要な場合**にはChatGPTが役立ちます。

最近、ChatGPTのMacOSアプリがリリースされ、スクリーンショットのしやすさが改善されています。

[Using the ChatGPT MacOS App | OpenAI Help Center](https://help.openai.com/en/articles/9275200-using-the-chatgpt-macos-app)

## 終わりに

このように、ChatGPTを活用することでフロントエンド開発の効率化を図ることができます。
時間短縮だけでなく、知らないことを学べる機会にもなり一石二鳥です。
ぜひ、皆さんの開発にも取り入れてみてください。
