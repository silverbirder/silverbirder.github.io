---
title: Webアプリのテスト観点を調べてまとめてみた (25選)
published: true
date: 2020-06-18
description: 最近、Property Based Test という言葉を知りました。他にどういうテストの種類があるのか気になったので、調べてみました。本記事は、テストの種類を列挙します。※ 使用する技術は、私の都合上、node.jsで選んでいます。
tags: ["Web", "Testing"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614429879/silver-birder.github.io/blog/WebApp_Test.jpg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614429879/silver-birder.github.io/blog/WebApp_Test.jpg
---

最近、Property Based Test という言葉を知りました。
他にどういうテストの種類があるのか気になったので、調べてみました。
本記事は、テストの種類を列挙します。
※ 使用する技術は、私の都合上、node.jsで選んでいます。

<!--  TODO: TOC -->

# テスト観点一覧
## Cache Test

Webアプリでは、様々なCacheが使われます。
例えば、ブラウザCache、CDN Cache、プロキシCache、バックエンドCache などなどです。
Cacheは、便利な反面、使いすぎると、どこがどうCacheしているのか迷子になってしまいます。
Webアプリでも、Cacheをテストする必要がありそうです。

[https://github.com/http-tests/cache-tests](https://github.com/http-tests/cache-tests)  <!--  TODO: embed  -->

## Code Size Test

大きなサイズのJSライブラリを読み込むと、レスポンスタイムが悪化してしまいます。そこで、常にコードサイズを計測する必要があります。

[https://github.com/ai/size-limit](https://github.com/ai/size-limit)  <!--  TODO: embed  -->

<figure title="https://github.com/ai/size-limit">
<img alt="https://github.com/ai/size-limit" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429908/silver-birder.github.io/blog/size-limit.png">
<figcaption><a href="https://github.com/ai/size-limit">https://github.com/ai/size-limit</a></figcaption>
</figure>

## Complexity Test

循環的複雑度(Cyclomatic complexity)は、制御文(ifやfor)の複雑さを計測します。
複雑なコードは、バグの温床になりがちなので、極力シンプルなコードを心がけたいところです。

[https://eslint.org/docs/rules/complexity](https://eslint.org/docs/rules/complexity)  <!--  TODO: embed  -->

## Copy&Paste Test

Copy&Pasteは、DRYの原則に反するため、特別な理由がない限りは、してはいけません。Copy&Pasteを検出するツールがあるみたいです。

[https://github.com/kucherenko/jscpd](https://github.com/kucherenko/jscpd)  <!--  TODO: embed  -->

<figure title="https://github.com/kucherenko/jscpd">
<img alt="jscpd" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429933/silver-birder.github.io/blog/jscpd.png">
<figcaption><a href="https://github.com/kucherenko/jscpd">https://github.com/kucherenko/jscpd</a></figcaption>
</figure>

## Cross Browser/Platform Test

サポートするブラウザや、プラットフォーム(iOS,Android,Desktopなど)の動作検証が必要です。
そのため、サポートするブラウザやプラットフォームの環境を準備しなければなりません。
そういう環境を手軽に使えるサービスがあったりします。

[https://github.com/browserstack](https://github.com/browserstack)  <!--  TODO: embed  -->

## E2E Test

Webアプリを、端から端まで (End To End: E2E)を検証します。
例えば、ユーザーがWebアプリを訪れて、クリックや入力するなど、使ってみることです。
このテストは、不安定なテスト(よく失敗する)になりがちなので、安定稼働できるような取り組みが必要です。
例えば、操作する処理の抽象化や、データ固定などです。

[https://github.com/cypress-io/cypress](https://github.com/cypress-io/cypress)  <!--  TODO: embed  -->

## Exception Test
正常系、準正常系、異常系などのテストが必要です。
準正常系は、システムが意図的にエラーとしているものです。例えば、フォーム入力値エラーとかです。
異常系は、システムが意図せずエラーとなるものです。例えば、Timeoutエラーとかです。

また、Javaが得意な人なら知っているであろう、検査例外や非検査例外という例外の扱い方があります。
基本的には検査例外はエラーハンドリングし、非検査例外はエラーハンドリングしない方針が良いです。

## Flaky Test

不安定なテストのことを指します。これに対するアプローチ方法の１つに、Google社の資料があります。

[https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/45880.pdf](https://static.googleusercontent.com/media/research.google.com/ja//pubs/archive/45880.pdf)

日本人がまとめて頂いたものが、次の資料です。
[https://speakerdeck.com/nihonbuson/flakytests](https://speakerdeck.com/nihonbuson/flakytests)  <!--  TODO: embed  -->

## Integration Test
Integration Testは、Unit Testのような単一機能を統合した検証になります。
定義によりますが、私は『Unit Testでは発見できないようなもの』かなと思います。
Unit Testでカバーできていなくても、他のテストで検証できていれば、Integration Testは不要になります。

## Logging Test

ログ出力が適切なレベルで出力されているか検証する必要があります。
INFO, WARN, ERRORなどがルールに基づいて使い分けされているか気になります。
ログを出すことができるかどうかは、ログライブラリの検証になりますので、必要ないかもしれませんが、
意図したタイミングで、意図したログレベルで、意図したメッセージが出力されるかは、テストしても良いと思います。

## Monkey Test

お猿さんがランダムにテストするような、モンキーテストです。
テストのパターン網羅が難しい場合や、パターン網羅できているけどダメ押しで、このテストをします。

[https://github.com/marmelab/gremlins.js/](https://github.com/marmelab/gremlins.js/)  <!--  TODO: embed  -->

<figure title="https://github.com/marmelab/gremlins.js">
<img alt="gremlins.js" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429752/silver-birder.github.io/blog/gremlins.gif">
<figcaption><a href="https://github.com/marmelab/gremlins.js">https://github.com/marmelab/gremlins.js</a></figcaption>
</figure>

## Multi Tenanct Test

マルチテナントは、企業者（利用者）毎に区別した、同一のシステムを提供する方式です。
これは、企業毎にサブドメインを分けたりするため、その環境毎のテストが必要になります。

## Mutation Test

テストを検証するため、突然変異テストというものがあります。
プロダクトコードを破壊することで、テストも壊れるかどうかを検証します。
もし、プロダクトコードを壊しても、テストが成功してしまうと、それは正しくテストできていません。

[https://github.com/stryker-mutator/stryker](https://github.com/stryker-mutator/stryker)  <!--  TODO: embed  -->
<figure title="https://stryker-mutator.io/stryker/quickstart">
<img alt="https://stryker-mutator.io/stryker/quickstart" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429792/silver-birder.github.io/blog/stryker-mutator.gif">
<figcaption><a href="https://stryker-mutator.io/stryker/quickstart">https://stryker-mutator.io/stryker/quickstart</a></figcaption>
</figure>

## Chaos Test

障害を注入した際に、どういった動きになるのかを検証するテストです。

[https://github.com/goldbergyoni/node-chaos-monkey](https://github.com/goldbergyoni/node-chaos-monkey)  <!--  TODO: embed  -->

## Performance Test

パフォーマンスと言っても、
CPU使用率、メモリ使用率、レスポンスタイム、RPS など様々な指標があります。
これらを計測し、SLOなどの基準値を満たせているかを検証しておく必要があります。

[https://github.com/bestiejs/benchmark.js/](https://github.com/bestiejs/benchmark.js/)  <!--  TODO: embed  -->

## Property Based Test

データを半自動生成し、テストをする手法です。

[https://github.com/dubzzz/fast-check](https://github.com/dubzzz/fast-check)  <!--  TODO: embed  -->

## Regression Test
Regression Testは、修正した内容が意図せず他の箇所に影響を及ぼしていないか(デグレーション)を確認するテストです。
このテストは幅広い意味を持つので、ここに内容されるテスト種類は多いと思います。

## Robustness Test
Webアプリは、ロバストであるべきです。
何かしらWebアプリ内で障害が発生したとしても、最低限のサービスだけでも提供するのが好まれます。
もちろん、その際のHTTPステータスを200にせず、障害にあったステータスを返しましょう。

## Security Test

セキュリティのテストは、どんなWebアプリでも必須になります。
セキュリティの専門家ではないので、どういうテストが必要なのかは、ここでは割愛します。

依存するパッケージ脆弱性検査には、下記のコマンドが有効です。

```
npm audit fix
```

## SEO Test

Webアプリへ流入数を改善するためには、SEOは不可欠です。
lighthouseというツールでSEOスコアを見ることができるみたいです。

[https://github.com/GoogleChrome/lighthouse-ci](https://github.com/GoogleChrome/lighthouse-ci)  <!--  TODO: embed  -->

<figure title="https://github.com/GoogleChrome/lighthouse-ci">
<img alt="https://github.com/GoogleChrome/lighthouse-ci" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429818/silver-birder.github.io/blog/lighthouse-ci.png">
<figcaption><a href="https://github.com/GoogleChrome/lighthouse-ci">https://github.com/GoogleChrome/lighthouse-ci</a></figcaption>
</figure>

## Smoke Test

Smoke Testは、Webアプリが最低限動作するために必要なケースを確保する検証です。
例えば、トップページへリクエストしたら、レスポンスがHTTP 200で返却されるとかです。

この最低限の動作保証がなければ、これ以上の詳細なテストができません。
個人的には、Smoke Test → E2E Test の順で進むのかなと思っています。

## Snapshot Test

Webアプリへリクエストし、そのレスポンスであるHTML(スナップショット)を保存します。
このHTMLが、変更前と比較して変化がないかの検証をするのが、Snapshot testです。
リファクタリングなど、変化がない修正に対して有効です。

[https://jestjs.io/docs/ja/snapshot-testing](https://jestjs.io/docs/ja/snapshot-testing)  <!--  TODO: embed  -->

## Static Test

Static Testは、Webアプリを動かさなくても検証できるテストです。
よくあるのが、Linter です。

* HTML
[https://github.com/htmlhint/HTMLHint](https://github.com/htmlhint/HTMLHint)  <!--  TODO: embed  -->

* CSS

[https://github.com/CSSLint/csslint](https://github.com/CSSLint/csslint)  <!--  TODO: embed  -->

* JS

[https://github.com/eslint/eslint](https://github.com/eslint/eslint)  <!--  TODO: embed  -->

* SVG

[https://github.com/birjolaxew/svglint](https://github.com/birjolaxew/svglint)  <!--  TODO: embed  -->

* Commit

[https://github.com/conventional-changelog/commitlint](https://github.com/conventional-changelog/commitlint)  <!--  TODO: embed  -->

* Docker

[https://github.com/RedCoolBeans/dockerlint/](https://github.com/RedCoolBeans/dockerlint/)  <!--  TODO: embed  -->

これらは、プルリクエストで機械的に指摘する Danger との相性が良いです。

[https://github.com/danger/danger](https://github.com/danger/danger)  <!--  TODO: embed  -->

## Unit Test

単一機能をテストするUnit Testがあります。このUnit Testが全てPASSしたら、
他のテストを進めるのが一般的かなと思います。

[https://github.com/facebook/jest](https://github.com/facebook/jest)  <!--  TODO: embed  -->

### Code Coverage

Unitテストで、どこをテストできたかのカバレッジを見ることができます。
感覚としては、全体の8割を満たしていれば良いかなと思います。

[https://jestjs.io/docs/en/cli.html#--coverageboolean](https://jestjs.io/docs/en/cli.html#--coverageboolean)

実際に動作しているJSやCSSのカバレッジを収集することもできます。

[https://speakerdeck.com/pirosikick/puppeteerdeiranaicsswoxiao-su](https://speakerdeck.com/pirosikick/puppeteerdeiranaicsswoxiao-su)  <!--  TODO: embed  -->

[https://gist.github.com/Silver-birder/71135913192fbca51a7e26924bd36b8b](https://gist.github.com/Silver-birder/71135913192fbca51a7e26924bd36b8b)  <!--  TODO: embed  -->

## Visual Regression Test

見た目の変化を監視する必要があります。例えば、リンク切れとかがあれば、検出するべきです。

[https://github.com/garris/BackstopJS](https://github.com/garris/BackstopJS)  <!--  TODO: embed  -->

<figure title="https://github.com/garris/BackstopJS">
<img alt="https://github.com/garris/BackstopJS" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429842/silver-birder.github.io/blog/BackstopJS.png">
<figcaption><a href="https://github.com/garris/BackstopJS">https://github.com/garris/BackstopJS</a></figcaption>
</figure>

# 最後に
どういうテストの観点があるのか、調べたり、経験則よりざっと書いてみました。
全てをテストする必要はなく、『どういう動作の品質を担保したいか』を意識して、
取捨選択するのが良いと思います。
最後まで読んでいただき、ありがとございます。
