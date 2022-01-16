---
title: Chrome拡張機能を久々に作ったので、その感想
published: true
date: 2022-01-16
description: 
tags: ["Chrome Extension", "Feedback"]
cover_image: https://raw.githubusercontent.com/Silver-birder/chrome-extension-tiktok-scraping-downloader/main/overview.png
---

## 書きたいことメモ

* デバッグ方法
* background.js, contentscript.js (option, popup)
* manifestで使ったもの

Chrome拡張機能の開発で道場する人物ってなんだっけ？
ああ、background.jsというサービスワーカーで動くjsと、Webページ上で動作するcontentscript.jsね。
スタートするためのサンプルってどれだっけ？あ、あった。

デバッグってどうやるんだっけ？それぞれ違うのか？いや、DevToolsだね。
そもそも変な設定とかで動かない場合は、ERRORページを見るんだ。

よし、使い方が慣れてきたぞ。

どういうものを作ろうって？TikTokのスクレイパーだよ。詳しくはこっち。
当初は、簡単にオートスクロールしつつ、Videoタグを取ってblob手に入れて、POSTしようとしてた。
blobを取る箇所をbackground.jsにしちゃうと、CORSで困ることがあったので、content-script.jsじゃないとだめだね。
あと、contentscriptとbackgroundの通信手段って、何使えば良いんだ？あ、port messagingね。
↓
あれ、VideoだけだとVideoの情報がなにもないので、困るな。表示するときに。
よし、じゃあTikTokのページ分析して、情報ないか見てみよう。

あ、windowsオブジェクトに情報あるじゃん。あれ？content-scriptsからだとアクセスできないんだね。
web accesable resource というのが使えるみたい。これ、jsを作っておいて、それをbodyタグにappendしたら動かせる。
けど、これinjectなjsなので、port messaging無理だ。windowオブジェクトからpost messageすることで良いそうだ。
(ユーザーページでもforyouページでも構成は同じようだ)
↓
よし、windowのオブジェクトにあるTiktokの情報は手に入れられたけど、スクロールロードしたtiktokのデータって、どこにあるんだ？
どこにもそのデータが置いていなかった。これは、TiktokのAPIのレスポンスを傍受したいね。
むむ、requestをmonitoringするAPIがあるそうだ。chrome。お、動いた。
けど、urlはモニターできるんだけど、レスポンスのbodyは取れない。だから、URLを手に入れてcontentscriptで再リクエストして手に入れるしかないな。

host_permissionsというのがあるようだ。monitoringするときに、許可が必要っぽい。
https://twitter.com/silver_birder/status/1479628125323800577
chrome.webrequestね。
↓
よし、これでほしい情報は手に入った。
あれ、動かしてみると、port messageがたまに途切れるぞ。あ、sendResponseのところが間違っていたのね。
↓
うん、ちゃんと動くようになった。これを自宅にあるiMac(使っていない)に入れて動かし続けよう。
特に問題ないっぽい！
↓
POSTするサーバ名をハードコードしてるから、ちょっとよくないな。
環境変数の設定方法は、よくわからないけど、サンプルコードをみると、storageで管理してるっぽい。
Optionで設定できるようにした。よしよし。

※ 脱線
表示方法で、tiktok oembedへリクエストしたレスポンスにあるhtmlやwidthとかを使ってあげれば良い。
iframe srcdocでhtmlを埋め込めば良い。