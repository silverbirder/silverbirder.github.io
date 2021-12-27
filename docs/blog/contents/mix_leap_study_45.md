---
title: 【増枠】Mix Leap Study #45 - Google I/O、WWDCまとめて報告会！ 2019年6月15日参加レポート
published: true
date: 2019-06-27
description: 今回は、ヤフー株式会社主催の下記セミナーに参加してきました。Google/Appleどちらも大好きで、けど海外カンファレンスにいけなかった私にとって、今回の報告会は<b>新鮮な内容</b>ばかりでした。その内容を記事に書こうと思います。
tags: ["Report", "Mix Leap Study", "Google I/O", "WWDC", "Osaka"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614430881/silver-birder.github.io/blog/Google_I_O_WWDC_1.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614430881/silver-birder.github.io/blog/Google_I_O_WWDC_1.png
---

今回は、ヤフー株式会社主催の下記セミナーに参加してきました。
Google/Appleどちらも大好きで、けど海外カンファレンスにいけなかった私にとって、今回の報告会は<b>新鮮な内容</b>ばかりでした。
その内容を記事に書こうと思います。

<iframely-embed card="small" url="https://yahoo-osaka.connpass.com/event/132601/"></iframely-embed>

![Google I/O WWDC まとめて報告会 看板](https://res.cloudinary.com/silverbirder/image/upload/v1614430881/silver-birder.github.io/blog/Google_I_O_WWDC_1.png)
![YAHOO!Japan](https://res.cloudinary.com/silverbirder/image/upload/v1614430948/silver-birder.github.io/blog/Yahoo_japan.png)
![けんさくとえんじん](https://res.cloudinary.com/silverbirder/image/upload/v1614430980/silver-birder.github.io/blog/kensaku_to_enjin.png)

hashtagはこちら [#mixleap](https://twitter.com/hashtag/mixleap)

<!--  TODO: TOC -->

# Google I/Oとは？
Googleが主催する、開発者向けイベントです。
Google I/Oでは、WEBやGoogleが出しているガジェットなど様々な技術情報についてセッションが行われています。

<iframely-embed card="small" url="https://events.google.com/io/"></iframely-embed>

※ [https://yahoo-osaka.connpass.com/event/132601/](https://yahoo-osaka.connpass.com/event/132601/)

# WWDC（Worldwide Developers Conference）とは？
Appleが毎年開発している、開発者向けイベントです。
WWDCでは、appleの新製品の紹介や新しい技術についての発表が行われています。  

[https://developer.apple.com/wwdc19/](https://developer.apple.com/wwdc19/)

※ [https://yahoo-osaka.connpass.com/event/132601/](https://yahoo-osaka.connpass.com/event/132601/)

ヤフーでは、google I/OとWWDCの両方に約30名の社員が参加したそうです。
すごい数ですね。

# Google I/Oの概要とMLKitのアップデート 加藤 貴晴さん
## Google I/Oの概要
Google I/Oが始まったのは2008年からで、毎年開催しているそうです。
今年は2019年なので、11回目になります。

今回は全部で164セッションありました。
その内のTOP3が下記のとおりでした。

* Android 64
* Web 39
* ML/AI 32

Web好きの私としてはTOP2というのが悔しいですね。(笑)
ML/ALが3番目とは驚きです。

### Deplex on the web
<iframely-embed card="small" url="https://www.gizmodo.jp/2019/05/190305.html"></iframely-embed>

ウェブベースでも使えるGoogleAssistantのことで、レンタカーや映画の予約ができるみたいです。
これのすごいところは、レンタカーを予約するまでのステップを<b>全て自動入力</b>してくれるみたいです。
そこまで便利になったのかと驚きました。
ちなみに、日本にはまだ対応していません。

### WebAuthn
パスワードレスな生体認証のことを指すそうです。
こちらについてのセッションが下記のようです。
<iframely-embed card="small" url="https://developers.google.com/web/updates/2018/05/webauthn"></iframely-embed>

ひとまず知ることができてよかったです。

## ML
ML Kitの発表があったそうです。
<iframely-embed card="small" url="https://developers.google.com/ml-kit/"></iframely-embed>

その中でも、翻訳APIについて報告会では熱く話されていました。

### ML On-Device Translate API

デバイス上で翻訳することができるようになります。
そのため、外部とのやり取りができない環境でも翻訳できます。  
つまり、オフラインでも動作します。  

また、59言語に対応しているというすごい数です。

[https://firebase.google.com/docs/ml-kit/translation-language-support](https://firebase.google.com/docs/ml-kit/translation-language-support)

一部無料で使えるとのことで、こういうスタンスは本当に大好きです。
<iframely-embed card="small" url="https://firebase.google.com/docs/ml-kit/android/translate-text"></iframely-embed>

※ 翻訳する際は中間に英語を挟むような作りになっているみたいです。

### AutoML Vision Edge
こちらもEdgeというデバイス、つまりはAndroid端末上で動作するカスタム機械学習モデルを作成できるサービスです。  
ここで注目したいのは、またしてもデバイス上(On-Device)で動作する点です。  
Googleではこのデバイス上で完結する方針を、これからも進めていくのでしょうか。

On-Deviceだと、どうしてもデータをデバイス上に保存する必要があります。
そのため、保存すべきデータをいかに軽量にするかという問題があります。
オフライン環境でも動作できるようになれば、災害時や緊急事態には役立ちますよね。
Web好きなら知っていると思いますが、PWAという技術があります。
こちらにもOfflineModeという機能があり、こういったOn-Deviceの先駆けとなっていたのでしょうか。

# Googleアシスタントの他プラットフォームへの拡張方法の紹介 一円 真治さん

いろいろとお話されていたのですが、下記の内容が一番衝撃でした。
<iframely-embed card="small" url="https://japanese.engadget.com/2019/05/08/google-web-duplex/"></iframely-embed>

> Googleはまったくあたらしい音声認識と言語理解モデルを開発し、100GB必要だった学習モデルを0.5GB以下まで削減したとしています。これにより、学習モデルをスマートフォン内部に格納できるようになり、AI機能の動作にネットワーク接続不要に。この結果、ほぼ遅延なくデバイス上で音声認識が行えるようになるとのことです。

またしてもデバイス上ですが、GoogleAssistantを動かすのにモデル作成が必要みたいです。
それにかかる容量が100GBも必要だったものを0.5GBまで削減したという衝撃的な発表があります。
また、AI機能の動作にネットワーク接続が不要とのことなので、必要なデータをダウンロードできていれば、オフライン環境でも動作できます。

# What’s WWDC? / Swift UI ’n Siri Recap 田中 達也さん
## SwiftUIについて
WWDCで発表されたSwiftUIは、WWDCを参加していた人みんながめちゃくちゃ盛り上がったそうです。
Swiftであんまり開発したことがないので、ほぼ想像で話しますが、
従来のSwiftによる開発は、ソースコードをビルドして、端末にビルド後のデータを移動させて動作確認する必要がありました。
そこを、SwiftUIはわざわざ端末にデータ移動せず、xcode上でpreviewできるという開発者にとって、とてもハッピーな機能がついたようです。

## SwiftUIってどうやって使うの？
<iframely-embed url="https://twitter.com/silver_birder/status/1143475061673717760?s=20"></iframely-embed>

この件について登壇者さんに質問してみました。そのとおりとのことです。
swiftUIを手軽に動かしたい場合は、playgroundでも試せるそうなので、近い内にやってみようかなと思います。

<iframely-embed card="small" url="https://qiita.com/shtnkgm/items/387132cd9633a59e7390"></iframely-embed>

## ショートカットアプリ
標準でiphoneにインストールされるようになったアプリで、正直あんまり使った覚えはありません。
他アプリとの連携が用意になったらしいので、アプリ開発の幅が広がりますね。
（すみません、SwiftUIのことばかり考えていました（笑））

# AR・ML・その他Appleプラットフォームのアップデート 林 和弘さん
内容的には動画があったほうがわかりやすいのですが、
都合上見せれないものばかりだったため、なんだかモヤっとした内容でした。（笑）

## ARについて
ARKit→ARKit2→ARKit3の順で進化してきたのですが、動画がなく、ふ〜んってなってしまいました...。

## Authentication
「sign in with apple」という内容に私は惹かれました。
AppleのIDで認証ができるようになります。
特に、JSライブラリや、REST APIの提供もあるそうです。

JSライブラリ
<iframely-embed card="small" url="https://developer.apple.com/documentation/signinwithapplejs"></iframely-embed>

REST API
<iframely-embed card="small" url="https://developer.apple.com/documentation/signinwithapplerestapi"></iframely-embed>

良いっすね〜！これで認証の種類が増えました！

# 最後に
Google I/OやWWDCには参加したいという気持ちがあるのですが、
やはり英語のちからがまだまだ自信がありません。
徐々に聞き取れるように勉強していきます。
<iframely-embed card="small" url="https://note.mu/silverbirder/m/mcad08e0f384b"></iframely-embed>

今回の報告会で何度も耳にした「デバイス上で動作、オフライン環境」は、
今後、Googleでは力を入れていきたいのかなと思いました。
いま私ができることは、無料で使えるML On-Device Translate APIを試すぐらいかなと思います。
あとは、今と同じで継続して技術情報に対して、アンテナを貼り続けるぐらいでしょうか。

ヤフーの社員さんたちは、こういった新技術に対してキャッチアップする姿勢が積極的で良いなと思います。
私も負けないように頑張りたいと思います。
