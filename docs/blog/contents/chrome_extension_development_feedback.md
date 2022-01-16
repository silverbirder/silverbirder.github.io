---
title: Manifest V3でChrome拡張機能をはじめて作った体験記
published: true
date: 2022-01-16
description: 
tags: ["Chrome Extension","Manifest V3", "Feedback"]
cover_image: https://raw.githubusercontent.com/Silver-birder/chrome-extension-tiktok-scraping-downloader/main/overview.png
---

皆さん、Chrome拡張機能をご存知ですか？
Chrome拡張機能は、Chromeブラウザをカスタマイズするための機能です。
Chrome拡張機能の概要について詳しく知りたい方は、[What are extensions? - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/overview/)をご覧ください。

私は、Chrome拡張機能を過去(数年前)に2つ作っていて、その当時は、Chrome拡張機能の仕様であるManifest V2に従っていました。
そして、今再び、Chrome拡張機能で作りたいものができたので、久々に作ろうと決意しました。
作ろうと思ったものの、どうやら今のChrome拡張機能の仕様はManifest V3を推奨しているようです。

そこで、Chrome拡張機能で知ったことを書こうと思います。

※ 補足ですが、これから紹介する内容は、Manifest V3に限った話ではありません。

## background scriptsとcontent scripts

Chrome拡張機能は、主に次の2つのコンポーネントが存在します。

* background scripts
* content scripts

background scriptsは、service worker上で動きます。そのため、DOM要素へのアクセスはできません。
DOM要素へアクセスしたい場合は、content scriptsからアクセスする必要があります。
[content scriptsは、Webページのコンテキスト上で動作します](https://developer.chrome.com/docs/extensions/mv3/content_scripts/#:~:text=Content%20scripts%20are%20files%20that%20run%20in%20the%20context%20of%20web%20pages.)。
この2つは、できることが違うので使い分ける必要があります。

![architecture-overview](https://wd.imgix.net/image/BrQidfK9jaQyIHwdw91aVpkPiib2/CNDAVsTnJeSskIXVnSQV.png?auto=format&w=776)

`気づいたこと`

* DOM要素にアクセスしたい場合
  * content scriptsを使う
* DOM要素にアクセスしない場合
  * background scriptsを使う
    * service worker上で動きます

## Debug

[Getting started - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/getstarted/)で、サンプルコードが載ってあるので、色々動かして試そうと思いました。そこで、思ったんです。『デバッグってどうやるんだっけ？』です。
次の記事が参考になりました。

* [Debugging extensions - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/)

原則、**DevToolsでデバッグ**しましょう。

* background scripts
  * `chrome://extensions` にアクセス
  * inspect viewsの右にあるリンクをクリック
    * DevToolsが開く
* content scripts
  * content scriptsの対象ページを開く
  * DevToolsを開く
    * [Open Chrome DevTools - Chrome Developers](https://developer.chrome.com/docs/devtools/open/)
  * popup.jsのdebugも、popupウィンドウ上でDevToolsを開きましょう

その他のデバッグとして、manifest.jsonに誤りがあるなどでChrome拡張機能がLoadできない場合は、次の画像にある`ERROR`ボタンをクリックしましょう。

![chrome extensions debug](https://res.cloudinary.com/silverbirder/image/upload/v1642325181/silver-birder.github.io/blog/chrome_extensions_debug.png)

恐らく、エラーメッセージが出力されているはずなので、それを解決しましょう。

## Message passing

デバッグのやり方が分かりました。
Chrome拡張機能で作ろうとしている内容の内、次の機能が必要になりました。

* content scriptsとbackground scriptsの通信

それには、[Message passing - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/messaging/)を読むと良いです。

* content scripts から background scripts 
* background scripts から content scripts

これらは、`chrome.runtime.sendMessage`で通信できます。
また、後で紹介しますが`Web Accessible Resources`でinjectしたjavascriptとcontent scriptsの通信は、chrome.runtime.sendMessageが使えません。`window.postMessage`と`window.addEventListener`で通信しましょう。

## Web Accessible Resources

content scriptsからwindowオブジェクトにある変数を参照したい場面がありました。
ただ、それはできません。

> An isolated world is a private execution environment that isn't accessible to the page or other extensions. 

* https://stackoverflow.com/questions/12395722/can-the-window-object-be-modified-from-a-chrome-extension

* [Manifest - Web Accessible Resources - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/manifest/web_accessible_resources/)

そこで、Web Accesible ResourcesとしてChrome拡張機能から参照できるjsを作成しておき、それをBodyへAppendして動かします。
そこであれば、windowオブジェクトへアクセスできます。

## chrome.webrequest API

WebページがAPIコールしている通信を監視した場面がありました。
そこで、chrome.webrequestです。

## Option Set

## Misc

https://developer.chrome.com/docs/extensions/mv3/manifest/

## 最後に


## 書きたいことメモ

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