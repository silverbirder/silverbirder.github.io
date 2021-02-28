<!-- 
title: Micro Frontends を調べたすべて
date: 2020-10-07T19:07:27+09:00
draft: false
description: 
image: 
icon: 😎
-->

<figure title="Photo by Dil on Unsplash">
<img alt="Photo by Dil on Unsplash" src="https://res.cloudinary.com/silverbirder/image/upload/v1614431656/silver-birder.github.io/blog/Photo_by_Dil_on_Unsplash.jpg">
<figcaption><span>Photo by <a href="https://unsplash.com/@thevisualiza?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Dil</a> on <a href="https://unsplash.com/s/photos/lego-block?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span></figcaption>
</figure>

Micro Frontendsに関わる記事を100件以上読みました(参考記事に記載しています)。そこから得たMicro Frontendsについてこの投稿に記録します。
また、調査メモについて、次のリポジトリに残しています。

[https://github.com/Silver-birder/think-micro-frontends:embed]

[:contents]

# 発端

[https://www.thoughtworks.com/radar/techniques/micro-frontends:embed]

# 実績企業

* Airbnb
* Allegro
* Amazon
* Beamery
* Bit.dev
* BuzzFeed
* CircleCI
* DAZN
* Elsevier
* Entando
* Facebook
* Fiverr
* Hello Fresh
* IKEA
* Klarna
* Microsoft
* Open Table
* OpenMRS
* Otto
* Paypal
* SAP
* Sixt
* Skyscanner
* Smapiot
* Spotify
* Starbucks
* Thalia
* Upwork
* Zalando
* ZEISS

# ProsCons
## Pros
|観点|内容|
|--|--|
|独立性|・任意のテクノロジーと任意のチームで開発可能<br>|
|展開|・特定の機能をエンドツーエンド(バック、フロント、デプロイ）で確実に実行可能|
|俊敏性|・特定のドメインについて最高の知識を持つチーム間で作業を分散すると、リリースプロセスが確実にスピードアップして簡素化される。<br>・フロントエンドとリリースが小さいということは、リグレッションテストの表面がはるかに小さいことを意味する。リリースごとの変更は少なく、理論的にはテストに費やす時間を短縮できる。<br>・フロントエンドのアップグレード/変更にはコストが小さくなる|

## Cons
|観点|内容|
|--|--|
|独立性|・独立できず、相互接続しているチームが存在しがち<br>・多くの機能で複数のマイクロフロントエンドにまたがる変更が必要になり、独立性や自律性が低下<br>・ライブラリを共有すること自体は問題ないが、不適切な分割によって作成された任意の境界を回避するための包括的な場所として使用すると、問題が発生する。<br>・コンポーネント間の通信の構築は、実装と維持が困難であるだけでなく、コンポーネントの独立性が取り除かれる<br>・横断的関心事への変更ですべてのマイクロフロントエンドを変更することは、独立性が低下する|
|展開|・より大きな機能の部分的な実装が含まれているため、個別にリリースできない<br>・サイト全体の CI / CD プロセス|
|俊敏性|・重複作業が発生する<br>・検出可能性が低下した結果、一部の標準コンポーネントを共有できず、個別のフロントエンド間で実装が重複してしまう。<br>・共有キャッシュがないと、各コンポーネントは独自のデータセットをプルダウンする必要があり、大量の重複呼び出しが発生する。|
|パフォーマンス|・マイクロフロントエンドの実装が不適切な場合、パフォーマンスが低下する可能性がある。|

# 統合パターン

[https://bluesoft.com/micro-frontends-the-missing-piece-of-the-puzzle-in-feature-teams/:embed]

|統合|選択基準|技術|
|--|--|--|
|サーバーサイド統合|良好な読み込みパフォーマンスと検索エンジンのランキングがプロジェクトの優先事項であること|・Podium<br>・Ara-Framework<br>・Tailor<br>・Micromono<br>・PuzzleJS<br>・namecheap/ilc|
|エッジサイド統合|サーバーサイド統合と同じ|・Varnish EDI <br>・Edge Worker<br><br>CDN<br>・ Akamai<br>・ Cloudfront<br>・ Fastly<br>・CloudFlare<br>・ Fly.io|
|クライアント統合|さまざまなチームのユーザーインターフェイスを 1 つの画面に統合する必要があるインタラクティブなアプリケーションを構築すること|・Ajax<br>・Iframe<br>・Web Components<br>・Luigi<br>・Single-Spa<br>・FrintJS<br>・Hinclude<br>・Mashroom|
|ビルド時統合|他の統合が非常に複雑に思われる場合に、<br>小さなプロジェクト（3 チーム以下）にのみ使用すること|・ Bit.dev<br>・ Open Components<br>・ Piral|

# 機能
## コミュニケーション

[https://developer.mozilla.org/ja/docs/Web/API/CustomEvent:embed]

[https://github.com/postaljs/postal.js:embed]

## データ共有

* ストレージ
  * URL
  * Cookie
  * Local Storage/Session Storage


## モジュール共有

* webpack

[https://webpack.js.org/concepts/module-federation/:embed]

[https://webpack.js.org/configuration/externals/:embed]

[https://webpack.js.org/plugins/dll-plugin/:embed]

## ルーティング

Vaddin router

[https://vaadin.com/router:embed]

## キャッシュ

[https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API:embed]

[https://developer.mozilla.org/ja/docs/Web/API/IndexedDB_API:embed]

## 認証

* JWT

[https://jwt.io/:embed]

## 計測

* Google Analytics
* Navigation Timing API
* Resource Timing API
* High Resolution Time API
* User Timing API
* Frame Timing API
* Server Timing API
* Performance Observer

### Real User Monitoring

* SpeedCurve
* Catchpoint
* New Relic
* Boomerang.js
* Parfume.js
* sitespeed.io

### Synthetics Monitoring

* Lighthouse
* WebpageTest

## Proxy

コンポジションプロキシ。テンプレートを組み合わせる。

[https://github.com/tes/compoxure:embed]

## アクセス履歴

[https://developer.mozilla.org/ja/docs/Web/API/History_API:embed]

# 分割ポリシー

フロントエンドを分割する方針について

- 水平分割
  - 画面内にある要素で分割
  - ビジネス上の機能
- 垂直分割
  - 画面毎に分割

# Webサイト⇔Webアプリ

<figure title="document-application">
<img alt="document-application" src="https://res.cloudinary.com/silverbirder/image/upload/v1614412210/silver-birder.github.io/blog/microfrontends-document-application.png">
<figcaption><a href="https://www.linkedin.com/pulse/microfrontends-approach-building-scalable-web-apps-vinci-rufus">Microfrontends: An approach to building Scalable Web Apps</a></figcaption>
</figure>

マイクロフロントエンドは、かなりのオーバーラップがあるバンドの中央部分の大部分に最も適しています。バンドの両極端に該当するプロジェクトにマイクロフロントエンドアーキテクチャを実装しようとすると、生産性に反するそうです。

# リポジトリ

|パターン|Pros|Cons|技術|
|--|--|--|--|
|モノリポ|コードベース全体に簡単にアクセスできる。<br> (検出可能性が高い)|モノリポジトリは、特に大規模なチームで作業しているときに、<br>動作が遅くなる傾向があり、バージョン管理下のコミットとファイルの数が増加する。|・nx.dev<br>・lerna|
|マルチリポ|・マルチリポジトリは、非常に大規模なプロジェクトと<br>それに取り組む非常に大規模なチームがある場合に最適。|マルチリポジトリ環境では、各マイクロアプリを<br>個別にビルドする必要がある。||

# 他アーキテクチャ
|アーキテクチャ名|関係リンク|
|--|--|
|Modular Monolith|・[Deconstructing the Monolith – Shopify Engineering](https://engineering.shopify.com/blogs/engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity)<br>・[kgrzybek/modular-monolith-with-ddd](https://github.com/kgrzybek/modular-monolith-with-ddd)|
|Enterprise Architecture (Clean Architecture)|・[Building an Enterprise Application with Vue](https://medium.com/javascript-in-plain-english/building-vue-enterprise-application-part-0-overture-6d41bea14236)<br>・[soloschenko-grigoriy/vue-vuex-ts](https://github.com/soloschenko-grigoriy/vue-vuex-ts/)|
|Jam Stack|[Jam Stack](https://jamstack.org/)|
|App Shell|[App Shell モデル](https://developers.google.com/web/fundamentals/architecture/app-shell?hl=ja)|

#  書籍

[https://www.manning.com/books/micro-frontends-in-action:embed]

# 参考記事

* [https://blog.bitsrc.io/communication-between-micro-frontends-67a745c6cfbe](https://blog.bitsrc.io/communication-between-micro-frontends-67a745c6cfbe)
* [https://medium.com/swlh/luigi-micro-fronteds-orchestrator-8c0eca710151](https://medium.com/swlh/luigi-micro-fronteds-orchestrator-8c0eca710151)
* [https://medium.com/swlh/micro-frontends-in-action-221d4ed81c35](https://medium.com/swlh/micro-frontends-in-action-221d4ed81c35)
* [https://medium.com/swlh/problems-with-micro-frontends-8a8fc32a7d58](https://medium.com/swlh/problems-with-micro-frontends-8a8fc32a7d58)
* [https://levelup.gitconnected.com/podium-easy-server-side-micro-frontends-385f3a4cd346](https://levelup.gitconnected.com/podium-easy-server-side-micro-frontends-385f3a4cd346)
* [https://levelup.gitconnected.com/micro-frontend-curry-506b98a4cfc0](https://levelup.gitconnected.com/micro-frontend-curry-506b98a4cfc0)
* [https://medium.com/javascript-in-plain-english/demystify-micro-frontends-using-component-libraries-53aa9a33cf5b](https://medium.com/javascript-in-plain-english/demystify-micro-frontends-using-component-libraries-53aa9a33cf5b)
* [https://medium.com/@areai51/microfrontends-an-approach-to-building-scalable-web-apps-e8678e2acdd6](https://medium.com/@areai51/microfrontends-an-approach-to-building-scalable-web-apps-e8678e2acdd6)
* [https://medium.com/@shubhranshutiwari07/micro-frontend-microfe-is-superman-part-1-basic-understanding-architectures-21970d3fc218](https://medium.com/@shubhranshutiwari07/micro-frontend-microfe-is-superman-part-1-basic-understanding-architectures-21970d3fc218)
* [https://medium.com/better-programming/5-steps-to-turn-a-random-react-application-into-a-micro-frontend-946718c147e7](https://medium.com/better-programming/5-steps-to-turn-a-random-react-application-into-a-micro-frontend-946718c147e7)
* [https://medium.com/@lucamezzalira/micro-frontends-decisions-framework-ebcd22256513](https://medium.com/@lucamezzalira/micro-frontends-decisions-framework-ebcd22256513)
* [https://medium.com/hacking-talent/two-years-of-micro-frontends-a-retrospective-522526f76df4](https://medium.com/hacking-talent/two-years-of-micro-frontends-a-retrospective-522526f76df4)
* [https://medium.com/@sagiv.bengiat/integrate-react-with-other-applications-and-frameworks-94d443e3cc3f](https://medium.com/@sagiv.bengiat/integrate-react-with-other-applications-and-frameworks-94d443e3cc3f)
* [https://medium.com/js-dojo/serverless-micro-frontends-using-vue-js-aws-lambda-and-hypernova-835d6f2b3bc9](https://medium.com/js-dojo/serverless-micro-frontends-using-vue-js-aws-lambda-and-hypernova-835d6f2b3bc9)
* [https://medium.com/swlh/micro-frontend-using-web-components-e9faacfc101b](https://medium.com/swlh/micro-frontend-using-web-components-e9faacfc101b)
* [https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16](https://medium.com/@tomsoderlund/micro-frontends-a-microservice-approach-to-front-end-web-development-f325ebdadc16)
* [https://medium.com/@PepsRyuu/micro-frontends-341defa8d1d4](https://medium.com/@PepsRyuu/micro-frontends-341defa8d1d4)
* [https://medium.com/hepsiburadatech/hepsiburada-micro-frontend-d%C3%B6n%C3%BC%C5%9F%C3%BCm%C3%BC-4c2f26b8dcae](https://medium.com/hepsiburadatech/hepsiburada-micro-frontend-d%C3%B6n%C3%BC%C5%9F%C3%BCm%C3%BC-4c2f26b8dcae)
* [https://medium.com/javascript-in-plain-english/create-micro-frontends-using-web-components-with-support-for-angular-and-react-2d6db18f557a](https://medium.com/javascript-in-plain-english/create-micro-frontends-using-web-components-with-support-for-angular-and-react-2d6db18f557a)
* [https://medium.com/hackernoon/understanding-micro-frontends-b1c11585a297](https://medium.com/hackernoon/understanding-micro-frontends-b1c11585a297)
* [https://medium.com/javascript-in-plain-english/micro-frontends-made-easy-e49acceea536](https://medium.com/javascript-in-plain-english/micro-frontends-made-easy-e49acceea536)
* [https://itnext.io/building-micro-frontend-applications-with-angular-elements-34483da08bcb](https://itnext.io/building-micro-frontend-applications-with-angular-elements-34483da08bcb)
* [https://blog.pragmatists.com/independent-micro-frontends-with-single-spa-library-a829012dc5be](https://blog.pragmatists.com/independent-micro-frontends-with-single-spa-library-a829012dc5be)
* [https://blog.bitsrc.io/state-of-micro-frontends-9c0c604ed13a](https://blog.bitsrc.io/state-of-micro-frontends-9c0c604ed13a)
* [https://medium.com/stepstone-tech/microfrontends-extending-service-oriented-architecture-to-frontend-development-part-1-120b71c87b68](https://medium.com/stepstone-tech/microfrontends-extending-service-oriented-architecture-to-frontend-development-part-1-120b71c87b68)
* [https://medium.com/bb-tutorials-and-thoughts/6-different-ways-to-implement-micro-frontends-with-angular-298bc8d79f6b](https://medium.com/bb-tutorials-and-thoughts/6-different-ways-to-implement-micro-frontends-with-angular-298bc8d79f6b)
* [https://medium.com/@benjamin.d.johnson/exploring-micro-frontends-87a120b3f71c](https://medium.com/@benjamin.d.johnson/exploring-micro-frontends-87a120b3f71c)
* [https://medium.com/hacking-talent/using-micro-frontends-to-permanently-solve-the-legacy-javascript-problem-5fba18b0ceac](https://medium.com/hacking-talent/using-micro-frontends-to-permanently-solve-the-legacy-javascript-problem-5fba18b0ceac)
* [https://medium.com/dazn-tech/micro-frontends-the-future-of-frontend-architectures-5867ceded39a](https://medium.com/dazn-tech/micro-frontends-the-future-of-frontend-architectures-5867ceded39a)
* [https://medium.com/swlh/build-micro-frontends-using-angular-elements-the-beginners-guide-75ffeae61b58](https://medium.com/swlh/build-micro-frontends-using-angular-elements-the-beginners-guide-75ffeae61b58)
* [https://medium.com/dazn-tech/adopting-a-micro-frontends-architecture-e283e6a3c4f3](https://medium.com/dazn-tech/adopting-a-micro-frontends-architecture-e283e6a3c4f3)
* [https://codeburst.io/breaking-a-large-angular-app-into-microfrontends-fb8f985d549f](https://codeburst.io/breaking-a-large-angular-app-into-microfrontends-fb8f985d549f)
* [https://medium.com/dazn-tech/orchestrating-micro-frontends-a5d2674cbf33](https://medium.com/dazn-tech/orchestrating-micro-frontends-a5d2674cbf33)
* [https://tech.buzzfeed.com/micro-frontends-at-buzzfeed-b8754b31d178](https://tech.buzzfeed.com/micro-frontends-at-buzzfeed-b8754b31d178)
* [https://blog.bitsrc.io/serverless-microfrontends-in-aws-999450ed3795](https://blog.bitsrc.io/serverless-microfrontends-in-aws-999450ed3795)
* [https://medium.com/dazn-tech/identifying-micro-frontends-in-our-applications-4b4995f39257](https://medium.com/dazn-tech/identifying-micro-frontends-in-our-applications-4b4995f39257)
* [https://medium.com/@gilfink/avoiding-the-framework-catholic-wedding-using-stencil-compiler-3c2aa55bcaca](https://medium.com/@gilfink/avoiding-the-framework-catholic-wedding-using-stencil-compiler-3c2aa55bcaca)
* [https://medium.com/@lucamezzalira/building-micro-frontends-the-book-a2b531d0279a](https://medium.com/@lucamezzalira/building-micro-frontends-the-book-a2b531d0279a)
* [https://blog.bitsrc.io/tools-and-practices-for-microfrontends-dab0283393f2](https://blog.bitsrc.io/tools-and-practices-for-microfrontends-dab0283393f2)
* [https://medium.com/better-programming/thoughts-about-micro-frontends-in-2020-dd95eb7216f](https://medium.com/better-programming/thoughts-about-micro-frontends-in-2020-dd95eb7216f)
* [https://medium.com/@rangleio/five-things-to-consider-before-choosing-micro-frontends-f685e71bdd76](https://medium.com/@rangleio/five-things-to-consider-before-choosing-micro-frontends-f685e71bdd76)
* [https://blog.bitsrc.io/how-we-achieved-smooth-navigation-across-micro-frontends-42130577924d](https://blog.bitsrc.io/how-we-achieved-smooth-navigation-across-micro-frontends-42130577924d)
* [https://eng.collectivehealth.com/gracefully-scaling-web-applications-with-micro-frontends-part-i-162b1e529074](https://eng.collectivehealth.com/gracefully-scaling-web-applications-with-micro-frontends-part-i-162b1e529074)
* [https://eng.collectivehealth.com/gracefully-scaling-web-applications-with-micro-frontends-part-ii-8fa730d05b14](https://eng.collectivehealth.com/gracefully-scaling-web-applications-with-micro-frontends-part-ii-8fa730d05b14)
* [https://medium.com/bb-tutorials-and-thoughts/should-we-frameworks-for-micro-frontends-35f9f15b7821](https://medium.com/bb-tutorials-and-thoughts/should-we-frameworks-for-micro-frontends-35f9f15b7821)
* [https://medium.com/javascript-in-plain-english/microfrontends-bringing-javascript-frameworks-together-react-angular-vue-etc-5d401cb0072b](https://medium.com/javascript-in-plain-english/microfrontends-bringing-javascript-frameworks-together-react-angular-vue-etc-5d401cb0072b)
* [https://medium.com/@_rchaves_/building-microfrontends-part-i-creating-small-apps-710d709b48b7](https://medium.com/@_rchaves_/building-microfrontends-part-i-creating-small-apps-710d709b48b7)
* [https://blog.bitsrc.io/6-patterns-for-microfrontends-347ae0017ec0](https://blog.bitsrc.io/6-patterns-for-microfrontends-347ae0017ec0)
* [https://medium.jonasbandi.net/frontend-monoliths-run-if-you-can-voxxed-day-zuerich-2019-d8d714ff361a](https://medium.jonasbandi.net/frontend-monoliths-run-if-you-can-voxxed-day-zuerich-2019-d8d714ff361a)
* [https://medium.com/@gilfink/why-im-betting-on-web-components-and-you-should-think-about-using-them-too-8629396e27a](https://medium.com/@gilfink/why-im-betting-on-web-components-and-you-should-think-about-using-them-too-8629396e27a)
* [https://medium.com/@ScriptedAlchemy/webpack-5-module-federation-stitching-two-simple-bundles-together-fe4e6a069716](https://medium.com/@ScriptedAlchemy/webpack-5-module-federation-stitching-two-simple-bundles-together-fe4e6a069716)
* [https://medium.com/passionate-people/my-experience-using-micro-frontends-e99a1ad6ed32](https://medium.com/passionate-people/my-experience-using-micro-frontends-e99a1ad6ed32)
* [https://engineering.contaazul.com/evolving-an-angularjs-application-using-microfrontends-2bbcac9c023a](https://engineering.contaazul.com/evolving-an-angularjs-application-using-microfrontends-2bbcac9c023a)
* [https://blog.bitsrc.io/11-popular-misconceptions-about-micro-frontends-d5daecc92efb](https://blog.bitsrc.io/11-popular-misconceptions-about-micro-frontends-d5daecc92efb)
* [https://medium.com/js-dojo/micro-frontends-using-vue-js-react-js-and-hypernova-af606a774602](https://medium.com/js-dojo/micro-frontends-using-vue-js-react-js-and-hypernova-af606a774602)
* [https://medium.com/linedevth/micro-frontends-the-new-era-of-front-end-edge-technology-cb981ad26eae](https://medium.com/linedevth/micro-frontends-the-new-era-of-front-end-edge-technology-cb981ad26eae)
* [https://blog.bitsrc.io/sharing-dependencies-in-micro-frontends-9da142296a2b](https://blog.bitsrc.io/sharing-dependencies-in-micro-frontends-9da142296a2b)
* [https://medium.com/@pyaesonenyein/micro-frontends-part-one-95ea3d939bc6](https://medium.com/@pyaesonenyein/micro-frontends-part-one-95ea3d939bc6)
* [https://medium.com/outbrain-engineering/micro-front-ends-doing-it-angular-style-part-1-219c842fd02e](https://medium.com/outbrain-engineering/micro-front-ends-doing-it-angular-style-part-1-219c842fd02e)
* [https://levelup.gitconnected.com/brief-introduction-to-micro-frontends-architecture-ec928c587727](https://levelup.gitconnected.com/brief-introduction-to-micro-frontends-architecture-ec928c587727)
* [https://itnext.io/prototyping-micro-frontends-d03397c5f770](https://itnext.io/prototyping-micro-frontends-d03397c5f770)
* [https://blog.bitsrc.io/mini-web-apps-a-bounded-context-for-microfrontends-with-microservices-f1482af9276f](https://blog.bitsrc.io/mini-web-apps-a-bounded-context-for-microfrontends-with-microservices-f1482af9276f)
* [https://medium.com/trendyol-tech/micro-frontends-how-it-changed-our-development-process-a5cf667356da](https://medium.com/trendyol-tech/micro-frontends-how-it-changed-our-development-process-a5cf667356da)
* [https://medium.embengineering.com/micro-front-end-and-web-components-ce6ae87c3b7f](https://medium.embengineering.com/micro-front-end-and-web-components-ce6ae87c3b7f)
* [https://medium.com/@witek1902/ui-in-microservices-world-micro-frontends-pattern-and-web-components-23607a569363](https://medium.com/@witek1902/ui-in-microservices-world-micro-frontends-pattern-and-web-components-23607a569363)
* [https://medium.com/stepstone-tech/microfrontends-part-2-integration-and-communication-3385bc242673](https://medium.com/stepstone-tech/microfrontends-part-2-integration-and-communication-3385bc242673)
* [https://blog.bitsrc.io/building-react-microfrontends-using-piral-c26eb206310e](https://blog.bitsrc.io/building-react-microfrontends-using-piral-c26eb206310e)
* [https://medium.com/js-dojo/implementing-microfrontends-in-nuxt-js-using-svelte-and-ara-framework-8c06b683472c](https://medium.com/js-dojo/implementing-microfrontends-in-nuxt-js-using-svelte-and-ara-framework-8c06b683472c)
* [https://itnext.io/implementing-microfrontends-in-gatsbyjs-using-ara-framework-a95ee79cc0e7](https://itnext.io/implementing-microfrontends-in-gatsbyjs-using-ara-framework-a95ee79cc0e7)
* [https://itnext.io/strangling-a-monolith-to-micro-frontends-decoupling-presentation-layer-18a33ddf591b](https://itnext.io/strangling-a-monolith-to-micro-frontends-decoupling-presentation-layer-18a33ddf591b)
* [https://itnext.io/page-building-using-micro-frontends-c13c157958c8](https://itnext.io/page-building-using-micro-frontends-c13c157958c8)
* [https://medium.com/notonlycss/micro-frontends-architecture-1407092403d5](https://medium.com/notonlycss/micro-frontends-architecture-1407092403d5)
* [https://medium.com/soluto-nashville/not-so-micro-frontends-building-a-reverse-proxy-f41ab5cde81c](https://medium.com/soluto-nashville/not-so-micro-frontends-building-a-reverse-proxy-f41ab5cde81c)
* [https://medium.com/@armand1m_/why-micro-frontends-might-not-work-for-you-5a810b4687b0](https://medium.com/@armand1m_/why-micro-frontends-might-not-work-for-you-5a810b4687b0)
* [https://medium.embengineering.com/micro-front-ends-webpack-manifest-b05fc63a0d53](https://medium.embengineering.com/micro-front-ends-webpack-manifest-b05fc63a0d53)
* [https://medium.com/better-programming/you-dont-have-to-lose-optimization-for-micro-frontends-60a63d5f94fe](https://medium.com/better-programming/you-dont-have-to-lose-optimization-for-micro-frontends-60a63d5f94fe)
* [https://medium.com/wix-engineering/3-ways-micro-frontends-could-improve-your-life-dev-velocity-and-product-97ff611881b5](https://medium.com/wix-engineering/3-ways-micro-frontends-could-improve-your-life-dev-velocity-and-product-97ff611881b5)
* [https://medium.com/oracledevs/microservice-approach-for-web-development-micro-frontends-1cba93d85021](https://medium.com/oracledevs/microservice-approach-for-web-development-micro-frontends-1cba93d85021)
* [https://medium.com/@miki.lombi/micro-frontends-from-the-00s-to-20s-19b37efece6d](https://medium.com/@miki.lombi/micro-frontends-from-the-00s-to-20s-19b37efece6d)
* [https://medium.com/@soroushchehresa/deep-dive-into-the-micro-frontends-approach-c2ba1e5cd689](https://medium.com/@soroushchehresa/deep-dive-into-the-micro-frontends-approach-c2ba1e5cd689)
* [https://medium.embengineering.com/micro-front-ends-server-side-rendering-2b515220a56e](https://medium.embengineering.com/micro-front-ends-server-side-rendering-2b515220a56e)
* [https://medium.com/wehkamp-techblog/sharing-server-code-between-micro-sites-4f23359101e5](https://medium.com/wehkamp-techblog/sharing-server-code-between-micro-sites-4f23359101e5)
* [https://medium.com/@mikkanthrope/sso-with-jwt-and-react-micro-frontends-811f0fcc4121](https://medium.com/@mikkanthrope/sso-with-jwt-and-react-micro-frontends-811f0fcc4121)
* [https://itnext.io/the-micro-frontends-journey-tech-agnostic-principle-b61414b19505](https://itnext.io/the-micro-frontends-journey-tech-agnostic-principle-b61414b19505)
* [https://medium.com/@singh.architsinghaim/micro-front-ends-dc105f5c0fea](https://medium.com/@singh.architsinghaim/micro-front-ends-dc105f5c0fea)
* [https://medium.embengineering.com/micro-front-ends-76171c02ab17](https://medium.embengineering.com/micro-front-ends-76171c02ab17)
* [https://medium.com/codingtown/micro-frontends-mystery-8b51b6e2f7f9](https://medium.com/codingtown/micro-frontends-mystery-8b51b6e2f7f9)
* [https://medium.com/rangle-io/micro-frontends-and-the-rise-of-federated-applications-265171bcb346](https://medium.com/rangle-io/micro-frontends-and-the-rise-of-federated-applications-265171bcb346)
* [https://medium.com/@felipegaiacharly/the-micro-frontends-journey-tech-agnostic-principle-b61414b19505](https://medium.com/@felipegaiacharly/the-micro-frontends-journey-tech-agnostic-principle-b61414b19505)
* [https://medium.com/better-practices/how-postman-engineering-does-microservices-aa026a3d682d](https://medium.com/better-practices/how-postman-engineering-does-microservices-aa026a3d682d)
* [https://medium.com/ergonode/create-your-own-vue-micro-frontend-architecture-with-vuems-library-f054233b97cb](https://medium.com/ergonode/create-your-own-vue-micro-frontend-architecture-with-vuems-library-f054233b97cb)
* [https://blog.bitsrc.io/how-to-develop-microfrontends-using-react-step-by-step-guide-47ebb479cacd](https://blog.bitsrc.io/how-to-develop-microfrontends-using-react-step-by-step-guide-47ebb479cacd)
* [https://medium.com/jit-team/microfrontends-should-i-care-12b871f70fa3](https://medium.com/jit-team/microfrontends-should-i-care-12b871f70fa3)
* [https://medium.com/mailup-group-tech-blog/micro-frontends-in-the-mailup-console-82a81e712cfe](https://medium.com/mailup-group-tech-blog/micro-frontends-in-the-mailup-console-82a81e712cfe)
* [https://towardsdatascience.com/looking-beyond-the-hype-is-modular-monolithic-software-architecture-really-dead-e386191610f8](https://towardsdatascience.com/looking-beyond-the-hype-is-modular-monolithic-software-architecture-really-dead-e386191610f8)
* [https://medium.com/swlh/developing-and-deploying-micro-frontends-with-single-spa-c8b49f2a1b1d](https://medium.com/swlh/developing-and-deploying-micro-frontends-with-single-spa-c8b49f2a1b1d)
* [https://levelup.gitconnected.com/easy-svelte-micro-frontends-with-podium-34aa949bed02](https://levelup.gitconnected.com/easy-svelte-micro-frontends-with-podium-34aa949bed02)
* [https://medium.com/swlh/react-vue-svelte-on-one-page-with-micro-frontends-f740b3ee6979](https://medium.com/swlh/react-vue-svelte-on-one-page-with-micro-frontends-f740b3ee6979)
* [https://blog.bitsrc.io/using-es-modules-with-dynamic-imports-to-implement-micro-frontends-7c840a38890e](https://blog.bitsrc.io/using-es-modules-with-dynamic-imports-to-implement-micro-frontends-7c840a38890e)
* [https://medium.com/@jh.rossa/micro-frontend-federation-today-and-tomorrow-4eda3ab69409](https://medium.com/@jh.rossa/micro-frontend-federation-today-and-tomorrow-4eda3ab69409)
* [https://medium.com/design-and-tech-co/modular-monoliths-a-gateway-to-microservices-946f2cbdf382](https://medium.com/design-and-tech-co/modular-monoliths-a-gateway-to-microservices-946f2cbdf382)
* [https://medium.com/swlh/implementing-micro-frontends-using-react-8d23b7e0a687](https://medium.com/swlh/implementing-micro-frontends-using-react-8d23b7e0a687)
* [https://medium.com/javascript-in-plain-english/javascript-monorepo-with-lerna-5729d6242302](https://medium.com/javascript-in-plain-english/javascript-monorepo-with-lerna-5729d6242302)
* [https://levelup.gitconnected.com/a-micro-frontend-solution-for-react-1914b19663b](https://levelup.gitconnected.com/a-micro-frontend-solution-for-react-1914b19663b)
* [https://medium.com/@lucamezzalira/i-dont-understand-micro-frontends-88f7304799a9](https://medium.com/@lucamezzalira/i-dont-understand-micro-frontends-88f7304799a9)
* [https://floqast.com/engineering-blog/post/implementing-a-micro-frontend-architecture-with-react/](https://floqast.com/engineering-blog/post/implementing-a-micro-frontend-architecture-with-react/)
* [https://blog.bitsrc.io/how-we-build-micro-front-ends-d3eeeac0acfc](https://blog.bitsrc.io/how-we-build-micro-front-ends-d3eeeac0acfc)
* [https://medium.com/upwork-engineering/modernizing-upwork-with-micro-frontends-d5be5ec1d9a](https://medium.com/upwork-engineering/modernizing-upwork-with-micro-frontends-d5be5ec1d9a)
* [https://blog.bitsrc.io/implementing-micro-front-end-with-single-spa-and-react-eeb4364100f](https://blog.bitsrc.io/implementing-micro-front-end-with-single-spa-and-react-eeb4364100f)
* [https://www.redhat.com/en/blog/5-benefits-using-micro-frontends-build-process-driven-applications](https://www.redhat.com/en/blog/5-benefits-using-micro-frontends-build-process-driven-applications)
* [https://medium.com/swlh/cross-app-bundling-a-different-approach-for-micro-frontends-e4f212b6a9a](https://medium.com/swlh/cross-app-bundling-a-different-approach-for-micro-frontends-e4f212b6a9a)
* [https://www.esentri.com/composing-micro-frontends-server-side](https://www.esentri.com/composing-micro-frontends-server-side)
* [https://dev.to/dabit3/building-micro-frontends-with-react-vue-and-single-spa-52op](https://dev.to/dabit3/building-micro-frontends-with-react-vue-and-single-spa-52op)
* [https://dev.to/florianrappl/11-popular-misconceptions-about-micro-frontends-463p](https://dev.to/florianrappl/11-popular-misconceptions-about-micro-frontends-463p)
* [https://dev.to/rsschouwenaar/thoughts-about-micro-frontends-in-2020-39ed](https://dev.to/rsschouwenaar/thoughts-about-micro-frontends-in-2020-39ed)
* [https://dev.to/onerzafer/understanding-micro-frontends-1ied](https://dev.to/onerzafer/understanding-micro-frontends-1ied)
* [https://dev.to/aregee/breaking-down-the-last-monolith-micro-frontends-hd4](https://dev.to/aregee/breaking-down-the-last-monolith-micro-frontends-hd4)
* [https://dev.to/thejoin95/micro-frontends-from-the-00s-to-20s-5a2](https://dev.to/thejoin95/micro-frontends-from-the-00s-to-20s-5a2)
* [https://dev.to/florianrappl/communication-between-micro-frontends-41fe](https://dev.to/florianrappl/communication-between-micro-frontends-41fe)
* [https://dev.to/phodal/micro-frontend-architecture-in-action-4n60](https://dev.to/phodal/micro-frontend-architecture-in-action-4n60)
* [https://dev.to/jondearaujo/the-approaches-and-challenges-of-micro-frontends-a-theoretical-introduction-176](https://dev.to/jondearaujo/the-approaches-and-challenges-of-micro-frontends-a-theoretical-introduction-176)
* [https://dev.to/scriptedalchemy/micro-frontend-architecture-replacing-a-monolith-from-the-inside-out-3ali](https://dev.to/scriptedalchemy/micro-frontend-architecture-replacing-a-monolith-from-the-inside-out-3ali)
* [https://dev.to/abhinavnigam2207/an-approach-to-micro-frontend-architecture-mvp-with-nextjs-2l84](https://dev.to/abhinavnigam2207/an-approach-to-micro-frontend-architecture-mvp-with-nextjs-2l84)
* [https://dev.to/jamesmh/using-micro-uis-to-extend-legacy-web-applications-166](https://dev.to/jamesmh/using-micro-uis-to-extend-legacy-web-applications-166)
* [https://dev.to/jonisar/11-must-know-frontend-trends-for-2020-13e1](https://dev.to/jonisar/11-must-know-frontend-trends-for-2020-13e1)
* [https://dev.to/manfredsteyer/6-steps-to-your-angular-based-microfrontend-shell-1nei](https://dev.to/manfredsteyer/6-steps-to-your-angular-based-microfrontend-shell-1nei)
* [https://dev.to/coroutinedispatcher/working-on-modularising-android-app-314c](https://dev.to/coroutinedispatcher/working-on-modularising-android-app-314c)
* [https://dev.to/remast/my-software-architecture-resources-g38](https://dev.to/remast/my-software-architecture-resources-g38)
* [https://dev.to/open-wc/open-wc-scoped-elements-3e47](https://dev.to/open-wc/open-wc-scoped-elements-3e47)
* [https://medium.com/cdiscount-engineering/microservices-frontend-module-federation-an-handsome-promise-3b309944c215](https://medium.com/cdiscount-engineering/microservices-frontend-module-federation-an-handsome-promise-3b309944c215)
* [https://medium.com/@infoxicator/what-is-holocron-224255625241](https://medium.com/@infoxicator/what-is-holocron-224255625241)
* [https://medium.com/paypal-engineering/how-micro-frontend-has-changed-our-team-dynamic-ba2f01597f48](https://medium.com/paypal-engineering/how-micro-frontend-has-changed-our-team-dynamic-ba2f01597f48)
* [https://dev.to/kleeut/how-do-you-share-authentication-in-micro-frontends-5glc](https://dev.to/kleeut/how-do-you-share-authentication-in-micro-frontends-5glc)
* [https://github.com/ChristianUlbrich/awesome-microfrontends](https://github.com/ChristianUlbrich/awesome-microfrontends)
* [https://github.com/rajasegar/awesome-micro-frontends](https://github.com/rajasegar/awesome-micro-frontends)
* [https://github.com/MPankajArun/awesome-micro-frontends](https://github.com/MPankajArun/awesome-micro-frontends)
* [https://github.com/phodal/microfrontends](https://github.com/phodal/microfrontends)
* [https://martinfowler.com/articles/micro-frontends.html](https://martinfowler.com/articles/micro-frontends.html)
* [https://thenewstack.io/microfrontends-the-benefits-of-microservices-for-client-side-development](https://thenewstack.io/microfrontends-the-benefits-of-microservices-for-client-side-development)
* [https://allegro.tech/2016/03/Managing-Frontend-in-the-microservices-architecture.html](https://allegro.tech/2016/03/Managing-Frontend-in-the-microservices-architecture.html)
* [https://engineering.hellofresh.com/front-end-microservices-at-hellofresh-23978a611b87](https://engineering.hellofresh.com/front-end-microservices-at-hellofresh-23978a611b87)
* [http://tech.opentable.co.uk/blog/2016/04/27/opencomponents-microservices-in-the-front-end-world/](http://tech.opentable.co.uk/blog/2016/04/27/opencomponents-microservices-in-the-front-end-world/)
* [http://tech.opentable.co.uk/blog/2015/02/09/dismantling-the-monolith-microsites-at-opentable/](http://tech.opentable.co.uk/blog/2015/02/09/dismantling-the-monolith-microsites-at-opentable/)
* [https://medium.com/@matteofigus/5-years-of-opencomponents-3114e6d6a35b](https://medium.com/@matteofigus/5-years-of-opencomponents-3114e6d6a35b)
* [https://blog.senacor.com/microfrontends/](https://blog.senacor.com/microfrontends/)
* [https://www.infoq.com/news/2018/08/experiences-micro-frontends/](https://www.infoq.com/news/2018/08/experiences-micro-frontends/)
* [https://dzone.com/articles/building-micro-frontends-with-single-spa-and-react](https://dzone.com/articles/building-micro-frontends-with-single-spa-and-react)
* [https://www.agilechamps.com/microservices-to-micro-frontends/](https://www.agilechamps.com/microservices-to-micro-frontends/)
* [https://gustafnk.github.io/microservice-websites/](https://gustafnk.github.io/microservice-websites/)
* [https://hub.packtpub.com/what-micro-frontend/](https://hub.packtpub.com/what-micro-frontend/)
* [https://www.thoughtworks.com/de/radar/techniques/micro-frontends](https://www.thoughtworks.com/de/radar/techniques/micro-frontends)
* [http://blog.wolksoftware.com/microlibraries-the-future-of-web-development](http://blog.wolksoftware.com/microlibraries-the-future-of-web-development)
* [https://xebia.com/blog/the-monolithic-frontend-in-the-microservices-architecture/](https://xebia.com/blog/the-monolithic-frontend-in-the-microservices-architecture/)
* [https://x-team.com/blog/micro-frontend/](https://x-team.com/blog/micro-frontend/)
* [https://menelaos.dev/devweek-sf-2020/](https://menelaos.dev/devweek-sf-2020/)
* [https://www.infoq.com/news/2020/07/microfrontends-vue-yoav-yanovski/](https://www.infoq.com/news/2020/07/microfrontends-vue-yoav-yanovski/)
* [https://www.infoq.com/articles/microfrontends-business-needs](https://www.infoq.com/articles/microfrontends-business-needs)
* [https://www.infoq.com/articles/architecture-trends-2020/](https://www.infoq.com/articles/architecture-trends-2020/)
* [https://www.infoq.com/news/2018/08/experiences-micro-frontends/](https://www.infoq.com/news/2018/08/experiences-micro-frontends/)
* [https://www.infoq.com/news/2020/01/strategies-micro-frontends/](https://www.infoq.com/news/2020/01/strategies-micro-frontends/)
* [https://speakerdeck.com/kimh/k8stotraefikdetukurumaikurohurontoendo](https://speakerdeck.com/kimh/k8stotraefikdetukurumaikurohurontoendo)
