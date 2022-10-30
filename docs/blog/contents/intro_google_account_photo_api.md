---
title: Googleアカウント画像を返却するだけのAPIを作った
published: true
date: 2021-12-20
description: みなさん、ご自身のプロフィール画像ってどう管理していますか？例えば、zennのプロフィール画像って、更新していますか？ 私は、プロフィール画像の更新は面倒なので、放置することが多いです。(GravatarみたいなSaaSが使えたら良いのに...)
tags: ["Google", "API"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

みなさん、ご自身のプロフィール画像ってどう管理していますか？例えば、zennのプロフィール画像って、更新していますか？ 私は、プロフィール画像の更新は面倒なので、放置することが多いです。(GravatarみたいなSaaSが使えたら良いのに...)

最近、自身の[ポートフォリオページ](https://silverbirder.github.io/)刷新を検討しており、プロフィール画像をどうするか悩みました。ポートフォリオのベースドキュメントは、Markdownを採用しています。

プロフィール画像を固定で保持させず、API経由でプロフィール画像を設定できないかと思い、今回、**Googleアカウント画像を返却するだけのAPI、Google Account Photo API**を作成しました。

APIのソースコードは、[こちら(Github)](https://github.com/silverbirder/Google-Account-Photo-API)です。1時間程度で作ったので、正常パターンしか見ていません。(笑) ご了承ください。

# Googleアカウント画像ってどれ？

Googleのアカウント画像は、[www.google.com](https://www.google.com/) で表示されている右上の画像です。(ログインしている方のみ)

![Google Chrome Home Page](https://github.com/silverbirder/Google-Account-Photo-API/blob/main/assets/i_want_to_that_image.png?raw=true)

# APIの使い方

APIを呼び出すために、あなたのGoogleアカウントID というものを用意する必要があります。

## GoogleアカウントIDの調べ方

あなたのGoogleアカウントIDは、[Google People APIのExplorerを実行](https://developers.google.com/people/api/rest/v1/people/get?apix_params=%7B%22resourceName%22%3A%22people%2Fme%22%2C%22personFields%22%3A%22photos%22%7D) するだけで分かります。

実行すると、`resourceName(ex. people/<account_id>)` というフィールドが返却されるので、そこに書いてあるaccount_idが、あなたのモノになります。

## APIを呼び出す

APIは、次のURLにGET呼び出しします。<your_account_id>は、さきほど手に入れたaccount_idになります。

```
https://google-account-photo.vercel.app/api/?account_id=<your_account_id>
```

呼び出すと、画像を返却されます。私の場合は、次の画像が返却されます。

![my google account image](https://google-account-photo.vercel.app/api/?account_id=101722346324226588907)

## Markdownで活用する

このAPIを活用すれば、次のようなMarkdownを書くだけでプロフィール画像を表示することができます！

```
![google account image](https://google-account-photo.vercel.app/api/?account_id=<your_account_id>)
```

これだけだと、ちょっと味気ないので、Cloudinaryを使います。Cloudinaryは、URLのパラメータを設定するだけで、画像を加工できます。例えば、画像を円にする場合は、次のURLを書きます。

```
![circle google account image](https://res.cloudinary.com/demo/image/fetch/r_max/https%3A%2F%2Fgoogle-account-photo.vercel.app%2Fapi%2F%3Faccount_id%3D<your_account_id>)
```

Cloudinaryについての説明は、割愛します。

私の場合は、次のような画像が表示されます。

![my_google_account_image_circle](https://res.cloudinary.com/demo/image/fetch/r_max/https%3A%2F%2Fgoogle-account-photo.vercel.app%2Fapi%2F%3Faccount_id%3D101722346324226588907)

Cloudinaryについて、詳しくは次のURLを確認ください。

* [Deliver remote media files | Cloudinary](https://cloudinary.com/documentation/fetch_remote_images)
* [Image transformations | Cloudinary](https://cloudinary.com/documentation/image_transformations)

# 終わりに

サクッとAPIを構築できちゃうのって、便利な世の中だな〜と思いました。