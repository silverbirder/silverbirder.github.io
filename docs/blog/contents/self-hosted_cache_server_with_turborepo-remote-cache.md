---
title: turborepo-remote-cache でキャッシュサーバをセルフホストした
published: true
date: 2022-09-11
description: XXX
tags: ["Turborepo"]
---

turborepo という ビルドシステムが爆速なモノレポツールがあります。
爆速にする機能の 1 つに、remote cache というものがあります。
この機能はキャッシュサーバを使って高速化するのですが、キャッシュサーバをセルフホストする技があります。
今回は、それを紹介します。

## なぜ

純粋に費用が高いからです。
remote cache は、vercel のアカウントとリンクして使うのですが、
個人利用では無料ですが、会社で使うとすると、`$20 per user / month` という価格になります。

※ https://vercel.com/pricing

費用対効果に見合うならそれでも良いかもしれませんが、まだそれがわからない段階でコストをかけられない場面もあると思います。
そこで、公式にもかいてあるとおり、キャッシュサーバをセルフホストする方法があります。

https://turborepo.org/docs/core-concepts/remote-caching

## やってみた

https://github.com/Silver-birder/turborepo-with-selfhost-remote-cache

turborepo-remote-cache は、https://github.com/fox1t/turborepo-remote-cache にソースコードがあります。
コンテナも公開されています。 https://hub.docker.com/r/fox1t/turborepo-remote-cache

このコンテナをクラウドベンダーのコンピューティングにデプロイします。
キャッシュストレージは、いまのところ AWS S3 のみ対応とのことです。

https://zenn.dev/aiji42/articles/7bc1b6df91dd76 の記事に書いてあるとおり、S3Client は GCS にも疎通できるとのことなので、
GCS でも使おうと思ったら使えます。

が、まあ README に従うなら、S3 に配置するのがベターでしょう。

そのため、AWS で AppRunner と S3 を使えば、サクッと動きます。

コンテナの必要な環境変数は、github にも書いていますが、ここでも書いておきます。

必須なのは、`TURBO_TOKEN`と`STORAGE_PATH`です。
前者は、クライアントからキャッシュサーバへ疎通するためのトークンで、プライベートで管理する必要があります。
後者は、キャッシュオブジェクトのパスです。S3 の場合はバケット名です。

実際に動かしてみましょう。

クライアント側からは、TOKEN と API を指定します。また、TEAM というモノも渡します。これは、
キャッシュの名前空間のような役割になります。

## おわりに
