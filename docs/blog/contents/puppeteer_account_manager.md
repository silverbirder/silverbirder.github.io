---
title: アカウント画像一括更新ツールを作ったので、紹介と学びについて
published: true
date: 2020-06-04
description: GoogleやGithubなど、様々なサービスのプロフィール情報(画像, etc)を一括更新するツール、puppeteer-account-manager を開発しました。開発の目的や、開発から得た知見を紹介します。
tags: ["Tool", "Artifacts", "Introduce", "Learning"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614431535/silver-birder.github.io/blog/puppeteer-account-manager_overview.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614431535/silver-birder.github.io/blog/puppeteer-account-manager_overview.png
---

GoogleやGithubなど、様々なサービスのプロフィール情報(画像, etc)を一括更新するツール、puppeteer-account-manager を開発しました。
開発の目的や、開発から得た知見を紹介します。

リポジトリは、こちらです。

<iframely-embed url="https://github.com/Silver-birder/puppeteer-account-manager"></iframely-embed>

<!--  TODO: TOC -->
# なんで作ったの？

GithubやTwitter、Facebookなど、Webサービスにはプロフィール画像を登録することができます。
私の性格上、どのサービスでも、同じ画像で登録したいと考えています。

そのため、いい感じのプロフィール写真を手に入れたら、全サービスのプロフィール画像を再登録しないと気がすまなくなり、とても面倒です。
そこで、今回、その面倒さを解決したく、このツールを作りました。

# それ、Gravatarで良くない？

今回の面倒さは、GravatarというWebサービスで解決できるかもしれません。

<iframely-embed url="http://gravatar.com/"></iframely-embed>

このサービスは、グローバルなプロフィール画像を提供するサービスです。
API経由で、プロフィール画像を取得できます。

しかし、次の問題があったので、却下となりました。

* gravatarが提供するプロフィール画像サイズは80px × 80px
    * サービスによっては、小さすぎる
        * 画像サイズを拡大することができるが、画質がよくない
* gravatarが提供するプロフィール項目が固定
    * 画像だけではなく、プロフィール項目も一括登録したかった
        * サービスによっては、プロフィール項目がマッチしない

そこで、Contentful というAPIベースのCMSを使うことにしました。

<iframely-embed url="https://www.contentful.com/"></iframely-embed>

Contentfulでは、自由に項目を決めることができます。
独自に作った項目 (画像や紹介文)を、API経由で取得できるため、とても便利です。

# どうやって作ったの？

愚直なやり方です。
Puppeteerと呼ばれる Chromeブラウザを自動操作できるライブラリを使いました。
Chromeブラウザから、"各サービスへログインし、写真をアップロードする"処理を自動化しただけです。

<iframely-embed url="https://github.com/puppeteer/puppeteer"></iframely-embed>

# プロフィール画像を更新するAPIは、なかったの？

サービスによってはあります。例えば、Twitterには、次のようなプロフィール画像を更新するAPIがあります。

<iframely-embed url="https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/post-account-update_profile_image"></iframely-embed>

ただ、全てのサービスには、そのようなAPIはありません。
APIを使って更新するのが正しい姿ですが、全サービスの実装方法の足並みを揃えるために、
Puppeteer で自動操作することにしました。

# パスワードって大丈夫？

Puppeteerを動かすnodeアプリケーションと、Chromeブラウザを同一マシン内で動作するようにしました。
そのため、nodeアプリケーション実行中に、パスワードを傍受されることはありません。
また、パスワードの設定は環境変数から注入するようにしています。
Dockerコンテナで動作できるようにしているので、ローカルでも、コンテナサービスでも動かすことができます。

今後、パスワードの管理は、KeepassやLastpassのようなサービスと連携したいと思っています。

<iframely-embed url="https://github.com/keeweb/kdbxweb"></iframely-embed>

# どのサービスが対応している？

これは、私が楽になりたいために作ったため、使い方が、限定的になっています。

|  サービス名  |  認証手段  |
| ---- | ---- |
|  Hatena  |  Google認証  |
|  Qiita  |  Google認証  |
|  Medium  |  Google認証  |
|  Note  |  Twitter認証  |
|  devTo  |  Github認証  |
|  Twitter  |  通常認証  |
|  Github  |  通常認証  |
|  Google  |  通常認証  |
|  Facebook  |  通常認証  |
|  LinkedIn  |  通常認証  |

詳しくは、

[https://github.com/Silver-birder/puppeteer-account-manager/blob/master/src/index.ts](https://github.com/Silver-birder/puppeteer-account-manager/blob/master/src/index.ts) をご確認下さい。

# どんな学びがあった？

結構色々とハマりました。

## 極力 セレクタ指定したコードを書かない

Webサービスが返すHTMLは、いつもずっと変わらないことはありません。
あるidやclassのhtmlタグがずっと残り続けるとは限りません。

そこで、できる限り、セレクタを指定せずにブラウザ操作をするようにしました。
例えば、

* ボタンやリンクをクリックしてページ遷移するのではなく、目的のページへ最短で直接遷移する
    * [https://medium.com/me](https://medium.com/me) とか。
* submitボタンをクリックするのではなく、エンターキーを入力する

です。こうすることで、安定した自動化ができました。

## XPathが意外と使える

GoogleやMediumでは、idやclassがランダム値になっています。
そのため、単純なidやclassを指定して進めることができません。

そこで、『○○』のテキストが含まれているセレクタの指定することが、XPathでできます。
これは、助かりました。

## ログインが難しいものは、無理せず諦める

Amazonのログインは、2段階認証が発生します。
テキストメッセージや、音声電話によるログインが求められ、Puppeteer単体ではどうしようもありません。

この2段階認証の機能を解除することもできますが、セキュリティ上よろしくないので、ここは無理せず諦めることにしました。

## 並列処理をガンガン実行する

処理速度向上のため、全サービスを Promise.allで並列処理しました。それぞれが、シークレットウィンドウで開くことで、独立して処理するようにもしました。
しかし、たまにPuppeteerが落ちてしまうことがあります。原因は、実行しているマシンのスペック(Core数)にも影響しますが、サービス側からの影響も受けたりします。
そのため、落ちても大丈夫のようにエラーハンドリングし、リトライするようにしました。

また、失敗したらどういった画面なのか知りたいので、スクリーンショットを撮るようにもしました。

## Docker で実行可能に

Puppeteerに必要なモジュールをDockerに詰め込み、ログイン情報等を環境変数から外注することで、
環境非依存の実行環境ができました。そのため、Pub/SubとContainer Engine等を組み合わせれば、
ContentfulのWebfook経由で、アカウント情報を更新することができます。

# 終わりに
私の性格がもっと大雑把であれば、このツールを作らなかったのですが、どうしても気になって仕方がなく... (笑)
最後まで読んでいただき、ありがとうございました。
