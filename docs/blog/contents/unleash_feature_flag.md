---
title: Unleashで始めるフィーチャーフラグ
published: true
date: 2023-06-29
description: フィーチャーフラグ（Feature Flag）をご存知でしょうか？これは新機能のリリース制御やABテストを容易にする強力なツールです。しかし、適切な管理ツールなければ、フィーチャーフラグの管理は容易なことではありません。今回は、そんなフィーチャーフラグの管理を効率化するツール、**Unleash**について解説します。
tags: ["unleash"]
---

フィーチャーフラグ（Feature Flag）をご存知でしょうか？これは新機能のリリース制御やABテストを容易にする強力なツールです。しかし、適切な管理ツールなければ、フィーチャーフラグの管理は容易なことではありません。今回は、そんなフィーチャーフラグの管理を効率化するツール、**Unleash**について解説します。

![Unleash](https://storage.googleapis.com/zenn-user-upload/353d890469ef-20230628.png)
*Unleash*

Unleashのリポジトリはこちら👉[GitHub - Unleash](https://github.com/Unleash/unleash)

## フィーチャーフラグの課題と解決策

フィーチャーフラグとは、新機能の活性化・非活性化を制御するためのブール値のスイッチをコードに組み込む手法です。カナリアリリースやABテストのように、特定のユーザーにだけ新機能を表示したり、新機能のパフォーマンスをテストしたりするために用いられます。

フィーチャーフラグの管理方法はいくつかありますが、それらは環境変数、定義ファイル（CSV、YML、JSON）、データベースなどが一般的です。しかし、これらの管理方法にはフラグの切り替えに時間がかかる、不要なフラグの削除を忘れがちなどの問題点があります。ここで紹介したいのが、フィーチャーフラグ管理ツール**Unleash**です。

## なぜUnleashなのか？

Unleashは、フィーチャーフラグの管理を容易にするオープンソースツールです。様々な言語やフレームワークで利用でき、新機能の制御、テストの効率化、機能の並行作業などを可能にします。

Unleashの主な特長は以下の通りです。

- **GUIベースの操作**：フラグのON/OFF切り替えが簡単で、フラグの管理が非エンジニアでも可能です。(データアナリストとか)
- **柔軟なテスト機能**：ABテストだけでなく、多変量テストも可能です。
- **豊富な連携**：SlackやDatadogなどと連携してフラグの状態を共有できます。
- **API first**：他のアプリケーションやシステムとの連携が容易です。
- **セルフホスティングとクラウドサービス**：自分でホスティングすることも、クラウドサービスを利用することも可能です。

これらの特性により、Unleashはフィーチャーフラグの管理を効率化し、開発フローを加速します。

## Unleashのセットアップとフィーチャーフラグの使用方法

それでは、Unleashを実際に使用する流れを紹介していきます。今回はUnleashでフィーチャーフラグを一つ作成し、それをReactから参照するというシナリオとします。

Unleashのセットアップについては、公式ドキュメンテーションの[Unleash - Get started in 2 steps](https://github.com/Unleash/unleash#get-started-in-2-steps)を参考に、まずはローカル環境で試してみましょう。クラウド環境での構築を希望する場合は、PostgreSQLが無料で利用可能な[fly.io](https://fly.io)を推奨します。

構築が完了すると、Unleashの画面が表示されます。

![Unleash](https://storage.googleapis.com/zenn-user-upload/353d890469ef-20230628.png)
*Unleash*

フィーチャーフラグを作成してみましょう。`New feature toggle`をクリックし、名前には`new_feature`を入力します。

![New feature toggle](https://storage.googleapis.com/zenn-user-upload/b06e11b8f38a-20230628.png)
*New feature toggle*

続いて、ReactからUnleashへの接続に必要なAPI tokenを生成します。Unleashの画面上部から `Configure > API access` を選択します。

![API access](https://storage.googleapis.com/zenn-user-upload/4fea3cd45d9c-20230628.png)
*API access*

`New API token` をクリックし、API tokenを作成します。

![New API token](https://storage.googleapis.com/zenn-user-upload/1ac3a5595c02-20230628.png)
*New API token*

今回、クライアントサイド(React)でUnleashを利用するため、`Client-side SDK` を選択してAPI tokenを生成します。もちろん、サーバーサイドからUnleashを利用することも可能です。
ここで、environmentを`development`に設定します。これにより環境ごとにAPI tokenを設定できます。production向けのAPI tokenが必要な場合は、別途生成します。

次に生成したAPI tokenを `REACT_APP_UNLEASH_API_TOKEN` に設定し、以下のReactのコードで使用します。

```javascript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FlagProvider } from "@unleash/proxy-client-react";

const config = {
  url: `${process.env.REACT_APP_UNLEASH_URL}/api/frontend`,
  clientKey: `${process.env.REACT_APP_UNLEASH_API_TOKEN}`,
  refreshInterval: 1,
  appName: "default",
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <FlagProvider config={config}>
      <App />
    </FlagProvider>
  </React.StrictMode>
);
```

ここでは、フィーチャーフラグ`new_feature`を使用する例を示します。

```javascript
import React from "react";
import { useFlag } from "@unleash/proxy-client-react";

function App() {
  const flag = useFlag("new_feature");
  return (
    <div>{flag && "new_feature"}</div>
  );
}

export default App;
```

この設定により、UnleashのGUIからフィーチャーフラグをリアルタイムでON/OFFすることが可能になります。変更結果はUnleash経由でフロントエンドにリアルタイムで反映されます。

以下にフィーチャーフラグのデモを示します。都合上、`production`のenvironmentを使用しています。以下の画像をクリックすると動画を閲覧できます。

[![Feature flag demo](https://res.cloudinary.com/silverbirder/video/upload/c_scale,w_640/v1687921192/silver-birder.github.io/blog/feature-flag-demo.gif)](https://res.cloudinary.com/silverbirder/video/upload/v1687921192/silver-birder.github.io/blog/feature-flag-demo.gif)

以上がUnleashの基本的な使用方法です。

## Unleash機能: Activation Strategies

Unleashでは、フィーチャーフラグの活性化を制御するためのActivation Strategiesを設定することができます。

[Unleash - Activation Strategies](https://docs.getunleash.io/reference/activation-strategies)

Activation Strategiesは以下の4つがあります。

* Gradual rollout
    * ユーザーの一部に対して段階的に展開します。また、各ユーザーが訪問するたびに同じ経験が提供されることを保証します。
* Standard
    * このストラテジーは全てのユーザーに対してフィーチャーをオン/オフします。
    * ただし、Gradual rolloutストラテジーを使用することを推奨します。
* IPs
    * 特定のIPアドレスのセットに対してフィーチャーを有効にします。
* Hosts
    * 特定のホスト名のセットに対してフィーチャーを有効にします。

以下の画像は、Gradual rolloutの設定画面です。

![Gradual rollout](https://storage.googleapis.com/zenn-user-upload/aa326c9fcba8-20230628.png)
*Gradual rollout*

特に、Gradual RolloutストラテジーはABテストとしても利用可能です。

## Unleash機能: Variant

Unleashでは、全てのフィーチャーフラグにVariantという機能が用意されています。これにより、ユーザーをより詳細なセグメントに分けることが可能となります。

[Unleash - Feature toggle variants](https://docs.getunleash.io/reference/feature-toggle-variants)

例として、先ほど作成したnew_featureのフィーチャーフラグに対して、以下の画像の通り、4つのVariantを設定しました。それぞれのVariantは設定した `Weight` に基づいて選択されます。

![Feature toggle variants](https://storage.googleapis.com/zenn-user-upload/d0869460f07b-20230628.png)
*Feature toggle variants*

以下に、new_featureのVariantを使用する例を示します。`variant.name` には、先ほど設定したVariantのnameが入力されます。そのため、この`variant.name`を基に処理を分岐させることが可能です。

```javascript
import React from "react";
import { useVariant } from "@unleash/proxy-client-react";

function App() {
  const variant = useVariant("new_feature");
  if (!variant.enabled) return <>Default</>;
  switch (variant.name) {
    case "BlueButton":
      return <>BlueButton</>;
    case "GreenButton":
      return <>GreenButton</>;
    case "RedButton":
      return <>RedButton</>;
    case "YellowButton":
      return <>YellowButton</>;
  }
}

export default App;
```

このようにして、ABテストだけではなく、多変量テストを行うことが可能となります。

## Unleash機能: Toggle type

Unleashでは、フィーチャーフラグに様々なタイプが設定できます。各タイプは寿命(ライフタイム)が異なり、寿命が尽きたフィーチャーフラグはマークされます。マークされたフィーチャーフラグは、アーカイブすることを推奨します。

[Unleash - Feature toggle types](https://docs.getunleash.io/reference/feature-toggle-types)

フィーチャートグルのタイプは以下のように分類されます。

- **Release** : 継続的デリバリーを実践するチームのトランクベース開発を有効にします。予想される寿命は40日です。
- **Experiment** : 多変量テストまたはABテストを実施します。予想される寿命は40日です。
- **Operational** : システムの動作に関する運用面を制御します。予想される寿命は7日です。
- **Kill switch** : システム機能のグレースフルな劣化を可能にします。(永続的)
- **Permission** : 特定のユーザーが受け取るフィーチャーや製品体験を変更します。(永続的)

寿命が尽きたフィーチャーフラグは、技術的負債となります。フィーチャーフラグに関する技術的負債についての詳細な記事が以下のリンクで紹介されています。是非ご覧ください。

[Unleash - technical-dept](https://docs.getunleash.io/reference/technical-debt)

Unleashでは、Healthと呼ばれる指標が表示されます。この値が低いと、技術的負債が蓄積されているということを示します。フィーチャーフラグを適切にアーカイブする運用を心掛けましょう。

![Unleash health](https://storage.googleapis.com/zenn-user-upload/1a4ba5569cf8-20230628.png)
*Unleash health*

## Unleash 機能: その他

Unleashには、他にも以下に述べるような様々な機能が備わっています。

- 環境の追加
    - `development`や`production`以外にも、テストやステージング環境など、自由に環境を作成することができます。
    - 詳細：https://docs.getunleash.io/how-to/how-to-clone-environments
- Playgroundの利用
    - フィーチャーフラグの挙動を確認するためのPlaygroundが利用可能です。
    - アクセスURL：`https://<UNLEASH_URL>/playground`
- CORS originsの設定
    - フロントエンドからUnleashサーバーへのアクセスを許可するためのCORS設定ができます。
- フィーチャーフラグの承認フローの設定
    - フィーチャーフラグを有効化するための承認フローを設定することができます。
    - 詳細：https://docs.getunleash.io/reference/change-requests

## まとめ

フィーチャーフラグの管理に最適なツールとしてUnleashが一押しです。Unleashを使用することで、フラグの切り替えが容易になり、デプロイフローを通さずに高速にフィーチャーフラグを管理することが可能となります。多様なテストを行い、その結果を元に製品の改善が行えます。製品開発のスピードと品質が大幅に向上しますので、ぜひ一度試してみてください。
最後までお読み頂き、ありがとうございました。バッジを贈ってね！

**supported by ChatGPT**
