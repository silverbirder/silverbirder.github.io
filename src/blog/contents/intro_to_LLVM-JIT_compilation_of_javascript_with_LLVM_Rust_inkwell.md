<!-- 
title: LLVM入門 - javascriptをLLVM(Rust:inkwell)でJITコンパイルするまで
date: 2021-09-04T18:58:00+09:00
draft: false
description: 
image: 
icon: 🦀
-->

<figure title="Photo by Sigmund on Unsplash">
<img alt="Photo by Sigmund on Unsplash" src="https://res.cloudinary.com/silverbirder/image/upload/v1633604091/silver-birder.github.io/blog/sigmund-HsTnjCVQ798-unsplash.jpg">
<figcaption>Photo by <a href="https://unsplash.com/@sigmund?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sigmund</a> on <a href="https://unsplash.com/s/photos/compile?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></figcaption>
</figure>  

コンパイラ基盤であるLLVMについて、全く知識がない私が、
javascriptソースコードをパースしLLVMでコンパイルできるようになりました。

LLVMの記事は数多くありますが、初心者向けの記事が少なく感じたため、
本記事では、できる限り分かりやすくLLVMについて紹介できる記事を書こうと思います。

[:contents]

# あなたは誰？

ふだん、javascriptやpythonなどインタプリタ言語を使うエンジニアです。
LLVMについて、全く知識がなかった人間です。

# きっかけは？

いぜん、おもちゃのブラウザ自作をやってみました。

[https://silver-birder.github.io/blog/contents/learning_browser_engine:embed]

HTMLとCSSを解析し、レンダリングするところを書き、基本的な動作を知ることができました。
HTMLとCSSとくれば、次はJSだと思い、JSを実行するエンジンを書いてみたくなりました。
ただし、WebブラウザのAPIとJS実行エンジンをバインディングする箇所(EX.DOM操作)は、いきなりするのは難しいので、
まずは、単純な処理、四則演算やfizzbuzzが処理できるものを作ろうと思いました。

# どうやって作るの？

プログラムをコンパイルするというのは、主に次の順番で処理されます。

@startuml
rectangle ソースコード
rectangle 字句解析
rectangle 構文解析
rectangle 構文木
rectangle 中間言語
rectangle コード生成

ソースコード -> 字句解析
字句解析 -> 構文解析
構文解析 -> 構文木
構文木 -> 中間言語
中間言語 -> コード生成
@enduml

## "字句解析 ~ 構文木"は、どう作るの？

lexやyaccというソフトウェアが有名だと思います。
ただし、1から作るのは大変なので、swc_ecma_parserというものを使います。

swc_ecma_parserは、[swc](https://github.com/swc-project/swc)で使われるパーサです。

> EcmaScript/TypeScript parser for the rust programming language.
Passes almost all tests from tc39/test262.

※ [swc_ecma_parser](https://rustdoc.swc.rs/swc_ecma_parser/)

[tc39/test262](https://github.com/tc39/test262)は、次の仕様動作を保証するテストスイートです。

```
ECMA-262, ECMAScript Language Specification
ECMA-402, ECMAScript Internationalization API Specification
ECMA-404, The JSON Data Interchange Format (pdf)
```

### 寄り道

パーサ部分を自作しようか悩みました。
パースするということは、言語の文法を理解する必要があります。
それには、BNFやPEGという文法を定義するメタ言語を覚える必要があります。
また、BNFやPEGからパーサを自動生成する技術が存在します。

そこで、javascript、というよりecmascriptのBNFってどれだろうなと調べていました。
そうすると、私の調べた範囲では、次のページにたどり着きました。

[https://tc39.es/ecma262/#sec-grammar-summary](https://tc39.es/ecma262/#sec-grammar-summary)

ここをBNFの文法を書き直せばできるんだろうなと思いつつ、先程の[tc39/test262](https://github.com/tc39/test262)をパースする[swc_ecma_parser](https://rustdoc.swc.rs/swc_ecma_parser/)があるので、
それを使おうと判断しました。

### 実は...

実は、javascriptではなく自作言語を書こうと思っていました。
モチベーションとしては、自作言語をブラウザで動かしたいなと思いました。
というのも、LLVMはバックエンドにWASMをサポートしました。
WASMは、もちろんブラウザでサポートされています。
そこで、自作言語 → LLVM で処理し、バックエンドでWASMをアウトプットすれば、
自作言語 → WASM ということができそうだなと思い、そうすると、自作言語を
ブラウザで動かすことができるという訳です(WASMを動かしているだけですが)

@startuml
rectangle 自作言語
rectangle LLVM
rectangle WASM

自作言語 -> LLVM
LLVM -> WASM
@enduml

自作言語は、おもちゃなものを作ろうと思いつつ、自分の好きなモノを混ぜたいなと思い、
絵文字で動くemoji langを書こうと思いました。

ただ、文法を考えるのが大変だな〜と思って、却下しました。

## "構文木 ~ コード生成"は、どう作るの？

そこが、LLVMというコンパイル基盤を使おうと思います。

[コンパイラ - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9)

### LLVMとは

LLVMについては、ggれば詳しい説明が多くあると思いますので、簡単にだけ説明します。

> The LLVM Project is a collection of modular and reusable compiler and toolchain technologies.

※ [ttps://llvm.org/](https://llvm.org/)

ちょっとわかりにくいかもです。Wikiの説明を引用します。

> LLVM（エルエルヴィーエム、 またはエルエルブイエム）とは、コンパイル時、リンク時、実行時などあらゆる時点でプログラムを最適化するよう設計された、任意のプログラミング言語に対応可能なコンパイラ基盤である。

※ [https://ja.wikipedia.org/wiki/LLVM](https://ja.wikipedia.org/wiki/LLVM)

従来のコンパイラは特定言語に依存して最適化していたそうです。

<figure title="Three Major Components of a Three-Phase Compiler - The Architecture of Open Source Applications: LLVM">
<img alt="Three Major Components of a Three-Phase Compiler - The Architecture of Open Source Applications: LLVM" src="http://www.aosabook.org/images/llvm/SimpleCompiler.png">
<figcaption>Three Major Components of a Three-Phase Compiler - The Architecture of Open Source Applications: LLVM<figcaption>
</figure>  

LLVMは、フロントエンド、共通オプティマイズ、バックエンドの3構成です。
フロントエンドには、CやFortranなど、バックエンドはX86やPowerPCなど選択肢の幅があります。
任意のプログラミング言語に対応というのは、そういう選択肢の話です。

<figure title="Retargetablity - The Architecture of Open Source Applications: LLVM">
<img alt="Retargetablity - The Architecture of Open Source Applications: LLVM" src="http://www.aosabook.org/images/llvm/RetargetableCompiler.png">
<figcaption>Retargetablity - The Architecture of Open Source Applications: LLVM<figcaption>
</figure>  

### LLVMのフロントエンドは何言語で書くの？

Rustを使おうと思います。
深い理由は、ありません。
強いてあげるなら、次の2つです。

* Rustを学びたかった 
* ブラウザ(レンダリングエンジン)をRustで書いたので、JSエンジンもRustで書こうと思った

### LLVMのバックエンドは何言語で書くの？

よくわかっていないです。inkwellの`create_jit_execution_engine`を使ってJIT実行エンジンで動かします。
バックエンドは、デフォルトでなにか指定されているのか。

[wasmer-compiler-llvm](https://lib.rs/crates/wasmer-compiler-llvm)というのもある。

clang --target=XXX のXXXがバックエンドだ。

# LLVMで、どうやって作るの？
LLVMでは、Module,Function,Block,Builderの構成というのを知っていると、理解が進みます。

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

いきなりRustで書くよりも、C言語で書いたコードをLLVMで、中間ファイル(IR)を出力するのが、初歩として良いと思っています。

```c
#include <stdio.h>

int main(int argc, char **argv) {
     printf("Hello, world!\n");
     return 0;
}
```

```
$ clang --version
Apple clang version 12.0.5 (clang-1205.0.22.9)
Target: x86_64-apple-darwin20.6.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
$ $ llc -version
Homebrew LLVM version 12.0.1
$ clang -S -emit-llvm -O3 hw.c
```

```
; ModuleID = 'hw.c'
source_filename = "hw.c"
target datalayout = "e-m:o-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-apple-macosx11.0.0"

@str = private unnamed_addr constant [14 x i8] c"Hello, world!\00", align 1

; Function Attrs: nofree nounwind ssp uwtable
define i32 @main(i32 %0, i8** nocapture readnone %1) local_unnamed_addr #0 {
  %3 = tail call i32 @puts(i8* nonnull dereferenceable(1) getelementptr inbounds ([14 x i8], [14 x i8]* @str, i64 0, i64 0))
  ret i32 0
}

; Function Attrs: nofree nounwind
declare i32 @puts(i8* nocapture readonly) local_unnamed_addr #1

attributes #0 = { nofree nounwind ssp uwtable "correctly-rounded-divide-sqrt-fp-math"="false" "darwin-stkchk-strong-link" "disable-tail-calls"="false" "frame-pointer"="all" "less-precise-fpmad"="false" "min-legal-vector-width"="0" "no-infs-fp-math"="false" "no-jump-tables"="false" "no-nans-fp-math"="false" "no-signed-zeros-fp-math"="false" "no-trapping-math"="true" "probe-stack"="___chkstk_darwin" "stack-protector-buffer-size"="8" "target-cpu"="penryn" "target-features"="+cx16,+cx8,+fxsr,+mmx,+sahf,+sse,+sse2,+sse3,+sse4.1,+ssse3,+x87" "unsafe-fp-math"="false" "use-soft-float"="false" }
attributes #1 = { nofree nounwind }

!llvm.module.flags = !{!0, !1, !2}
!llvm.ident = !{!3}

!0 = !{i32 2, !"SDK Version", [2 x i32] [i32 11, i32 3]}
!1 = !{i32 1, !"wchar_size", i32 4}
!2 = !{i32 7, !"PIC Level", i32 2}
!3 = !{!"Apple clang version 12.0.5 (clang-1205.0.22.9)"}
```

ここで重要なのが、...。

## Rustで書いてみよう

LLVM Rust inkwell で試す。

```
$ cargo --version && rustc --version
cargo 1.56.0-nightly (18751dd3f 2021-09-01)
rustc 1.56.0-nightly (50171c310 2021-09-01)
```

```rust
use inkwell::context::Context;
use inkwell::OptimizationLevel;

fn main() {
    let context = Context::create();
    // moduleを作成
    let module = context.create_module("main");
    // builderを作成
    let builder = context.create_builder();

    // 型関係の変数
    let i32_type = context.i32_type();
    let i8_type = context.i8_type();
    let i8_ptr_type = i8_type.ptr_type(inkwell::AddressSpace::Generic);

    // printf関数を宣言
    let printf_fn_type = i32_type.fn_type(&[i8_ptr_type.into()], true);
    let printf_function = module.add_function("printf", printf_fn_type, None);

    // main関数を宣言
    let main_fn_type = i32_type.fn_type(&[], false);
    let main_function = module.add_function("main", main_fn_type, None);

    // main関数にBasic Blockを追加
    let entry_basic_block = context.append_basic_block(main_function, "entry");
    // builderのpositionをentry Basic Blockに設定
    builder.position_at_end(entry_basic_block);

    // ここからmain関数に命令をビルドしていく
    // globalに文字列を宣言
    let hw_string_ptr = builder.build_global_string_ptr("Hello, world!", "hw");
    // printfをcall
    builder.build_call(printf_function, &[hw_string_ptr.as_pointer_value().into()], "call");
    // main関数は0を返す
    builder.build_return(Some(&i32_type.const_int(0, false)));

    // JIT実行エンジンを作成し、main関数を実行
    let execution_engine = module.create_jit_execution_engine(OptimizationLevel::Aggressive).unwrap();
    module.print_to_file("main.ll");
    unsafe {
        execution_engine.get_function::<unsafe extern "C" fn()>("main").unwrap().call();
    }
}
```

(DEBUGも良い)

### 四則演算

### fizzbuzz

### JSをパース

### 四則演算のJSをパース

# 終わりに

# メモ

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