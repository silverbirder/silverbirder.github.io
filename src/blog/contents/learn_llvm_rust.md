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