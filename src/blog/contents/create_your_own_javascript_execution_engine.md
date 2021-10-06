<!-- 
title: [備忘録] javascriptをLLVM(Rust:inkwell)でJITコンパイルするまで
date: 2021-09-04T18:58:00+09:00
draft: false
description: 
image: 
icon: 🦀
-->

コンパイラ基盤であるLLVMについて、全く知識がない私が、
javascriptソースコードをパースしLLVMコンパイルできるようになりました。
本記事では、できる限り分かりやすくLLVMについて紹介できる記事を書こうと思います。

# あなたは誰？

ふだん、javascriptやpythonなどインタプリタ言語を使うエンジニアです。
コンパイラ言語は、ほぼほぼ使ったことがありません。

# 背景

いぜん、おもちゃのブラウザ自作をやってみました。
HTMLとCSSを解析し、レンダリングするところを書き、基本的な動作を知ることができました。
HTMLとCSSとくれば、次はJSだと思い、JSを実行するエンジンを書いてみたくなりました。
ただし、WebブラウザのAPIとJS実行エンジンをバインディングする箇所(EX.DOM操作)は、いきなりするのは難しいので、
まずは、単純な処理、四則演算やfizzbuzzが処理できるものを作ろうと思いました。

# どうやって作るの？

プログラムをコンパイルするというのは、

字句解析 → 構文解析 → 構文木 → (中間言語) → コード生成

という流れになります。
大学生の頃、lexやyaccを使って電卓を作った覚えがあります。
lexやyaccは、構文木までであり、機械語へ置き換える部分ではありません。
そこは、LLVMというコンパイル基盤を使おうと思いました。

[コンパイラ - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9)

# 何言語で作るの？

Rustを使おうと思います。
深い理由は、ありません。
強いてあげるなら、次の2つです。

* Rustを学びたかった 
* ブラウザ(レンダリングエンジン)をRustで書いたので、JSエンジンもRustで書こうと思った

# 字句解析 ~ 構文木 は、どう作るの？

結論として、swc_ecma_parserを使います。

swc_ecma_parserは、[swc](https://github.com/swc-project/swc)で使われるパーサです。

> EcmaScript/TypeScript parser for the rust programming language.
Passes almost all tests from tc39/test262.

※ https://rustdoc.swc.rs/swc_ecma_parser/

tc39/test262は、次の仕様動作を保証するテストスイートです。

```
ECMA-262, ECMAScript Language Specification
ECMA-402, ECMAScript Internationalization API Specification
ECMA-404, The JSON Data Interchange Format (pdf)
```

## 寄り道

パーサ部分を自作しようか悩みました。
パースするということは、言語の文法を理解する必要があります。
それには、BNFやPEGという文法を定義するメタ言語を覚える必要があります。
また、BNFやPEGからパーサを自動生成する技術が存在します。

そこで、javascript、というよりecmascriptのBNFってどれだろうなと調べていました。
そうすると、私の調べた範囲では、次のページにたどり着きました。

https://tc39.es/ecma262/#sec-grammar-summary

ここをBNFの文法を書き直せばできるんだろうなと思いつつ、先程のtc39/test262をパスするswc_ecma_parserがあるので、
それを使おうと判断しました。

## 実は...

実は、javascriptではなく自作言語を書こうと思っていました。
モチベーションとしては、自作言語をブラウザで動かしたいなと思いました。
というのも、LLVMはバックエンドにWASMをサポートしました。
WASMは、もちろんブラウザでサポートされています。
そこで、自作言語 → LLVM で処理し、バックエンドでWASMをアウトプットすれば、
自作言語 → WASM ということができそうだなと思い、そうすると、自作言語を
ブラウザで動かすことができるという訳です(WASMを動かしているだけですが)

自作言語は、おもちゃなものを作ろうと思いつつ、自分の好きなモノを混ぜたいなと思い、
絵文字で動くemoji langを書こうと思いました。

ただ、文法を考えるのが大変だな〜と思って、却下しました。

# LLVMって？

LLVMについては、ggれば詳しい説明が多くあると思いますので、簡単にだけ説明します。
LLVMは、

> The LLVM Project is a collection of modular and reusable compiler and toolchain technologies.

https://llvm.org/

ちょっとわかりにくいかもです。Wikiの説明を引用します。

> LLVM（エルエルヴィーエム、 またはエルエルブイエム）とは、コンパイル時、リンク時、実行時などあらゆる時点でプログラムを最適化するよう設計された、任意のプログラミング言語に対応可能なコンパイラ基盤である。

https://ja.wikipedia.org/wiki/LLVM

任意のプログラミング言語に〜というのは、次の図が分かりやすいでしょう。

![Three Major Components of a Three-Phase Compiler - The Architecture of Open Source Applications: LLVM](http://www.aosabook.org/images/llvm/SimpleCompiler.png)

こちらは従来のコンパイラ。

![Retargetablity - The Architecture of Open Source Applications: LLVM](http://www.aosabook.org/images/llvm/RetargetableCompiler.png)

こちらが、LLVMの設計です。

# LLVMで、どうやって作るの？

[Kaleidoscope](https://llvm.org/docs/tutorial/)という自作言語を作ることで、作り方がわかります。
資料をちゃんと読めば、わかるのかな〜と思いましたが、前提知識？というんでしょうか、そこが欠けていてよくわからなかったです。

ちなみに、RustでLLVMするならば、

https://github.com/jauhien/iron-kaleidoscope

というものがあります。しかし、codegenの部分が動きません。

rustは、inkwellというものを使いました。正直メリット・デメリットがわかりません。
いい感じにラップしてくれているようで、わかりやすいなと思います。

![きつねさんでもわかるLlvm読書会 第２回](https://image.slidesharecdn.com/llvm-130706080925-phpapp01/95/llvm-9-638.jpg?cb=1373386334)

この考えを知ることが、良いです。

# 具体的な例を見せて！

## まず、小さく知る

いきなりRustで書くよりも、C言語で書いたコードをLLVMにするというのが、初歩として良いと思っています。

```
Cの例
```

## Rustで書いてみよう

LLVM Rust inkwell で試す。

```
rustの環境(バージョン)
```

(DEBUGも良い)

* 四則演算
* fizzbuzz


○ 過程

1. 自作言語にLLVMを使おうと理解する
2. Rustに慣れていないので、環境構築から頑張る
3. Rustの万華鏡でLLVMを学ぶ
4. 自作言語の文法を考え始める
5. 文法を考えるのを断念して、既存言語(js)を対象とする
5.5. rust文法を忘れて、チュートリアルを再度する
6. TOKEN,PARSE,ASTのステップについて理解を深める
7. LLVMの使い方が分からなくなるので、基礎勉強する(Module,Function,..etc. C + ll, debug)
8. 1から⑥を書くのが大変だ。BNFやPEGからパーサを自動生成するツールを調べる (rust_peg || lalrpop)
9. LLVMを再度、学ぶ(四則演算、fizzbuzz)=>完全理解
10. ⑧よりも、swcというツールでecmascriptパーサがあったので、使えそう!
11. swc_ecma_parser + LLVMでjs四則演算が動くようになる
12. allocaやphiなど、まだ使ったことない機能を知る
13. fizzbuzzのjsファイルをLLVMでコンパイルできるようにする