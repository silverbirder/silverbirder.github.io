---
title: "Search Local Web"
date: 2019-03-04T22:03:28+09:00
draft: false
---

## ローカル検索 - Search-Local-Web
![output](https://res.cloudinary.com/silverbirder/image/upload/v1551706593/search-local-web/search-local-web.png)

## 背景
過去に検索した記事を思い出せず、苦労したことがある。
検索履歴をローカルに保存して全文検索できるようにしたい。

## 機能
簡単に言うと下記

* URLからHTMLを取得し、googleDriveにドキュメント保存できる
* 思い出しているキーワードから全文検索できる(googleDriveApi)
* LINKから、記事をアクセスできる

## 技術スタック

node.js(express) + googleDrive + GAE


## 関連リポジトリ
https://github.com/Silver-birder/search-local-web
