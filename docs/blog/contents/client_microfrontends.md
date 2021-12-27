---
title: クライアントサイド(ES Module)でMicro Frontends
published: true
date: 2021-01-16
description: 2021年、あけましておめでとうございます。本年も宜しくおねがいします。最近、体重が増えてしまったため、有酸素運動を頑張っています。本記事は、昨年の冬あたりから検証していた クライアントサイド統合でのMicro Frontendsについて話そうと思います。検証したソースコードは、次のリポジトリにあります。
tags: ["Client Side", "Es Module", "Micro Frontends"]
cover_image: https://res.cloudinary.com/silverbirder/image/fetch/f_auto/https://raw.githubusercontent.com/Silver-birder/micro-frontends-sample-code-6/main/overview.svg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/fetch/f_auto/https://raw.githubusercontent.com/Silver-birder/micro-frontends-sample-code-6/main/overview.svg
---

2021年、あけましておめでとうございます。本年も宜しくおねがいします。最近、体重が増えてしまったため、有酸素運動を頑張っています。

本記事は、昨年の冬あたりから検証していた クライアントサイド統合でのMicro Frontendsについて話そうと思います。検証したソースコードは、次のリポジトリにあります。

<iframely-embed card="small" url="https://github.com/Silver-birder/micro-frontends-sample-code-6"></iframely-embed>

<!--  TODO: TOC -->

# 概要

全体設計イメージ図は、次のとおりです。

![overview](https://res.cloudinary.com/silverbirder/image/fetch/f_auto/https://raw.githubusercontent.com/Silver-birder/micro-frontends-sample-code-6/main/overview.svg)

サーバーサイドは静的コンテンツを返すだけとし、クライアントサイドでアプリケーションを構築します。

構築手段は、ブラウザ標準である ES Module Importを使用し、アプリケーションに必要なJavascript(index.js, bootstrap用)をloadします。

UIに必要な各TeamのComponentは、API経由で取得し、レンダリングする構成になります。

# Javascript Module

Javascript(index.js)には、次のModuleを含めようと考えていました。

* DOM Parser
  * 任意の要素の情報を取得する
* Imorter
  * 任意のModuleを取得する
* Router
  * Webアプリケーション全体のRoutingを管理する
* Worker
  * バックグランドで実行する処理を管理する
* EventHub
  * Module間の通信を制御する

これらをざっと考えていた訳ですが、結局実装したのはImporterとRouterぐらいです (笑)。力尽きてしまいました。

また、前提として可能な限り各Teamの依存関係を独立するよう心がけます。Micro Frontendsでは、独立できてこそのメリットが享受できるため、できる限り各Teamの共通化は避けるようにします。

# Javascript Importer

全体設計イメージ図にも書いていますが、JavascriptのImporterは、Component Discovery APIを通して、各TeamのComponentをImportします。この構成は、MicroservicesのService Discovery Patternsに似せています。この構成を取ることで、各チーム同士は独立(非依存)することができます。

# Javascript Router

Routerは、アプリケーション全体のRoutingを管理します。例えば、`/` はTopページ、 `/s` は検索ページといった具合です。
Routerには、後ほど説明するWebComponentsとの相性が良いvaadin/router を使用しました。

<iframely-embed card="small" url="https://vaadin.com/router"></iframely-embed>

vaadin/routerでは、WebComponentsを指定してRoutingするため、指定されたWebComponentsは、Importerより取得します。

# Component

ComponentはLitElementというWebComponentsベースのライブラリを使用しています。各TeamのComponent(LitElementのライブラリ込)をImportしていると、重複したloadとなりパフォーマンスがよろしくありません。共通ライブラリを事前にload (import mapとかで)することをお勧めします。

WebComponentsということなので、Shadow DOMでレンダリングすることになります。CSSのスコープが独立できるため、他へ影響することはありません。ただ、全体的なブランドカラーを統一したい等 Design Systemがある場合、Componentの共通化のやり方を(慎重に)考える必要があります。

# Build Package, Design System, Performance Metrics

各Teamを独立したいといっても、共通化しないといけないことがあると考えています。私が想定しているものは、次のとおりです。

* Design System
  * Component全体のデザインを統一する
* Performance Metrics
  * 計測指標のルールを全体で統一する
    * Rendering Time
    * Response Time
    * etc
* Build Package
  * ライブラリの扱い方を統一する
    * External
    * ECM Version
    * etc

と書いているだけで、実際に試した訳ではありません(笑)。

# 所感
Micro Frontendsのサーバーサイド統合でもそうでしたが、Componentを集約・提供するサービスは、クライアントサイド統合でも必要になりました。今回でいうと、Component Discovery API です。これは、Component間の依存度を下げるためのレイヤーであり、Micro Frontendsでは、ほぼ必須の要素なのではないかと思います。

# 最後に
Micro Frontendsは、統合パターンも大切ですが、もっと大切なのは、ドメインをどう分解するかだと思います。この分割が適切ではないとどうしても共通化しなければならないケースが誕生し、Micro Frontendsのメリットが活かせないと思います。そろそろ、プロダクションレベルで検証したいと思いますが、中々重い腰を上げらない今日このごろです。
