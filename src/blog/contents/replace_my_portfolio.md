<!-- 
title: silverbirderのポートフォリオページ刷新
date: 2021-03-03T20:41:00+09:00
draft: true
description: 
image: 
icon: ⚡️
-->

この度、私のポートフォリオページを刷新致しました。本記事では、
刷新することになった動機から、刷新内容、今後について紹介したいと思います。

[:contents]

# 動機

元々、私のポートフォリオページは、静的ページジェネレーターであるHugoを使って
構築していました。

[http://kohki.hatenablog.jp/entry/hugo-portfolio:embed]

こちらの記事を参考にして、Hugoでポートフォリオページを作りました。
その当時、なぜポートフォリオを作ったのかというと、確か次の3つの思いがありました。

* 転職等で私がどういった人かを知ってもらうため
* 静的ページジェネレーターを使ってみたい
* 自分のページを持ちたい

が、Hugoを使い続けていると、メリットを享受しつつも、デメリットも感じていました。
それは、自身のWebサイトを柔軟に制御できない、チャレンジングなことができないという
思いがありました。

# やったこと

下記のコンテンツを用意しました。

* 自身の紹介ページ
* ブログ
* 持っている本
* 買ったものリスト
* ウォッチリスト

特に、AMPで全部作るようにしました。全体像は、下記のとおりです。

![overview](https://raw.githubusercontent.com/Silver-birder/Silver-birder.github.io/main/overview.png)

gulpを使って、AMP Optimizer でHTMLとMarkdownをAMP化しています。
ブログは、Markdownで管理しています。

# 学んだこと

TODO

# 終わりに

TODO
