---
title: 'Million Lintを試してみた'
publishedAt: '2024-03-21'
summary: 'Million.devを知り、少し試してみました。Million.jsについて このライブラリは、React DevToolsのProfilerより簡単にプロファイリングできるみたいです。 パフォーマンスのプロファイリングは通常、面倒で時間のかかる作業です。もしもこれを簡単に実行できるのであれば、めちゃくちゃ捗るなとわくわくしました。'
tags: ["テスト", "開発ツール"]
---

[Million.dev](https://million.dev/) を知り、少し試してみました。

## Million.jsについて

このライブラリは、React DevToolsのProfilerより簡単にプロファイリングできるみたいです。
パフォーマンスのプロファイリングは通常、面倒で時間のかかる作業です。もしもこれを簡単に実行できるのであれば、めちゃくちゃ捗るなとわくわくしました。

一応、公式からも、Million.jsについて引用しておきます。

> Million Lint is a VSCode extension that keeps your React website fast.
We identify slow code and provide suggestions to fix it. It’s like ESLint, but for performance!

※ https://million.dev/blog/lint

VSCodeの拡張機能を使うそうです。

## 実際にやってみた

Million Lintを試す過程は非常にシンプルでした。次のコマンドを実行するだけで自動的にインストールされます。

```bash
npx @million/lint@latest
```

インストール後、アプリケーションを起動し、いくつかの操作を行うと、描画回数や描画時間などの情報がVSCode常に表示されました。
また、有料オプションとして、Lintによる問題解決の提案も受けることができます。
例えば、「Callback関数を使用してください」や「Debounceを行ってください」といったアドバイスがありました。
しかし、無料で利用できるのは3回程度と限られているようでした。

![Million Lint in VSCode](http://res.cloudinary.com/silverbirder/image/upload/v1711022284/jtukcrtmxeo4fxgl9pd8.png)

## 所感

**現時点では、パフォーマンス調査には、まだ React DevToolsを使用する** のかなと思います。
Million Lintの分析機能は有料であり、また、提案の出力が安定していない（時には提案が表示されず、時にはされる）点が気になりました。
また、親コンポーネントの描画やパフォーマンスデータを確認できましたが、子コンポーネントには、それらの情報が表示されませんでした。

しかし、 **VSCode上で描画や処理時間を把握できることは、パフォーマンス問題に直面する前に気づく機会を与えてくれるかもしれないと感じました。**
Million Lintの提案は有料ですが、描画や時間に関する情報が表示される点は利用価値があると思います。

## 終わりに

Reactで開発する際、パフォーマンス問題に直面することが多いですが、Million Lintはその解決に向けた一助となる可能性を秘めています。
ただし、その全機能を活用するには課金が必要であり、無料版の利用には限界があることを認識しておく必要があります。
