<!-- 
title: ブラウザエンジンを学ぶ
date: 2021-05-24T20:28:00+09:00
draft: false
description: 
image: 
icon: 📚
-->

## 書きたいこと

1. [ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

ふむふむ、なるほど？

2. [Chromium](https://www.chromium.org/Home) をリバース・エンジニアリングするぜ！

* [chromium.org](https://www.chromium.org/Home)
* [source.chromium.org](https://source.chromium.org/)
* [chromium.googlesource.com](https://chromium.googlesource.com/)
* [chromium.googlesource.com/docs/](https://chromium.googlesource.com/chromium/src/+/master/docs/README.md)

数百万行のコードだ・・・読めねぇ...!!

* [Chromium Browser Advent Calendar 2017](https://qiita.com/advent-calendar/2017/chromium)

ほぇ〜、コントリビュータ？のつよつよエンジニアが多いぞ？

3. ブラウザエンジンを自作するぞ？


* [Let's build a browser engine! Part 1: Getting started](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
  * [mbrubeck/robinson](https://github.com/mbrubeck/robinson)
  * [askerry/toy-browser](https://github.com/askerry/toy-browser)

servoというrustのブラウザエンジン開発者の人記事。


ブラウザエンジンとレンダリングエンジンの違いは？

* レンダリングエンジン
  * [webkit](https://webkit.org/)
  * [blink](https://www.chromium.org/blink)

自作するには、C++が良い。chromiumやblinkがそうなので。
メモリ管理で色々課題があって、Rustで置き換えという話もあるようだ。

4. もう一度、[ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/) を読むぞ？

自作すると、今一度理解が深まる。

5. Javascript Engine を知るぞ！

* [v8](https://v8.dev/)
  * [ignition](https://v8.dev/docs/ignition)
  * [turbofan](https://v8.dev/docs/turbofan)

JITとコンパイラ・・・、なんとなく分かるけど、具体的なイメージが...

* [toy javascript engine](https://github.com/maekawatoshiki/rapidus)

LLVMを知るぞ！