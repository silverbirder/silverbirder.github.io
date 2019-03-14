---
title: "Google Word Cloud"
date: 2019-03-04T22:01:42+09:00
draft: false
summary: "google検索履歴をWordCloud化"
---

## Google検索履歴をWordCloud化 - Google Word Cloud
![output](https://res.cloudinary.com/silverbirder/image/upload/v1551595196/google-word-cloud/%E3%83%9E%E3%82%A4%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%92%E3%82%99%E3%83%86%E3%82%A3.json.201901.json.txt.png)
上記は、2019年1月のGoogle検索履歴。
golangとvueにハマっていた。

## 背景
下記のページより、Googleで検索したデータをダウンロードできることを知った。
https://takeout.google.com

そこで、WordCloudに流したら面白そうではないかと思った。

## 機能
簡単に言うと下記

* Google検索のような検索結果のjsonファイルを月毎に分割できる
* 検索結果のjsonファイルから単語を抽出できる
* 抽出した結果をWordCloudで出力した画像を取得できる

Google検索だけでなく下記も出力できる（他も可能かもしれないが私自身にデータがなかった)  

* Gmail
* GoogleApps
* YouTube
* Drive
* Map
* 画像検索
* 動画検索

## 技術スタック
python


## 関連リポジトリ
python
https://github.com/Silver-birder/google-word-cloud
