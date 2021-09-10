<!-- 
title: LLVMとRustを学ぶ
date: 2021-09-04T18:58:00+09:00
draft: false
description: 
image: 
icon: 🦀
-->

![llvm](https://qiita-user-contents.imgix.net/https%3A%2F%2Fqiita-image-store.s3.amazonaws.com%2F0%2F227781%2F1bef0ae4-5a98-b7d1-1e12-c6533e23ebe4.png?ixlib=rb-4.0.0&auto=format&gif-q=60&q=75&w=1400&fit=max&s=cb0956dd39fa7c65562a467ce95026e9)

frontend → middle → backend

フロントは、インプットとなる言語
=> LLVM IR という中間言語に変換 (middle)
↓
backendは、どのアーキテクチャ(ARMとか)に出力するか。
wasmも増えたそう。

* Debugいるね
Code Debugger ね。

* rust
stable, nightly 更新が必要だな。
https://github.com/jauhien/iron-kaleidoscope/ が古いので、cargo buildがつらい。


* 万華鏡のコードをある程度読む

token,parserを呼んだ。builderのllvmのところは、古くって使えなかった。ビルドが通らなかった。
なので、自ら言語を作ってみる。簡単なもので。

Emoji Lang 的なやつを作ってみる。

* 文法を考えるつら...

そこまで本気じゃないので、言語の文法を考えるのがつらいなと...。
なにか真似しようと、emojicodeという言語を参考にしようとしたけど、
全然知らない言語なので、文法を頭に叩き込むことになって... たいへん。

目的は、すごい言語を作りたいというわけじゃなくて、言語の作り方を知りたい。
なので、よく知っている言語、俺だったらjavascriptがよくしっているので、
rustscriptを作ってみるか。