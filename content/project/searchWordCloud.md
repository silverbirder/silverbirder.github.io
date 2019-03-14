---
title: "Search Word Cloud"
date: 2019-03-14T22:03:13+09:00
draft: false
summary: "検索キーワードをリアルタイムWordCloud化"
---

## 検索キーワードをWorCloud化 - SearchWordCloud

![output](https://res.cloudinary.com/silverbirder/image/upload/v1552224172/word-cloud-chrome-extension/word-cloud-chrome-extension.gif)

拡張機能のダウンロードは[こちら](https://chrome.google.com/webstore/detail/searchwordcloud/dbpmolojnmdfgggfnhlioepakmpjafal/related?hl=ja&gl=JP)

## 背景
googleのマイアクティビティから検索履歴をwordCloud化した
ツールを作ってみたのだが、それをリアルタイムでも見れるにしたいと考えた。

## 機能
簡単に言うと下記

* chrome拡張機能で、検索するたびにwordCloudが更新される
* データはgoogleアカウントに紐づくので、端末が異なっていても共有できる
* データをクリアできるオプションを用意している


## 技術スタック

node.js
