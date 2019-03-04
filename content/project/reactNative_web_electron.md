---
title: "ReactNative_Web_Electron"
date: 2019-03-04T22:03:14+09:00
draft: false
---

## ReactNative_Web_Electron - One Logic


## 背景
WebApp,MobileApp,DesktopAppを共通の言語で開発したいなと考えていた。
View側はプラットフォーム毎に用意して、Logicは共通化したかった。
(仕組みは用意したものの、途中で諦めた)

## 機能
簡単に言うと下記

* src/native, src/webでプラットフォーム毎のViewを作成できる
* src/actionsでロジック部分を共通化する
* src/storeでデータを集約する

## 技術スタック
reactNative + react.js + electron　+ expo.io


## 関連リポジトリ
https://github.com/Silver-birder/rss_reader
