---
title: Chrome拡張機能(Manifest V3)の開発で知ったこと
published: true
date: 2022-01-16
description: 
tags: ["Chrome Extension","Manifest V3"]
cover_image: https://raw.githubusercontent.com/Silver-birder/chrome-extension-tiktok-scraping-downloader/main/overview.png
---

皆さん、Chrome拡張機能をご存知ですか？
Chrome拡張機能は、Chromeブラウザをカスタマイズするための機能です。
Chrome拡張機能の概要について詳しく知りたい方は、[What are extensions? - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/overview/)をご覧ください。

私は、Chrome拡張機能を過去(数年前)に2つ作っていて、その当時は、Chrome拡張機能の仕様であるManifest V2に従っていました。
そして、今再び、Chrome拡張機能で作りたいものができたので、久々に作ろうと決意しました。
作ろうと思ったものの、どうやら今のChrome拡張機能の仕様はManifest V3を推奨しているようです。

そこで、Chrome拡張機能で知ったことをまとめようと思います。

※ 補足ですが、これから紹介する内容は、Manifest V3に限った話ではないのかもしれません。

## Chrome Extensions Components

Chrome拡張機能は、主に次の4つのコンポーネントが存在します。

* [Background Scripts](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
  * サービスワーカー上で動作し、ブラウザ上のイベント駆動(ページ遷移やブックマーク差所など)に反応します。
  * [manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/)の `background`フィールドで設定します。
* [Content Scripts](https://developer.chrome.com/docs/extensions/mv3/content_scripts/)
  * Webページのコンテキスト上で動作し、DOMへアクセスできます。
  * [manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/)の `content_scripts`フィールドで設定します。
* [UI Elements](https://developer.chrome.com/docs/extensions/mv3/user_interface/)
  * URLバーの右側にあるボタンを押した(Action)際に表示されるUIです。
  * ブラウザ体験を損なわさない最低限の機能だけの提供を推奨されています。
  * [manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/)の `action`フィールドで設定します。
* [Options Page](https://developer.chrome.com/docs/extensions/mv3/options/)
  * Chrome拡張機能アイコンを右クリックして、オプションを選択すると表示されるUIです。
  * Chrome拡張機能をカスタマイズしたい設定ページに使います。
  * [manifest](https://developer.chrome.com/docs/extensions/mv3/manifest/)の `options_page`フィールドで設定します。

私なりに、これらのコンポーネントの使い分けを考えると、次になります。

* DOMへアクセスする必要がある
  * Content Scripts を使う
* ページに依存しない処理がある
  * Background Scripts を使う
* 環境変数の設定が必要
  * Option Page

UI Elementsは、基本的に必要ないのかなと思いました。

## Debug

デバッグって、どうやるんでしょうか。

* [Debugging extensions - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/tut_debugging/)

こちらにやり方が書いてありました。
私なりに解釈した結果、次の2つの分岐を考えます。

* ①そもそも、Chrome拡張機能がロードできない場合

`chrome://extensions` へアクセスし、次の図にあるようなERRORボタンをクリックします。

![chrome extensions debug](https://res.cloudinary.com/silverbirder/image/upload/v1642325181/silver-birder.github.io/blog/chrome_extensions_debug.png)

なにかエラーが出ているはずです。

* ② ①以外の場合

どのコンポーネントでも、共通して、DevToolsを開きましょう。

* Content Scripts, UI Elements, Options Page
  * UI上で右クリックして `Inspect` をクリック
    * DevToolsが開きます。
* Background Scripts
  * `chrome://extensions` へアクセスし、`inspect views`の右にあるリンクをクリック。
    * DevToolsが開きます。

## Message passing

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

TODO

## Misc

https://developer.chrome.com/docs/extensions/mv3/manifest/

## 最後に

TODO