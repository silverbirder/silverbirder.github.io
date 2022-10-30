---
title: Algolia Community Party in 京都 - 2019年5月10日 参加レポート
published: true
date: 2019-05-11
description: Algolia Community Party in 京都 - 2019年5月10日。こちらに参加しましたので、ご報告までに記事を書こうと思います。
tags: ["Report", "Algolia", "Kyoto"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614431407/silver-birder.github.io/blog/Algolia_Community_Party_in_Kyoto_2019_5_10.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614431407/silver-birder.github.io/blog/Algolia_Community_Party_in_Kyoto_2019_5_10.png
---

<ogp-me src="https://algolia.connpass.com/event/128524/"></ogp-me>

こちらに参加しましたので、ご報告までに記事を書こうと思います。

<!--  TODO: TOC -->

# Algoliaって？
## 百聞は一見にしかず

まずは下記サイトで、色々検索してみて下さい！

* Algolia Community Sample
  * [https://community.algolia.com/instantsearch.js/v2/examples/e-commerce/](https://community.algolia.com/instantsearch.js/v2/examples/e-commerce/)
  * [https://community.algolia.com/instantsearch.js/v2/examples/tourism/](https://community.algolia.com/instantsearch.js/v2/examples/tourism/)
  * [https://community.algolia.com/instantsearch.js/v2/examples/media/](https://community.algolia.com/instantsearch.js/v2/examples/media/)
* 実際にProductとして使われているサイト
  * [https://www.bringmeister.de/](https://www.bringmeister.de/)
  * [https://8tracks.com/explore/all](https://8tracks.com/explore/all)


どれも**爆速**に結果が返ってきませんか !? 
これ、 実は**SaaS**で動いているんですよ ?

## 概要

<ogp-me src="https://www.algolia.com/"></ogp-me>

> Products to accelerate search and discovery experiences across any device and platform.

Algoliaは、全文検索を提供してくれるSaaSです。
全文検索を使う場合、一般的にはElastic SearchやSolrといったものをサーバに乗せて管理することが多いかと思います。
使い始めると、「カテゴリ選択、ファセット絞り込み、ハイライト」等の機能がほしくなり、独自開発することもあると思います。
Alogliaでは、そういった全文検索に関わる機能をSaaSとして提供してくれます。

使われているところでは、ブログサービスである[medium](https://medium.com/)や、オンライン決算処理である[Stripeのドキュメント](https://stripe.com/docs/api)がメジャーでしょうか。
エンジニア向けとしては、[Docker Hub](https://hub.docker.com/)にも使われています。また、Firebaseの公式でも使用事例として紹介されています。これは驚きですね。

<ogp-me src="https://firebase.google.com/docs/firestore/solutions/search?hl=ja"></ogp-me>

Algoliaの会社としては、フランスから2012年よりスタートしました。
ベンチャー企業であり、日本人のエンジニア募集もあるそうです。

SaaSコミュニティ用のイベントがあるそうで、こちらにAlgoliaさんも登壇されています。

<ogp-me src="https://www.saastr.com/"></ogp-me>

<ogp-me src="https://www.saastr.com/watch-the-saastr-masterclass-from-0-to-10m-in-arr-from-algolia-in-paris-video/"></ogp-me>

## どんな機能があるの？

お話をAlgoliaのSolution Architectである[@shinodogg](https://twitter.com/shinodogg)から説明があったものとして、下記のような機能があるそうです。

* 検索時の表記ゆれ
* タイプミス補助
* カテゴリ、ファセットによる絞り込み
* 検索キーワードのハイライト
* パーソナライゼーション
* A/B テスト
* GEO検索
* 画像検索
* 音声検索

他にも「安い」と検索すると設定次第で「500円以下の商品」を表示させるような
こともできるそうです。あとは、チャットボットにも使えるとのことです。

※ ただ、まだ日本語には対応していないみたいで、現在開発中とのこと。

## どうやって使うの？

<ogp-me src="https://github.com/algolia"></ogp-me>
OSSとしてライブラリを提供されています。
手っ取り早く使いたいときは、instantsearch.jsでしょうか。

<ogp-me src="https://community.algolia.com"></ogp-me>

こちらも参考になるかと思います。

## Algoliaは知っていたの？

知っていました。
Algoliaを知ったきっかけは、大学時代の友人(id:castaneai)からでした。
Algoliaは、全文検索システムを構築せずとも、お手軽に使えて、しかも高機能なSaaSということで、
個人開発をする私にとって興味を持ち始めました。

その後、下記の記事で書いた通りOSS Gateの対象にもさせてもらいました。

<ogp-me src="https://tech-blog.monotaro.com/entry/2018/10/17/115442"></ogp-me>

また、作りたいものリストに溜まっていたアプリを作る時間があったので、
最近では、下記のような書籍管理を作りました。検索はAlgoliaを使っています。

<ogp-me src="https://github.com/silverbirder/book-store-vue"></ogp-me>

# なぜ会場が、はてな株式会社なの？
はてなの社長であるid:chris4403さんが、[@shinodogg](https://twitter.com/shinodogg)と前職での知り合いだったからだそうです。

<ogp-me src="https://mackerel.io/ja/"></ogp-me>

はてなも、サーバー監視サービスであるmackerel（鯖）をSaaSとして提供しています。
このお二方が、前職を離れてからも、同様の事業に携わっているということに、不思議な縁だな〜と思いました。

会場では、ピザを提供して頂きました。美味しかったです！ごちそうさまでした！

<o-embed src="https://twitter.com/silver_birder/status/1126841269097865216?s=20" height="400px"></o-embed>

# 最後に
SaaSは、その専門の技術を持ってサービス提供をされています。
独自に開発するよりも、そういった専門のSaaSを駆使することで、
開発コストや運用コストの削減につながります。
そもそも、そういった専門技術を持っていない環境は、独自開発することとなり、
学習コストもかかりますし、非機能要件を考えないといけないので大変です。

「かけるべき部分に時間を割いて、それ以外はSaaSに移す」というのは今の時代の効率良い開発スタイルだなと思います。
