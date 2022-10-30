---
title: ［覚書］ Micro Frontends
published: true
date: 2020-11-19
description: Micro Frontends とは?皆さん、**Micro Fronends**(以下、MFE)をご存知でしょうか。説明をざっくりしますと、Microservicesの考え方をフロントエンドまで拡張した考え方です。Microservicesは、バックエンド側で適用される事例をよく耳にしますが、フロントエンドでの適用事例は、あまり聞いたことがありません。
tags: ["Micro Frontends"]
cover_image: https://micro-frontends-japanese.org/resources/monolith-frontback-microservices.png
socialMediaImage: https://micro-frontends-japanese.org/resources/monolith-frontback-microservices.png
---

<!--  TODO: TOC -->

# Micro Frontends とは?🤔
皆さん、**Micro Fronends**(以下、MFE)をご存知でしょうか。説明をざっくりしますと、Microservicesの考え方をフロントエンドまで拡張した考え方です。Microservicesは、バックエンド側で適用される事例をよく耳にしますが、フロントエンドでの適用事例は、あまり聞いたことがありません。

従来、Webサービス開発ではモノリスな構成からスタートします。そこから、規模が拡大するにつれて様々な理由により、フロントエンドとバックエンドの分離、バックエンドのMicroservices化が行われます。

<figure title="[翻訳記事]マイクロフロントエンド > monolith-frontback-microservices">
<img alt="[翻訳記事]マイクロフロントエンド > monolith-frontback-microservices" src="https://micro-frontends-japanese.org/resources/monolith-frontback-microservices.png">
<figcaption><a href="https://micro-frontends-japanese.org/">[翻訳記事]マイクロフロントエンド</a></figcaption>
</figure>

Microservices化によって、Scalability、Agility、Independency、Availabilityの大幅な向上が期待できます。しかし、依然フロントエンドはモノリスなままです。そこで、次の画像のように、Microservicesと同様にフロントエンドも縦(専門領域)に分割します。

<figure title="[翻訳記事]マイクロフロントエンド > verticals-headline">
<img alt="[翻訳記事]マイクロフロントエンド > verticals-headline" src="https://micro-frontends-japanese.org/resources/verticals-headline.png">
<figcaption><a href="https://micro-frontends-japanese.org/">[翻訳記事]マイクロフロントエンド</a></figcaption>
</figure>

ただし、全てのWebサービスをMFEにする必要はありません。先程の説明にもあった通り、規模が拡大した際にMFEを検討する必要があるため、小・中規模のWebサービスでは時期尚早です。また、次の画像にもある通り、静的ページ(Webサイト,Webドキュメント)や動的ページ(Webアプリ)の両極端に位置するWebサービスはMFEの適用するのには不向きです(と書いています)。両方の要素が求められるWebサービスにMFEが役立ちます。MFEの適用されるWebサービス事例では、ECサイトが挙げられます。

<figure title="mfe-web-document-to-web-app">
<img alt="mfe-web-document-to-web-app" src="https://res.cloudinary.com/silverbirder/image/upload/v1613832627/silver-birder.github.io/blog/mfe-web-document-to-web-app.png">
<figcaption><a href="https://www.linkedin.com/pulse/microfrontends-approach-building-scalable-web-apps-vinci-rufus">Microfrontends: An approach to building Scalable Web Apps</a></figcaption>
</figure>

※ MFEという言葉は、[Micro frontends | Technology Radar | ThoughtWorks](https://www.thoughtworks.com/radar/techniques/micro-frontends) の記事より生まれたみたいです。
※ [Micro Frontends in Action](https://www.manning.com/books/micro-frontends-in-action)にも記載されていますが、この考え方はWebサービスを対象としており、ネイティブアプリは対象としていません。

# 導入企業👨‍💼👩‍💼
実績企業としては、IKEA、DAZN、Spotifyなどが挙げられます。他の例は、[Micro Frontends を調べたすべて](./think_micro_frontends.md) にリストアップしていますので、興味がある方はご覧ください。

# メリット・デメリット🔍
MFEを導入することによるメリット・デメリットについて、(プロダクション導入経験無しの私が偏見で)簡単に紹介します。Microservicesのメリット・デメリットと似ていると思います。

私が思う最大のメリットは、**Agility**と思います。規模が中・大規模なWebサービスとなると、様々な業務ドメインが詰め込まれます。先程のMFEの例(ECサイト)でいうと、推薦(inspire)、検索(search)、商品(product)、注文(checkout)などにあたります。これらを1つのフロントエンドで構築すると、ドメイン設計を適切に分離できたとしても、**開発者の業務ドメイン知識が追いつかず、開発スピードが低下してしまいます**。結果、特定の開発者の属人化が加速し、ボトルネックとなります。
そこで、それぞれ**業務ドメインを分割することで、開発者はそこだけにフォーカスできます。結果、開発スピードは維持できるはずです**。

私が思う最大のデメリットは、**Independencyの難しさ**だと思います。例えば、UI/UXの指針となるデザインシステムがWebサービスにあったとして、それをすべてのフロントエンドへ適用しなければいけません。そのため、全体を通した**一貫性のあるUI/UXであるかどうか**の品質担保が難しいです。
他には、あるチームのビルドツールを改善したとしても、他のチームではその恩恵を受けれなかったり、アプリケーション設計における全体共通(アクセス履歴、イベント管理、状態管理など)部分を、どうするか考える必要があります。

こちら [Micro Frontends を調べたすべて#ProsCons](./think_micro_frontends.md#proscons) にも簡単にメリット・デメリットを書いていますので、気になる方はご覧ください。

# 統合パターン🔮
MFEでは、各フロントエンドのフラグメント(HTML)を、どのタイミングで統合するのかが重要です。今回はその統合パターンをざっくり紹介します。
例えば、次のMFEの例で言えば、Team-Product、Team-Checkout、Team-Inspireの3つのフロントエンドフラグメント(HTML)があります。これらをどのタイミングで統合するのかがポイントです。

<figure title="[翻訳記事]マイクロフロントエンド > mfe-three-teams">
<img alt="[翻訳記事]マイクロフロントエンド > mfe-three-teams" src="https://micro-frontends-japanese.org/resources/three-teams.png">
<figcaption><a href="https://micro-frontends-japanese.org/">[翻訳記事]マイクロフロントエンド</a></figcaption>
</figure>

詳しくは、[Micro Frontends を調べたすべて#統合パターン](./think_micro_frontends.md) をご覧ください。

## ビルド時統合パターン
ビルド時統合とは、WebサービスをPublishする前のBuildの段階で統合するパターンです。このパターンは、[bit.dev](https://bit.dev)がよく使われます。

<figure title="bit.dev toppage">
<img alt="bit.dev toppage" src="https://storage.googleapis.com/zenn-user-upload/e74w0sjnj1r0zpzvd5xfvsk7k1bd">
<figcaption><a href="https://bit.dev/">bit.dev</a></figcaption>
</figure>

フラグメントをPackagingし、Packagingしたライブラリをimportさせてbuild(統合)します。あとは、buildした静的コンテンツをPublishさせるだけになります。

## サーバーサイド統合パターン
サーバーサイド統合とは、Webサーバー側のHTML構築段階で統合するパターンです。このパターンは、SSIやESI、Podium、Tailor、Ara-Frameworkなどが使われます。

<figure title="ssi">
<img alt="ssi" src="https://www.st-andrews.ac.uk/itsnew/web/images/ssi1.jpg">
<figcaption><a href="https://www.st-andrews.ac.uk/itsnew/web/ssi/index.shtml">Server-side includes (SSI)</a></figcaption>
</figure>

フラグメントを提供するサーバーを準備し、それらからフラグメント情報を収集し、全体のページHTMLを構築します。それをSSRとしてユーザーへ提供します。

<figure title="cloudflare-worker">
<img alt="cloudflare-worker" src="https://raw.githubusercontent.com/silverbirder/micro-frontends-sample-code-5/f3c20954e6196cb578cd16caaf5999e07306fb51/overview.svg">
<figcaption><a href="https://github.com/silverbirder/micro-frontends-sample-code-5">github.com/silverbirder/micro-frontends-sample-code-5</a></figcaption>
</figure>

サーバーサイドのサンプルコードは、次にまとめています。

* [Micro Frontends を学んだすべて](./microfrontends.md)
* [Ara-Framework で Micro Frontends with SSR](./ara-framework.md)
* [Zalando tailor で Micro Frontends with ( LitElement & etcetera)](./tailor.md)

また、サーバーサイドというよりEdgeでの統合パターンを下記リンクで紹介しています。

* [Cloudflare Workers (Edge Workers) で Micro Frontends](./cloudflare_workers_mfe.md)

※ リッチなインタラクションUIを表現したいなら、サーバーサイドとクライアントのHydrationをする必要があります。

## クライアントサイド統合パターン
クライアントサイド統合とは、ブラウザ側レンダリングの段階で統合するパターンです。このパターンは、iframeやWebComponentsなどが使われます。

iframeを使ったページ(フラグメント)埋め込み、全体のページHTMLを統合させたり、WebComponentsのようにカスタムエレメントを定義したHTMLタグでページを構成したりします。

<figure title="client side integration pattern">
<img alt="client side integration pattern" src="https://bluesoft.com/wp-content/uploads/2020/04/Micro-Frontends-11.jpg">
<figcaption><a href="https://bluesoft.com/micro-frontends-the-missing-piece-of-the-puzzle-in-feature-teams/">Micro Frontends – The Missing Piece Of The Puzzle In Feature Teams | BlueSoft</a></figcaption>
</figure>

# 終わりに👨‍💻👩‍💻
MFEのアプローチを実際に導入した企業は、国内だとまだ比較的少なく、どういった場面で役立つのかあまり明確ではありません。また、書籍や知見も多くはないため、未知な領域と思います。

ただ、依然フロントエンドがモノリスな、中・大規模なWebサービスを運用するならば、特に進化が激しいフロントエンド界隈の中で、サービス提供の速度、品質を維持するのは難しいと思います。フロントエンドもMicroservices化する場面が訪れるかもしれません。そんなときに、この記事を思い出して頂ければ幸いです。

※ 独り言ですが、MFEの構築アプローチとして、Edge Worker + Web Components の組み合わせが最近好みです。 

# 関連リンク🔗
私が書いたMFE関連の記事です。もしよければご覧ください。

* [Micro Frontends を学んだすべて](./microfrontends.md)
* [Micro Frontends を調べたすべて](./think_micro_frontends.md)
* [MFE関連資料リンク集](https://github.com/silverbirder/think-micro-frontends/blob/master/research/docs/read.md)
* [Ara-Framework で Micro Frontends with SSR](./ara-framework.md)
* [Zalando tailor で Micro Frontends with ( LitElement & etcetera)](./tailor.md)
* [Cloudflare Workers (Edge Workers) で Micro Frontends](./cloudflare_workers_mfe.md)
* [github.com/silverbirder/micro-frontends-on-kubernetes](https://github.com/silverbirder/micro-frontends-on-kubernetes)
* [speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial](https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial)
* [github.com/silverbirder/think-micro-frontends](https://github.com/silverbirder/think-micro-frontends)
* [github.com/silverbirder/micro-frontends-sample-code](https://github.com/silverbirder/micro-frontends-sample-code)
* [github.com/silverbirder/micro-frontends-sample-code-2](https://github.com/silverbirder/micro-frontends-sample-code-2)
* [github.com/silverbirder/micro-frontends-sample-code-3](https://github.com/silverbirder/micro-frontends-sample-code-3)
* [github.com/silverbirder/micro-frontends-sample-code-4](https://github.com/silverbirder/micro-frontends-sample-code-4)
* [github.com/silverbirder/micro-frontends-sample-code-5](https://github.com/silverbirder/micro-frontends-sample-code-5)
