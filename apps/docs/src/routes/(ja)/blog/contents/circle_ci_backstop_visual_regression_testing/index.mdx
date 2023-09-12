---
title: CircleCI + BackstopJS (Puppeteer) でビジュアルリグレッションテストを継続的に監視する
published: true
date: 2019-11-15
description: CircleCIとBackstopJSを組み合わせて、『継続的にWebページの視覚的な変化を監視するツール』を作成しました。
tags:
  [
    "CircleCI",
    "BackstopJS",
    "Puppeteer",
    "Visual Regression Testing",
    "Monitoring",
  ]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1573651959/backstopjs/backstopjs.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1573651959/backstopjs/backstopjs.png
---

CircleCI と BackstopJS を組み合わせて、『継続的に Web ページの視覚的な変化を監視するツール』を作成しました。

https://github.com/silverbirder/silver-enigma

# Motivation

Web アプリを運用する上で、システム改善は継続的に行われます。
そのシステム改善をリリースする前に、入念なテスト（ユニットテスト、インテグレーションテスト、E2E テスト）をパスする必要があります。しかし、Web アプリの規模が大きくなるにつれて、**意図せずデグレ**が発生してしまう可能性が大きくなります。
そのデグレを気づくのが『社内部指摘』なのか『エンドユーザからのお問い合わせ』からなのか分かりません。
そこで、**Web アプリを定期的に監視すること**で、予想外なデグレッションを早期に発見できる仕組みが欲しくなりました。

必要とする要件は、次のとおりです。

- スケジューリング実行可能
  - 無料で使えること
- わかりやすい視覚的変化のレポート
- カスタマイズしやすい監視方法

ここから、CircleCI + BackstopJS(Puppeteer)という組み合わせが生まれました。

# Usage

次の手順で構築できます。

```shell
~ $ node -v
v12.9.1
```

1. backstop.json に監視したい URL を設定
2. CircleCI に必要な環境変数を設定([README.md](https://github.com/silverbirder/silver-enigma/blob/master/README.md)参照)
3. CircleCI で Job を実行し、Artifacts にあるレポートを閲覧

Puppeteer を使って Web アプリへリクエストしています。
そのため、『Javascript を無効にする』や『Cookie を設定する』といったニーズに対応できます。

# Conclusion

このツールにより、外部から Web アプリの変化を早期に発見できるようになりました。
ただし、リクエストするスケジューリング間隔には十分にお気をつけください。
リクエストをしすぎると、対象 Web アプリの負荷が高まってしまいます。
