---
title: Go Conference 2019 Spring - 2019年5月18日 参加レポート
published: true
date: 2019-05-21
description: https://gocon.jp こちらに参加してきましたので、ご報告します！
tags: ["Report", "Go Conference", "Tokyo"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614428902/silver-birder.github.io/blog/go_conference_2019_spring_coffee.jpg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614428902/silver-birder.github.io/blog/go_conference_2019_spring_coffee.jpg
---

<ogp-me src="https://gocon.connpass.com/event/124530/"></ogp-me>

<ogp-me src="https://gocon.jp/"></ogp-me>

こちらに参加してきましたので、ご報告します！

```
// 場所
リクルートライフスタイル本社
東京都千代田区丸の内1-9-2 グラントーキョーサウスタワー
```

<!--  TODO: TOC -->

# よかったセッション
## H1 (S): Hacking Go Compiler Internals 2
### 概要
> Since the previous talk at Go Con 2014 Autumn, lots of things in the internals have changed. In this talk, I will try to give an overview of Go compiler internals and update the information as much as possible, along with my new hacks.

### 資料
#### 今回
<o-embed src="https://speakerdeck.com/moriyoshi/hacking-go-compiler-internals-2nd-season"></o-embed>
#### 前回
<ogp-me src="https://www.slideshare.net/moriyoshi/hacking-go-compiler-internals-gocon-2014-autumn"></ogp-me>

### 感想
このセッションでは、Golangのソースコードが機械語になるまでのステップ、要はコンパイラの動きを紹介されていました。
大きく分類して11ステップあり、ざっくり要約すると下記のステップです。

１．コードをトークンに分割  
２．構文木に構築  
３．型チェック  
４．インライン化  
５．中間言語(SSA)の生成   
６．機械語の生成  

正直、高級言語ばかり使っていたので、機械語に近い低級言語の知識が乏しい私ですが、
今回のお話は、そういった初心者でも分かりやすく説明されていました。
この話を聞いて、純粋に疑問に持ったこととして「どこに最も時間がかかるのか」でした。
ちょうど、同じ疑問を持った方が質問されていて、回答として「型チェック」だそうです。
実際に調べるためのツールが、golangのbenchmarkがあるみたいなので、こちらを使って
チューニングをすることができます。簡単なコードを書いて、試してみたいなと思いました。

## A4 (S): Design considerations for container-based Go applications
### 概要
Go言語でのアプリケーション開発で、特にコンテナを前提とする場合の設計考慮点について話します。 例えば、Go言語でAPIを開発する場合、コンテナとして動かすことを前提とするケースが多いと感じます。コンテナベースで動かすことを前提とした場合、コンテナイメージ作成・アプリケーション監視において、考慮すべき点が出てくるでしょう。このトークでは、Go言語での実装にまで踏み込んだ上で、コンテナベースアプリケーションにおける設計の考慮点について話します。

### 資料
<o-embed src="https://speakerdeck.com/hgsgtk/design-considerations-for-container-based-go-application"></o-embed>

<ogp-me src="https://www.redhat.com/ja/resources/cloud-native-container-design-whitepaper"></ogp-me>

### 感想
Golangの話というより、コンテナで開発する上でのTipsの話でした。
Tipsは３つ紹介されていて、「Configuration」「Logging」「Monitering」です。
どれも、資料にあるベストプラクティスに沿った方法で、良い手法だなと勉強になりました。

・Configuration  
設定情報をソースコードで管理するのではなく、環境変数を使うこと  
→ 本番/検証等でもソースが変わらない  
・Logging  
ファイルに出力するのではなく、ストリーミングし外部サービスに流す  
→ コンテナを使い捨てしやすくなる  
・Monitering  
ヘルスチェックのエンドポイントを提供する  
→ 外部サービスと連携しやすくなる  

他にもベストプラクティが資料に載ってあるので、時間があるときに読んでみたいなと思います。

## B8 (L): CPU, Memory and Go
### 概要
基本的なCPUやメモリを簡単に触れ、Goの最適化、コンパイラの最適化、Goで実装したときのCPUやメモリの振る舞いを紹介します。 またこれら最適化の様子やパフォーマンスを実際にGoの標準ツールを使いながら確認していきます。

### 資料
<o-embed src="https://speakerdeck.com/sonatard/cpu-memory-and-go"></o-embed>

### 感想
Golangにおけるパフォーマンス・チューニングについて勉強になりました。
Golangだけの話なのかわかりませんが、コーディングする際に気にしたほうが良いと思います。

・動的配列を使うのではなくて、静的配列を使う  
→ 動的配列だとメモリ確保のコストが高くなるので、遅くなってしまう  

・環境変数を使うのではなくて、定数を使うこと  
→ 実行時にならないと処理が決まらず、コンパイラの最適化がされない  

・メモリに割り当てる際は8byteずつで割り切れるようにすること(64bitの場合)  
→ 隙間があった場合、パディングが発生して遅くなる(メモリアライメント)  

そもそも低レイヤーについて全くわからない人なので、
CPUとMemoryについて知れてよかったです。

# 全体的な感想
Golangのセミナーに初めて参加しました。
スポンサーの話を聞いていると、Golangを採用した理由は、
どの企業も「パフォーマンスの良さと、学習コストの低さ」
という理由が多かった印象があります。
また、DockerやKubernetesがGolangで作られていたりと、
Golangはドンドンと人気になっていく言語なのかなと期待しています。

また、スポンサーの中で「既存システムをGolangに再構築した」や
「Golangの知識を得るために勉強会を開催した」など、各社Golangへ
積極的に活動を試みていることをお聞きしました。

# 反省
Google TeamであるKatie Hockmanのspeakingが英語だったために、ほとんど聞き取ることができませんでした。
実にもったいないと感じました。

※ 資料まとめ
<o-embed src="https://engineer-fumi.hatenablog.com/entry/2019/05/18/172000"></o-embed>
