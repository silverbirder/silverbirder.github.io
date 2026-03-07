---
title: '［覚書］ Micro Frontends'
publishedAt: '2020-11-19'
summary: 'Micro Frontends とは?皆さん、 **Micro Fronends** (以下、MFE)をご存知でしょうか。説明をざっくりしますと、Microservicesの考え方をフロントエンドまで拡張した考え方です。Microservicesは、バックエンド側で適用される事例をよく耳にしますが、フロントエンドでの適用事例は、あまり聞いたことがありません。'
tags: ["フロントエンド"]
index: false
---

## Micro Frontends とは?🤔

皆さん、 **Micro Fronends** (以下、MFE)をご存知でしょうか。説明をざっくりしますと、Microservices の考え方をフロントエンドまで拡張した考え方です。Microservices は、バックエンド側で適用される事例をよく耳にしますが、フロントエンドでの適用事例は、あまり聞いたことがありません。

従来、Web サービス開発ではモノリスな構成からスタートします。そこから、規模が拡大するにつれて様々な理由により、フロントエンドとバックエンドの分離、バックエンドの Microservices 化が行われます。

[![[翻訳記事]マイクロフロントエンド > monolith-frontback-microservices](https://micro-frontends-japanese.org/resources/monolith-frontback-microservices.png)](https://micro-frontends-japanese.org/)

Microservices 化によって、Scalability、Agility、Independency、Availability の大幅な向上が期待できます。しかし、依然フロントエンドはモノリスなままです。そこで、次の画像のように、Microservices と同様にフロントエンドも縦(専門領域)に分割します。

[![[翻訳記事]マイクロフロントエンド > verticals-headline](https://micro-frontends-japanese.org/resources/verticals-headline.png)](https://micro-frontends-japanese.org/)

ただし、全ての Web サービスを MFE にする必要はありません。先程の説明にもあった通り、規模が拡大した際に MFE を検討する必要があるため、小・中規模の Web サービスでは時期尚早です。また、次の画像にもある通り、静的ページ(Web サイト,Web ドキュメント)や動的ページ(Web アプリ)の両極端に位置する Web サービスは MFE の適用するのには不向きです(と書いています)。両方の要素が求められる Web サービスに MFE が役立ちます。MFE の適用される Web サービス事例では、EC サイトが挙げられます。

[![Microfrontends: An approach to building Scalable Web Apps](https://res.cloudinary.com/silverbirder/image/upload/v1613832627/silver-birder.github.io/blog/mfe-web-document-to-web-app.png?ar=612%3A261)](https://www.linkedin.com/pulse/microfrontends-approach-building-scalable-web-apps-vinci-rufus)

※ MFE という言葉は、[Micro frontends | Technology Radar | ThoughtWorks](https://www.thoughtworks.com/radar/techniques/micro-frontends) の記事より生まれたみたいです。
※ [Micro Frontends in Action](https://www.manning.com/books/micro-frontends-in-action)にも記載されていますが、この考え方は Web サービスを対象としており、ネイティブアプリは対象としていません。

## 導入企業 👨‍💼👩‍💼

実績企業としては、IKEA、DAZN、Spotify などが挙げられます。他の例は、[Micro Frontends を調べたすべて](https://silverbirder.github.io/blog/contents/think_micro_frontends/) にリストアップしていますので、興味がある方はご覧ください。

## メリット・デメリット 🔍

MFE を導入することによるメリット・デメリットについて、(プロダクション導入経験無しの私が偏見で)簡単に紹介します。Microservices のメリット・デメリットと似ていると思います。

私が思う最大のメリットは、 **Agility** と思います。規模が中・大規模な Web サービスとなると、様々な業務ドメインが詰め込まれます。先程の MFE の例(EC サイト)でいうと、推薦(inspire)、検索(search)、商品(product)、注文(checkout)などにあたります。これらを 1 つのフロントエンドで構築すると、ドメイン設計を適切に分離できたとしても、 **開発者の業務ドメイン知識が追いつかず、開発スピードが低下してしまいます** 。結果、特定の開発者の属人化が加速し、ボトルネックとなります。
そこで、それぞれ **業務ドメインを分割することで、開発者はそこだけにフォーカスできます。結果、開発スピードは維持できるはずです** 。

私が思う最大のデメリットは、 **Independency の難しさ** だと思います。例えば、UI/UX の指針となるデザインシステムが Web サービスにあったとして、それをすべてのフロントエンドへ適用しなければいけません。そのため、全体を通した **一貫性のある UI/UX であるかどうか** の品質担保が難しいです。
他には、あるチームのビルドツールを改善したとしても、他のチームではその恩恵を受けれなかったり、アプリケーション設計における全体共通(アクセス履歴、イベント管理、状態管理など)部分を、どうするか考える必要があります。

こちら [Micro Frontends を調べたすべて#ProsCons](https://silverbirder.github.io/blog/contents/think_micro_frontends/#proscons) にも簡単にメリット・デメリットを書いていますので、気になる方はご覧ください。

## 統合パターン 🔮

MFE では、各フロントエンドのフラグメント(HTML)を、どのタイミングで統合するのかが重要です。今回はその統合パターンをざっくり紹介します。
例えば、次の MFE の例で言えば、Team-Product、Team-Checkout、Team-Inspire の 3 つのフロントエンドフラグメント(HTML)があります。これらをどのタイミングで統合するのかがポイントです。

[![[翻訳記事]マイクロフロントエンド > mfe-three-teams](https://micro-frontends-japanese.org/resources/three-teams.png)](https://micro-frontends-japanese.org/)

詳しくは、[Micro Frontends を調べたすべて#統合パターン](https://silverbirder.github.io/blog/contents/think_micro_frontends/) をご覧ください。

## ビルド時統合パターン

ビルド時統合とは、Web サービスを Publish する前の Build の段階で統合するパターンです。このパターンは、[bit.dev](https://bit.dev)がよく使われます。

[![bit.dev](https://res.cloudinary.com/silverbirder/image/upload/v1693376955/silver-birder.github.io/blog/e74w0sjnj1r0zpzvd5xfvsk7k1bd.png?ar=1200%3A531)](https://bit.dev/)

フラグメントを Packaging し、Packaging したライブラリを import させて build(統合)します。あとは、build した静的コンテンツを Publish させるだけになります。

## サーバーサイド統合パターン

サーバーサイド統合とは、Web サーバー側の HTML 構築段階で統合するパターンです。このパターンは、SSI や ESI、Podium、Tailor、Ara-Framework などが使われます。

[![Server-side includes (SSI)](https://res.cloudinary.com/silverbirder/image/upload/v1693376958/silver-birder.github.io/blog/ssi1.jpg?ar=600%3A375)](https://www.st-andrews.ac.uk/itsnew/web/ssi/index.shtml)

フラグメントを提供するサーバーを準備し、それらからフラグメント情報を収集し、全体のページ HTML を構築します。それを SSR としてユーザーへ提供します。

[![cloudflare-worker](https://res.cloudinary.com/silverbirder/image/upload/v1693376972/silver-birder.github.io/blog/overview.svg?ar=909%3A531)](https://github.com/silverbirder/micro-frontends-sample-code-5)

サーバーサイドのサンプルコードは、次にまとめています。

- [Micro Frontends を学んだすべて](https://silverbirder.github.io/blog/contents/microfrontends/)
- [Ara-Framework で Micro Frontends with SSR](https://silverbirder.github.io/blog/contents/ara-framework/)
- [Zalando tailor で Micro Frontends with ( LitElement & etcetera)](https://silverbirder.github.io/blog/contents/tailor/)

また、サーバーサイドというより Edge での統合パターンを下記リンクで紹介しています。

- [Cloudflare Workers (Edge Workers) で Micro Frontends](https://silverbirder.github.io/blog/contents/cloudflare_workers_mfe/)

※ リッチなインタラクション UI を表現したいなら、サーバーサイドとクライアントの Hydration をする必要があります。

## クライアントサイド統合パターン

クライアントサイド統合とは、ブラウザ側レンダリングの段階で統合するパターンです。このパターンは、iframe や WebComponents などが使われます。

iframe を使ったページ(フラグメント)埋め込み、全体のページ HTML を統合させたり、WebComponents のようにカスタムエレメントを定義した HTML タグでページを構成したりします。

[![Micro Frontends – The Missing Piece Of The Puzzle In Feature Teams | BlueSoft](https://res.cloudinary.com/silverbirder/image/upload/v1693376976/silver-birder.github.io/blog/Micro-Frontends-11.jpg?ar=1493%3A998)](https://bluesoft.com/micro-frontends-the-missing-piece-of-the-puzzle-in-feature-teams/)

## 終わりに 👨‍💻👩‍💻

MFE のアプローチを実際に導入した企業は、国内だとまだ比較的少なく、どういった場面で役立つのかあまり明確ではありません。また、書籍や知見も多くはないため、未知な領域と思います。

ただ、依然フロントエンドがモノリスな、中・大規模な Web サービスを運用するならば、特に進化が激しいフロントエンド界隈の中で、サービス提供の速度、品質を維持するのは難しいと思います。フロントエンドも Microservices 化する場面が訪れるかもしれません。そんなときに、この記事を思い出して頂ければ幸いです。

※ 独り言ですが、MFE の構築アプローチとして、Edge Worker + Web Components の組み合わせが最近好みです。

## 関連リンク 🔗

私が書いた MFE 関連の記事です。もしよければご覧ください。

- [Micro Frontends を学んだすべて](https://silverbirder.github.io/blog/contents/microfrontends/)
- [Micro Frontends を調べたすべて](https://silverbirder.github.io/blog/contents/think_micro_frontends/)
- [MFE 関連資料リンク集](https://github.com/silverbirder/think-micro-frontends/blob/master/research/docs/read.md)
- [Ara-Framework で Micro Frontends with SSR](https://silverbirder.github.io/blog/contents/ara-framework/)
- [Zalando tailor で Micro Frontends with ( LitElement & etcetera)](https://silverbirder.github.io/blog/contents/tailor/)
- [Cloudflare Workers (Edge Workers) で Micro Frontends](https://silverbirder.github.io/blog/contents/cloudflare_workers_mfe/)
- [github.com/silverbirder/micro-frontends-on-kubernetes](https://github.com/silverbirder/micro-frontends-on-kubernetes)
- [speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial](https://speakerdeck.com/silverbirder/micro-frontends-on-kubernetes-trial)
- [github.com/silverbirder/think-micro-frontends](https://github.com/silverbirder/think-micro-frontends)
- [github.com/silverbirder/micro-frontends-sample-code](https://github.com/silverbirder/micro-frontends-sample-code)
- [github.com/silverbirder/micro-frontends-sample-code-2](https://github.com/silverbirder/micro-frontends-sample-code-2)
- [github.com/silverbirder/micro-frontends-sample-code-3](https://github.com/silverbirder/micro-frontends-sample-code-3)
- [github.com/silverbirder/micro-frontends-sample-code-4](https://github.com/silverbirder/micro-frontends-sample-code-4)
- [github.com/silverbirder/micro-frontends-sample-code-5](https://github.com/silverbirder/micro-frontends-sample-code-5)
