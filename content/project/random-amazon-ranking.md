---
title: "Random Amazon Ranking"
date: 2019-03-31T13:32:59+09:00
draft: false
summary: "アマゾンの売れ筋ランキングをランダムに表示するアプリ"
---

## Random Amazon Ranking
![output](https://res.cloudinary.com/silverbirder/image/upload/v1554006293/randomAmazonRanking/randomAmazonRanking.gif)

## 背景
[アマゾン売れ筋ランキング](https://www.amazon.co.jp/ranking?type=top-sellers)を適当に眺めていたら、
全く知らなかった興味深い商品を発見できた。
他にも同様の商品がないのか知りたくなり、このアプリを作った。


## 機能
簡単に言うと下記

* アマゾン売れ筋ランキングTOP3の商品のみを表示する
* アマゾンに存在する全カテゴリをランダムに3カテゴリ抽出する
* 商品データは逐次取得しているため、リアルタイムな商品が見れる


## 技術スタック

vue.js + node.js + now.sh


## 関連リポジトリ
frontend vue.js  
https://github.com/Silver-birder/amazon-ranking-vue

backend node.js  
https://github.com/Silver-birder/amazon-ranking-api
