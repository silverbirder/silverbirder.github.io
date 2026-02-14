---
title: '自由フォーマットでこつこつ記録して可視化するアプリを作った'
publishedAt: '2024-05-25'
summary: '何でもこつこつ記録して可視化できるWebアプリ、こつこつを作りました！'
tags: ["成果物"]
index: false
---

## はじめに

何でも **こつこつ** 記録して可視化できるWebアプリ、[こつこつ](https://kotsu-kotsu.vercel.app)を作りました！

![kotsu-kotsu AreaChart](http://res.cloudinary.com/silverbirder/image/upload/v1716635435/wepuhxujcptqz2rixztk.png)

## なぜ作ったのか

家計簿や筋トレのような専門的な記録アプリはありますが、ニッチなものを記録したいと思いました。例えば、以下のようなものです。

- **薬を飲んだ日と錠剤名**

鼻炎薬をたまに飲むのですが、飲む頻度を抑えたいので、どれくらい飲んでいるのかを記録したかったのです。また、コーヒーの摂取量（ml）も同様の理由で記録したい時があります。

- **コンタクトレンズを交換した日**

コンタクトレンズは2週間用のものを使っていますが、週末に交換するようにしていたものの、1週間で捨てることもあったためです。もったいないので記録して改善したいと思いました。

- **夜中に起きた回数**

夜中に起きてしまうことがたびたび発生していました。
熟睡したいので、何が影響しているのか分析するために、起きたかどうか記録しようと思いました。

これらを記録するアプリがあればそれを使えば良いのですが、そんなものはないので今回作ってみました。

## こつこつの使い方

「こつこつ」の使い方はシンプルです。

1. 記録するフォーマットを自由に定義できる「ノートブック」を作成します。
1. 定義したフォーマットでデータを登録できる「ページ」を作成します。
1. ノートブックに登録されたページをもとに、グラフを表示します。

記録するフォーマットの項目名として、以下のパターンを選べます。

- 文字
- 数値
- はい・いいえ
- カテゴリ

以下は、ノートブックとページの例です。

![kotsu-kotsu Notebook](http://res.cloudinary.com/silverbirder/image/upload/v1716643172/vtodrr6bzzg3siw2zel0.png)

![kotsu-kotsu Page](http://res.cloudinary.com/silverbirder/image/upload/v1716643174/oqobq91izn1nin1wlruw.png)

## 可視化の例

初めてログインすると、サンプルのデータが登録されます。そのデータを使って、以下のようなグラフが表示されます。

![kotsu-kotsu AreaChart](http://res.cloudinary.com/silverbirder/image/upload/v1716635435/wepuhxujcptqz2rixztk.png)

![kotsu-kotsu BarChart](http://res.cloudinary.com/silverbirder/image/upload/v1716635437/mudp6eb8karjcsr4ghqf.png)

![kotsu-kotsu LineChart](http://res.cloudinary.com/silverbirder/image/upload/v1716635439/vptkdthlk9ky035xhwkf.png)

![kotsu-kotsu DonutChart & PieChart](http://res.cloudinary.com/silverbirder/image/upload/v1716635442/gvl19gniunq5hy29gxjn.png)

## 未実装の機能

以下の機能はまだ実装していません。何か要望があれば実装します。

- データのインポート/エクスポート
- 可視化グラフの共有機能

## 終わりに

私はこつこつと記録することが好きで、振り返って可視化するのも好きです。
このアプリはそんな私にピッタリです。興味のある方はぜひ試してみてください。
