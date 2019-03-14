---
title: "Text_lint"
date: 2019-03-04T22:03:41+09:00
draft: false
summary: "文章の表記ゆれチェック"
---

## 文章向けLinter - text_lint
```
$ npm install
$ echo "I love docker" >> sample.md
$ npm run lint sample.md -s
text_lint/sample.md
  1:8  ✓ error  docker => Docker  prh

✖ 1 problem (1 error, 0 warnings)
✓ 1 fixable problem.
Try to run: $ textlint --fix [file]
```

## 背景
文章を書いていて、表記ゆれが多々あった。
それをなんとか防ぎたかった。

## 機能
簡単に言うと下記

* 有名なIT向け辞書を登録済みなので、誤りを検知してくれる。
* git hookと合わせれば、commit時に検知できる。
* 辞書をカスタマイズできるので、自分にあった検知が作れる。

## 技術スタック

node.js


## 関連リポジトリ
https://github.com/Silver-birder/text_lint
