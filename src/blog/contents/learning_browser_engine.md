<!-- 
title: 自作からブラウザの仕組みを学ぶ
date: 2021-05-24T20:28:00+09:00
draft: true
description: 
image: 
icon: 📚
-->

Webフロントエンジニアたるもの、**ブラウザの仕組みに興味を持つのは自然の摂理**です。本記事では、私がブラウザの仕組みを学んでいく過程を備忘録として残します。

# みんな大好きChrome
Webフロントエンジニアに愛されているブラウザといえば、~~IE~~Chromeですよね。
ブラウザでHTML,CSS,JSの動作確認するのは、日常茶飯事です。
ブラウザによって動作が異なることは、Webフロントエンジニアなら周知の事実です。

* 「レンダリングエンジンが違うから〜」
* 「Javascriptエンジンが違うから〜」

ぐらいは知っているんじゃないかなと思います。

# Chromiumについて

Chromiumも、たぶんご存じの方多いのかなと思いますので、簡単に説明します。

Google Chromeには、Chromiumを元に開発されています。
Chromiumは、オープンソースのプロジェクト名でもあり、ブラウザ名でもあります。
詳しい説明はWikiとか見てください。

オープンソースってことは、ソースコードが誰でも読めちゃうってことですよね！
だったら、ブラウザの動作を知ることができちゃうんじゃないですか！？
とても気になります。

# Chromiumのリバースエンジニアリング

では、Chromiumのソースコードを見ていきましょう。

これです。

* [source.chromium.org](https://source.chromium.org/)

他にも参考となるリンクも載せておきます。

* [chromium.org](https://www.chromium.org/Home)
* [chromium.googlesource.com](https://chromium.googlesource.com/)
* [chromium.googlesource.com/docs/](https://chromium.googlesource.com/chromium/src/+/master/docs/README.md)

😳 ななんと数百万行もあるじゃないですか...。こりゃ大変だ...。
しかも、言語はC++。私はあまりそれを詳しくないのです。

ちなみに、Chromiumのアドベントカレンダーがありました。参考までにざっと見てみると良いでしょう。
[Chromium Browser Advent Calendar 2017](https://qiita.com/advent-calendar/2017/chromium)

# ブラウザの仕組み資料を読む

ちょっと趣向を変えて、以下のような資料を読むことにしました。

* [ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

なんとなく、ブラウザの動作を分かったのですが、やっぱり書いたり読んだりしてみたいところです。
そうです、自作です。

# ブラウザを自作してみる

Rust製のServoというブラウザエンジンを開発している人が書いた記事が、とても参考になります。

* [Let's build a browser engine! Part 1: Getting started](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
  * [mbrubeck/robinson](https://github.com/mbrubeck/robinson)

なので、これはRustで作られています。
次の自作ブラウザエンジンは、C++で書かれていて、さっきのよりも高機能です。

* [askerry/toy-browser](https://github.com/askerry/toy-browser)

私としては、こちらのほうが興味があるので、まずこっちを知り、それをRust版で作り直したいなと思います。


補足) ブラウザエンジンとレンダリングエンジンの違いは？

* レンダリングエンジン
  * [webkit](https://webkit.org/)
  * [blink](https://www.chromium.org/blink)

レンダリングエンジンは、描画を担保します。
ブラウザエンジンは、レンダリングエンジンを含めてブラウザの動作を制御します。

# C++ を学ぶ

さて、C++を学ぶために、次のサイトをざっと眺めてみます。

* [C++入門 - www.asahi-net.or.jp](http://www.asahi-net.or.jp/~yf8k-kbys/newcpp0.html)
* [C++入門 - wisdom.sakura.ne.jp](http://wisdom.sakura.ne.jp/programming/cpp/)
* [C++入門 - kaitei.net](http://kaitei.net/cpp/)

# Re: ブラウザの仕組み資料を読む

もう一度、[ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/) を読むと、初めて読んだときに比べて、深く理解できます。

# 最後に

以上。