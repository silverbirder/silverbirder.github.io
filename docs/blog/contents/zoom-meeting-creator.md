---
title: ZoomのMeetingを自動生成するGASライブラリ zoom-meeting-creator を作った
published: true
date: 2020-06-06
description: みなさん、Zoom使っていますか？ ZoomのMeetingを自動生成するGASライブラリを公開しましたので、そのきっかけと使い方について紹介しようと思います。
tags: ["Tool", "Artifacts", "Introduce", "Learning", "Zoom", "Google Apps Script"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

みなさん、Zoom使っていますか？ 
ZoomのMeetingを自動生成するGASライブラリを公開しましたので、
そのきっかけと使い方について紹介しようと思います。

<!--  TODO: TOC -->

# きっかけ
社のSlackで次のqiitaの記事を知りました。

<ogp-me src="https://qiita.com/kudota/items/b480610cc3f575a8ec6f"></ogp-me>

GASからZoomのMeetingを作れるのって、簡単なんだな〜と思いつつ、
"cronのように使いたい"というSlackのコメントがあったので、サクッと一日で作ってみました。

定期的にZoomのMeeting(IDやパスワード)を更新する会社はあるはずです。
そういう会社にとっては、このツールは、便利かもしれません。

# 作ったもの

<ogp-me src="https://github.com/Silver-birder/zoom-meeting-creator"></ogp-me>

これをGAS側でライブラリ追加すると使えます。
このGASでは、

* ZoomのMeetingを作成
* Slackとの連携

ができます。この機能を、GASの定期実行を組み合わせれば、"ZoomのMeeting作成をcronのように"使えるようになります。