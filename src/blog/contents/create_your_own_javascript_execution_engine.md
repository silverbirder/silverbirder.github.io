<!-- 
title: [備忘録] javascriptをLLVM(Rust:inkwell)でJITコンパイルするまで
date: 2021-09-04T18:58:00+09:00
draft: false
description: 
image: 
icon: 🦀
-->

# 内容流れ

○ あなたは誰？
→ フロントエンドエンジニア？
→ javascriptをよく書いている人

○ 背景
おもちゃのブラウザ自作をしてみた。
おもちゃの自作言語を作ってみたくなった。
途中で、考えること(Rust,LLVM,自作言語文法)が増えてしまって、javascriptのコンパイルをすることになった。

○ ゴール
javascriptをインプットとし、JITコンパイラで実行完了すること
図で示す。

○ 伝えたいことは？

1. LLVMって意外に簡単。慣れてくると楽しい。
2. Rust ??? 別にいいや。(少し書ければ)
3. 自作言語 ??? jsだしな。 (少し書ければ)

骨組み
javascriptをよく書いてる。自作ブラウザの次は自作言語。
それには、LLVMを使ってみたい。

LLVMとは？ 簡単に。
(frontend middle backend)

LLVMの構成
** module,function,block,builder **

組み立て方:
LLVM Rust inkwell で試す。

** Tips: C言語で試すのが良い。 **
Tips: DEBUGも良い。

試しに 文法が決まっているJS:
swc_ecma_parserが良いだろう

(BNF,PEGについても触れたい)

* 四則演算
* fizzbuzz

終わりに

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
13. fizzbuzzのjsファイルをLLVMでコンパイルできるようにする!

Rustの話は、なくて良いかな。
自作言語についても、特になくても良いかも。
TOKEN,PARSEとかは、軽くで (BNF,PEG)も。
swc_ecma_parserは、まあ少しメインで。

メインは、LLVMの基礎学習あたり。