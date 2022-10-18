---
title: ObsidianでGit連携してスマホからCommitする
published: true
date: 2022-10-18
description: XX
tags: ["Obsidian"]
---

## 書こうと思っていること

メモアプリが、好き。
- WikiWikiWeb という考え方をベースとしたメモアプリ
	- scrapboxのような 小さなページをリンクでつなげる
- markdown対応
	- ふだん、これに慣れている (markdown中毒者)
	- ソフトウェアエンジニアリングの世界でmarkdownは広く一般的
- import/export 機能
	- アプリにどっぷり依存しないように
- マルチデバイス対応
	- iPhoneでおもいついたことを書く
	- デスクトップでちゃんと書く。
 
純正メモアプリのような、めちゃくちゃ早いのも、とても魅力的。だけど、上記の機能がほしい。

Obsidian v1.0 リリースを機に、もう一度使ってみた。
データは、MacとiPhone使いのワタシにとっては、iCloudで共有するのが良いかも。実際、それで試してみたけど、バージョニングしたくなってきた。

で、obsidianのpluginを見ると、Obsidian Git というものがあって、これがよかった。iPhoneでもDesktopでも使える。コミットできるし、なんなら、iPhoneなら 時間ベースでauto commit とかもできる。branch を切って、auto commit して、squash merge で良いかも。

ちょっとつかっていき！
