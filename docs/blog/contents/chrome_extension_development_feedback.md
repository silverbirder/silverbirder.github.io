---
title: Chrome拡張機能(Manifest V3)の開発で知ったこと
published: true
date: 2022-01-16
description: 皆さん、Chrome拡張機能をご存知ですか？Chrome拡張機能は、Chromeブラウザをカスタマイズするための機能です。Chrome拡張機能の概要について詳しく知りたい方は、What are extensions? - Chrome Developersをご覧ください。
tags: ["Chrome Extension","Manifest V3"]
cover_image: https://raw.githubusercontent.com/Silver-birder/chrome-extension-tiktok-scraping-downloader/main/overview.png
---

皆さん、Chrome拡張機能をご存知ですか？
Chrome拡張機能は、Chromeブラウザをカスタマイズするための機能です。
Chrome拡張機能の概要について詳しく知りたい方は、[What are extensions? - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/overview/)をご覧ください。

私は、Chrome拡張機能を過去(数年前)に2つ作っていて、その当時は、Chrome拡張機能の仕様であるManifest V2に従っていました。
そして、今再び、Chrome拡張機能で作りたいものができたので、久々に作ろうと決意しました。
作ろうと思ったものの、どうやら今のChrome拡張機能の仕様はManifest V3を推奨しているようです。

そこで、Chrome拡張機能で知ったことをまとめようと思います。これから紹介する内容は、Manifest V3を前提とします。

ちなみに、実際に作ったものは次のものです。

* https://github.com/Silver-birder/chrome-extensions-tiktok-scraping-downloader

## Chrome Extensions Components

Chrome拡張機能は、主に次の4つのコンポーネントが存在します。

* [Background Scripts](https://developer.chrome.com/docs/extensions/mv3/service_workers/)
  * サービスワーカー上で動作し、ブラウザ上のイベント駆動(ページ遷移やブックマーク差所など)で反応します。
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
私なりに解釈した結果、次の2つで使い分けるのかなと思います。

---

* ①そもそも、Chrome拡張機能がロードできない場合

manifest.jsonファイルに記述で誤りがあるなどで、Chrome拡張機能がロードできない場面があります。
そういうときは、次の手順を実行します。

1. `chrome://extensions` へアクセス
1. 次の図にあるようなERRORボタンをクリック

![chrome extensions debug](https://res.cloudinary.com/silverbirder/image/upload/v1642325181/silver-birder.github.io/blog/chrome_extensions_debug.png)

恐らく、何かしらエラーメッセージが出力されていると思います。
それを解決しましょう。

---

* ② ①以外の場合

Chrome拡張機能はロードできるが、期待通りに動作しない場面があると思います。
そういうときは、DevToolsを開きましょう。

* Background Scripts の場合
  * `chrome://extensions` へアクセスし、`inspect views`の右にあるリンクをクリック。(上図)
    * DevToolsが開きます。
* Content Scripts, UI Elements, Options Page の場合
  * UI上で右クリックして `Inspect` をクリック
    * DevToolsが開きます。

DevToolsには、consoleタブがあるはずです。そこのログメッセージを確認しましょう。

## Message Passing

各コンポーネント間で、通信するのは、どうしたら良いのでしょうか。
例えば、Content ScriptsからBackground Scriptsへデータを渡したいときなどです。
次の資料が、参考になります。

* [Message passing - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/messaging/)

資料を読むと、次のようなパターンの通信ができるようです。

* 各コンポーネント間の通信
  * Background Scripts ⇔ Content Scripts など
* Chrome拡張機能間の通信
  * A Chrome拡張機能 ⇔ B Chrome拡張機能
  * Chrome拡張機能のIDを使って通信します
* Webページからの通信(Sending messages from web pages)
  * Webページ ⇔ Chrome拡張機能のコンポーネント

通信の具体的なコードは、`chrome.runtime.sendMessage`メソッドを使います。
Background ScriptsからContent Scriptsへ通信する場合、どのChromeタブに送信するか`chrome.tabs.query`で事前にidを見つけておく必要があります。

また、後で紹介しますが、`Web Accessible Resources`でアクセス可能なJavascriptをWebページへInject(`document.querySelector('body').append()`)した場合、そのJavascriptとContent Scriptsの通信は、`window.postMessage`と`window.addEventListener`を使いましょう。
`chrome.runtime`が使えないので。

## Web Accessible Resources

Content ScriptsからWebページのDOMへアクセスできますが、windowオブジェクトにある変数へアクセスすることができません。

* ['javascript - Can the window object be modified from a Chrome extension? - Stack Overflow'](https://stackoverflow.com/questions/12395722/can-the-window-object-be-modified-from-a-chrome-extension)

windowオブジェクトへアクセスするには、Web Accessible Resourcesを使う方法があります。

* [Manifest - Web Accessible Resources - Chrome Developers](https://developer.chrome.com/docs/extensions/mv3/manifest/web_accessible_resources/)

---

具体的にコードで説明しましょう。

manifest.jsonで必要なフィールドの例は、次のとおりです。

```json
{
  "content_scripts": [
    {
      "js": [
        "content-script.js"
      ],
      "matches": [
        "https://*/*"
      ]
    }
  ],
  "web_accessible_resources": [
    {
      "resources": [
        "web_accessible_resources.js"
      ],
      "matches": [
        "https://*/*"
      ]
    }
  ]
}
```

Content ScriptsとWeb Accessible ResourcesのJavascriptは次のとおりです。

```javascript
// content-script.js
const injectScript = (filePath, tag) => {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', filePath);
    node.appendChild(script);
}
injectScript(chrome.runtime.getURL('web_accessible_resources.js'), 'body');
```

```javascript
// web_accessible_resources.js
console.log(window['hoge']);
// Content Scriptsへ通信する場合は、window.postMessageを使います。
```

このように、web_accessible_resources.jsをWebページのbodyタグへappendします。
そのweb_accessible_resources.jsでは、windowオブジェクトにアクセスすることができます。

## chrome.webRequest API

Chromeブラウザでネットワークトラフィックを監視するChrome拡張機能のAPIがあります。
それが、`chrome.webRequest`です。

* [chrome.webRequest - Chrome Developers](https://developer.chrome.com/docs/extensions/reference/webRequest/)

これがあれば、Webページでどういうリクエストが発生しているか分かるようになります。
manifest.jsonのフィールドで、`host_permissions`の設定が必要です。

---

サンプルで、Background Scriptsのコードを紹介します。
まず、manifest.jsonの必要なフィールドを書きます。

```json
{
  "host_permissions": [
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  }
}
```

次に、Webページからリクエストが完了(onCompleted)したイベントを監視するコードを書きます。

```javascript
// background.js
chrome.webRequest.onCompleted.addListener(
  async (details) => {
    console.log(`request url is ${details.url}`);
  },
  {
      urls: [
          "https://*/*"
      ]
  },
  ["responseHeaders"] // responseHeadersをdetailsオブジェクトに含めることができます。
);
```

このdetailsにはリクエストのURLが含まれています。さらに詳しく知りたい人は、[こちら](https://developer.chrome.com/docs/extensions/reference/webRequest/#event-onCompleted)をご確認ください。

## 最後に

Chrome拡張機能、久々に開発してみると、進化しすぎていてキャッチアップに苦労しました。
私と同じような方の助けになれば、幸いです。