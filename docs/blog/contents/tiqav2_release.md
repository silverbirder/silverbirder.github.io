---
title: 1コマ漫画検索サービスTiqav2 (Algolia + Cloudinary + Google Cloud Vision API) 作ってみた
published: true
date: 2020-02-08
description: 画像で会話って楽しい 皆さん、チャットツールでコミュニケーションするとき、絵文字や画像って使ってますか？僕はよく使ってます。人とコミュニケーションするのに、文字だけだと堅苦しいイメージですよね。例えば、『OKです、それで先に進めて下さい。』というフレーズだけだと、相手がどのような感情なのか読み取りにくいです。
tags: ["Tool", "Artifacts", "Introduce", "Learning", "Algolia", "Cloudinary"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1580997144/LGTM/golia.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1580997144/LGTM/golia.png
---

<!--  TODO: TOC -->

# 画像で会話って楽しい
皆さん、チャットツールでコミュニケーションするとき、絵文字や画像って使ってますか？
僕はよく使ってます。人とコミュニケーションするのに、文字だけだと**堅苦しい**イメージですよね。
例えば、

『OKです、それで先に進めて下さい。』

というフレーズだけだと、相手がどのような感情なのか読み取りにくいです。

そこで、次のような画像でコミュニケーションを取ると、柔らかい印象を与えることができます。

![golia LGTM](https://res.cloudinary.com/silverbirder/image/upload/v1580997144/LGTM/golia.png)

# Tiqav2
## Tiqavとは？
画像を使って会話をするためのサービスとして、Tiqavがあります。

[http://dev.tiqav.com/](http://dev.tiqav.com/)

現在は、サービス終了しています。
Tiqav2は、そのTiqavを参考にして作りました。

## Tiqav2とは？
Tiqav2は、大きく分けて2つの機能があります。

1.  画像とテキストを保存
1.  画像を検索&表示

## 2つの機能
### 画像とテキストを保存

<figure title="Saving flow by Tiqav2">
<img alt="Saving flow by Tiqav2" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429484/silver-birder.github.io/blog/saving_flow_by_tiqav2.png">
<figcaption>Saving flow by Tiqav2</figcaption>
</figure>

検索する為には、全文検索サービスのAlgoliaを使います。

<iframely-embed url="https://www.algolia.com/"></iframely-embed>

Algoliaに保存する情報は、主に3つです。画像URLと拡張子、そしてテキストです。
画像は画像変換&管理サービスのCloudinaryに保存します。保存後、Cloudinaryより、画像URLと拡張子が手に入ります。

<iframely-embed url="https://cloudinary.com/"></iframely-embed>

テキストは、Google Cloud Vision APIへ画像を渡すことでテキストを抽出します。
もちろん、手動でテキストを設定することもできます。

<iframely-embed url="https://cloud.google.com/vision/"></iframely-embed>

### 画像を検索&表示

<figure title="Searching Flow  By Tiqav2">
<img alt="Searching Flow  By Tiqav2" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429523/silver-birder.github.io/blog/searching_flow_by_tiqav2.png">
<figcaption>Searching Flow  By Tiqav2</figcaption>
</figure>

テキストで全文検索を行います。その結果のIDとExtensionを組み合わせることで、
画像を表示することができます。Extensionの種類は、Cloudinaryのサポートするもの全てになります。

```
"gif", "png", "jpg", "bmp", "ico", "pdf", "tiff", "eps", "jpc", "jp2", "psd", "webp", "zip", "svg", "mp4", "webm", "wdp", "hpx", "djvu", "ai", "flif", "bpg", "miff", "tga", "heic"
```

<iframely-embed url="https://cloudinary.com/documentation/image_transformations#supported_image_formats"></iframely-embed>

この画像を表示する機能を使うと、次のようにSlack上で画像を送信することができます。

<figure title="Send Tiqav2 URL on Slack">
<img alt="Send Tiqav2 URL on Slack" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429563/silver-birder.github.io/blog/send_tiqav2_URL_on_slack.png">
<figcaption>Send Tiqav2 URL on Slack</figcaption>
</figure>

詳しい機能は、次のリポジトリをご確認下さい。

<iframely-embed url="https://github.com/Silver-birder/tiqav2"></iframely-embed>

# SaaSは個人開発には最適
今回、全文検索であったり画像管理は、SaaSに全て任せました。テキスト抽出はなくてもよかったのですが、Google Cloud Vision APIが、そこそこ使えたため、そちらも使いました。

個人で開発する際、リソース（時間、お金、人）は組織に比べて**とても小さい**です。
SaaSは、１つのことを上手くやってくれるし、個人の利用範囲であれば無料なものが多いです。
ニッチなカスタマイズしたい要求がない限り、SaaSは大体の要望を叶えてくれます。
どんな種類のSaaSがあるか知りたい方は、↓のサイトを見てみて下さい。参考になるはずです。

<iframely-embed url="https://saasblocks.io/"></iframely-embed>

**SaaSに面倒なことは任せて、プロダクトコードに集中する**ことは、私にとって、とても大切にしています。
ちなみに今回のプロダクトコードは、CleanArchitecture + InversifyJSで作りました。

# 終わりに
Tiqav2は、OSSとして公開していますので、誰でも無料で構築できます。
ぜひ、使ってみて下さい。快適なコミュニケーションを目指しましょう！

