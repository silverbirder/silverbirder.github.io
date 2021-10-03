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

* rustscript ...

ちょっとrustの文法を記憶できておらず、rust-by-example-jaを少しかじる。

* トークナイズ、AST構築、、大変そうだ

https://github.com/orgs/rusty-ecma/repositories rusty-ecma を発見。
javascriptをトークナイズ、ASTなどやってくれるくん。なんだって！

(ありえないけど) denoくんのランタイムでrustが使われていたような。。。
https://github.com/denoland/rusty_v8 ここには、依存ないんだな。そりゃそうだ。
rusty_v8は、v8 C++のバインディング。


* LLVM 使い方が...わからんぞ

ASTがたとえ作れたとして、LLVMにどう繋げられるかわからんとな...。
llvm-sys ? とか、inkwellとかあるんだけどな...。
これらの使い方には、根っことしてLLVMの動きが知らないとな...。

Module, Function, Block, Builder ... という構造を知った。

* C言語からllファイルを出力して動きを知る

Rustからinkwellを通してjitで動かすことに苦労してた。
いきなりjitを使うんじゃなくて、llファイルを出してrunするほうがデバッグしやすい。
まずは、llファイルに出して動作を知る。
そのためには、llファイルってどうなっているのか知りたくなり、
C言語のよくみるコードをllファイルに出力し、Cとllでどう違うのか考える。

* BNFやらPEGやら

https://qiita.com/Anharu/items/cc2ef930274ed5d13c97 の記事を見て、
あれ、TOKEN処理ないじゃん？って思ったら、PEGというものを知る。

https://github.com/kevinmehall/rust-peg

BNFは、なんとなく知っているけど、PGEを初めて知った。
ルールを書いておけば、TOKENの処理が不要っぽい？
パフォーマンスは悪いらしい（先読み？）

BNFもジェネレータ？のようなものがあればな〜、
https://docs.rs/bnf/0.3.3/bnf/

* 学び

```
    let context = Context::create();
    let module = context.create_module("main");
    let builder = context.create_builder();
    let i64_type = context.i64_type();
    let fn_type = i64_type.fn_type(&[i64_type.into(), i64_type.into()], false);
    let function = module.add_function("sum", fn_type, None);
    let basic_block = context.append_basic_block(function, "entry");
    builder.position_at_end(basic_block);

    let x = function.get_nth_param(0).unwrap().into_int_value();
    let y = function.get_nth_param(1).unwrap().into_int_value();
    let sum = builder.build_int_add(x, y, "sum");
    builder.build_return(Some(&sum));
```

このbuilder.position_at_endが、build_returnよりも下にしていたら、llの結果を見るとほぼ空っぽだった。
先に、builder.position_at_endで書き込んで、そこからbuilderを動かす流れだと理解。
いやー、しかし main.llを出力して確認するのは、大切だな〜。

RUST_BACKTRACE=1も大切だな。
```
thread 'main' panicked at 'called `Option::unwrap()` on a `None` value', src/main.rs:29:39
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
```
どこでpanicになったかわかるじゃん。

* fizzbuzz できた!

よっしゃ、if else if else で動くようになった！
はじめて、(サンプルコードにない)switchを試してみた。
https://llvm.org/docs/LangRef.html#switch-instruction
サンプルコードが読めるようになった。

が、https://stackoverflow.com/questions/14069737/switch-case-error-case-label-does-not-reduce-to-an-integer-constant にあるとおり、
実行時に評価されるものは、だめだ。
で、これC言語で使おうとすると、switch (n % 15) case 3,6,9,12: と書くしかない。
switch (x) case x % 5 のような記法 (なんていうんだっけ、式評価?) が無理なんだな。
ま、大丈夫だ。

* 次どうしようか

BNFの定義から、パーサージェネレータがあれば、Javascriptのパースができるんじゃないかな〜。
RUSTなら、LLじゃなくてLRのBNFで https://github.com/lalrpop/lalrpop というものがある。

で、JavascriptのBNFは、↓ のようだ
https://tc39.es/ecma262/#sec-grammar-summary  (https://github.com/tc39/ecma262)

ちなみに、BNFの書き方↓
https://ja.wikipedia.org/wiki/%E3%83%90%E3%83%83%E3%82%AB%E3%82%B9%E3%83%BB%E3%83%8A%E3%82%A6%E3%82%A2%E8%A8%98%E6%B3%95

* swc で...

swcは、rustで動いているけど ecmascriptのパース処理があって
https://rustdoc.swc.rs/swc_ecma_parser/
これは、さっきの https://github.com/tc39/test262 に参照がある。

お、じゃあ、パースは、これ使えば良いんじゃね？それをllvmで!

そして、試してみる...
1+1というjsファイルをparseしてみた。
簡単にvalueを手に入れた。

https://stackoverflow.com/questions/9109872/how-do-you-access-enum-values-in-rust

enumのstructを取る方法は、知らなかった。
けど、これで実現できるかもしれない。

* 細かい

こういうのがある。

* alloca
  * https://rhysd.hatenablog.com/entry/2017/03/13/230119
* phi
  * https://qiita.com/JunSuzukiJapan/items/faf2ac94df0ebca43064

* 記事書くために

https://browserbook.shift-js.info/chapters/integrating-v8

v8とrusty_v8、そのあたりを理解する。

Chromiumは、ブラウザレンダラーにblinkを作っていてC++。
blinkは、DOM操作などAPIを公開していて、それをv8というC++で書かれた
javascript実行エンジンとバインディングする。

rusty_v8は、v8の機能(C++)をrustから叩くだけ。

https://zenn.dev/yubrot/articles/eaaeeab742b4a1

この記事、セルフホスティングについて。

```
kaleidoscope → Rust (LLVM) でコンパイル → kaleidoscope コンパイラ

kaleidoscope コンパイラ に、LLVMのC APIを生やす。

kaleidoscope2 → kaleidoscope (LLVM) でコンパイラ → kaleidoscope2 コンパイラ

kaleidoscope2 コンパイラ に、LLVMのC APIを生やす。

kaleidoscope3 → kaleidoscope2 (LLVM) でコンパイラ → kaleidoscope3 コンパイラ

diff kaleidoscope2 コンパイラ kaleidoscope3 コンパイラ
```