---
title: "Notify Google Home"
date: 2019-04-04T00:07:40+09:00
draft: false
summary: "簡単にGoogle-Homeから発話させる"
---

## Notify Google Home
Google Homeに任意のメッセージを通知することができる。

## 背景
Google Homeにメッセージを送ることはあるけど、
逆はないなと思い、発話できるのか調べてみた。
すると、google-home-notifierなるものを発見した。
ただ、色々と環境構築が複雑なため、dockerに押し込めることにした。

## 機能
簡単に言うと下記

* Google HomeのIPアドレスとメッセージを指定して`docker run`するだけで、発話させることができる。


## 技術スタック

node.js


## 関連リポジトリ
https://github.com/Silver-birder/notify-message-by-google-home

https://hub.docker.com/r/silverbirder/simple-google-home-notifier
