---
title: "Control EA"
date: 2019-03-04T22:01:54+09:00
draft: false
summary: "EA(FX)を安全に運用するシステム"
---

## EAの制御システム - Control-EA
![output](https://res.cloudinary.com/silverbirder/image/upload/v1551705139/control-ea/control-ea.gif)

## 背景
FXでEAという自動売買プログラムがあるのだが、
外部から注文を停止・決済させたいときがあった。
https://www.fxstreet.jp/economic-calendar

要人発表時は、相場が大きく揺れてしまうので制御したかった。

## 機能
簡単に言うと下記

* Webアプリ上で、要人発表データを操作できる
* 要人発表データをEAがほぼリアルタイムに監視している
* ボラリティが高い相場時間帯は、注文しないようにする

## 技術スタック

vue.js + golang + dataStore + now.sh


## 関連リポジトリ
frontend vue.js
https://github.com/Silver-birder/control-ea

backend golang
https://github.com/Silver-birder/control-ea-api

batch node.js
https://github.com/Silver-birder/control-ea-batch
