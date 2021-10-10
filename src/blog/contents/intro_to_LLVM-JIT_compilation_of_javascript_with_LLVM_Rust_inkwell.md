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

過去に、おもちゃのブラウザ自作をやってみました。

[https://silver-birder.github.io/blog/contents/learning_browser_engine:embed]

HTMLとCSSを解析し、レンダリングするところを書き、基本的な動作を知ることができました。
HTMLとCSSとくれば、次はJSだと思い、JSを実行するエンジンを書いてみたくなりました。
ただし、WebブラウザのAPIとJS実行エンジンをバインディングする箇所(EX.DOM操作)は難しいので、
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

# "字句解析 ~ 構文木"は、どう作るの？

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

実際のテストコードは、[tc39/test262/test](https://github.com/tc39/test262/tree/main/test)にあります。

# 自作パーサは断念

パーサ部分を自作しようか悩みました。
パースするということは、言語の文法を理解する必要があります。
その理解を、プログラミングで泥臭く定義しコーディングしてパース処理を書くか、
BNFやPEGなどのメタ言語を書き、パーサを自動生成するライブラリを使うかの大まか2択あります。

そこで、javascript、というよりecmascriptのBNFってどれだろうなと調べていました。
そうすると、私の調べた範囲では、次のページにたどり着きました。

[https://tc39.es/ecma262/#sec-grammar-summary](https://tc39.es/ecma262/#sec-grammar-summary)

ここをBNFの文法を書き直せばできるんだろうなと思いつつ、先程の[tc39/test262](https://github.com/tc39/test262)をパースする[swc_ecma_parser](https://rustdoc.swc.rs/swc_ecma_parser/)の方が安定しているだろうと思い、自作を断念しました。

# "構文木 ~ コード生成"は、どう作るの？

そこが、LLVMというコンパイル基盤を使おうと思います。

[コンパイラ - Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B3%E3%83%B3%E3%83%91%E3%82%A4%E3%83%A9)

# LLVMとは

公式ページより、

> The LLVM Project is a collection of modular and reusable compiler and toolchain technologies.

※ [ttps://llvm.org/](https://llvm.org/)

LLVMプロジェクトとは、再利用性が高いコンパイラとツールチェイン技術の総称です。
コンパイラとは、

> compiler is a computer program that translates computer code written in one programming language (the source language) into another language (the target language). The name "compiler" is primarily used for programs that translate source code from a high-level programming language to a lower level language (e.g. assembly language, object code, or machine code) to create an executable program.

※ [https://en.wikipedia.org/wiki/Compiler](https://en.wikipedia.org/wiki/Compiler)

に書かれている通り、あるコードを別のコードに変換するプログラムのことをコンパイラと指します。
主に、高級言語(ex. javascript)から低級言語(ex. アセンブリ言語)への変換という意味でコンパイラが使われます。

LLVMは、次の特徴があります。

> LLVM is a set of compiler and toolchain technologies, which can be used to develop a front end for any programming language and a back end for any instruction set architecture. LLVM is designed around a language-independent intermediate representation (IR) that serves as a portable, high-level assembly language that can be optimized with a variety of transformations over multiple passes.

※ [https://en.wikipedia.org/wiki/LLVM](https://en.wikipedia.org/wiki/LLVM)

LLVMは、任意のフロントエンド言語(コンパイラという文脈でいう変換前の言語)から任意の命令セットアーキテクチャ(以下、ISA)バックエンドへ変換できます。
また、非言語依存な中間言語(以下、IR)を中心として設計されています。

<figure title="Retargetablity - The Architecture of Open Source Applications: LLVM">
<img alt="Retargetablity - The Architecture of Open Source Applications: LLVM" src="http://www.aosabook.org/images/llvm/RetargetableCompiler.png">
<figcaption>Retargetablity - The Architecture of Open Source Applications: LLVM<figcaption>
</figure>  

#### バックエンドにWebAssemblyサポート

古い記事ですが、LLVMがバックエンドとしてWebAssembly(以下,WASM)をサポートしました。

[https://www.publickey1.jp/blog/19/webassemblyllvm_80.html:embed]

WASMは、仮想的なISAとして設計されています。

> WebAssembly, or "wasm", is a general-purpose virtual ISA designed to be a compilation target for a wide variety of programming languages.

[WebAssembly Reference Manual](https://github.com/sunfishcode/wasm-reference-manual/blob/master/WebAssembly.md)

### LLVMのフロントエンドは何言語で書くの？

タイトルにある通り、Rustで書こうと思います。
単にRustでやってみたかっただけです。
LLVMライブラリとして、[inkwell](https://github.com/TheDan64/inkwell)を使用します。
これは、LLVMのC APIを安全に使えるようにする薄いラッパーライブラリです。

### LLVMのバックエンドは何にするの？

今回は、ローカルマシンで動かすこととします。
具体的には、`x86_64-apple-darwin20.6.0` になります。

試していないですが、WASMへターゲットができるようです。

* [Target initialize_webassembly](https://thedan64.github.io/inkwell/inkwell/targets/struct.Target.html#method.initialize_webassembly)

# そろそろ、LLVMをやってみよう

前置きが長くなりましたが、実際にLLVMをやっていきたいと思います。

## 環境

私の環境(Mac)はこちらです。

```shell session
$ sw_vers 
ProductName:    macOS
ProductVersion: 11.6
BuildVersion:   20G165
$ cargo --version && rustc --version
cargo 1.56.0-nightly (18751dd3f 2021-09-01)
rustc 1.56.0-nightly (50171c310 2021-09-01)
```

llvmのインストールは、Macユーザなので、[brewからllvm](https://formulae.brew.sh/formula/llvm)をインストールします。
[公式ページからダウンロード](https://releases.llvm.org/download.html)もできるようです。

インストールが完了すると、clangやllcといったツールが使えます。

```shell session
$ clang --version
Homebrew clang version 13.0.0
Target: x86_64-apple-darwin20.6.0
Thread model: posix
InstalledDir: /usr/local/opt/llvm/bin
$ llc -version
Homebrew LLVM version 12.0.1
```

MacにはXcodeにclangが含まれているようです。こちらを使っても問題ありません。
(ただ、xcodeのclangには、[wasmには対応していないです](https://github.com/WebAssembly/wasi-sdk/issues/172#issuecomment-772399153))

```shell session
$ clang --version
Apple clang version 12.0.5 (clang-1205.0.22.9)
Target: x86_64-apple-darwin20.6.0
Thread model: posix
InstalledDir: /Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin
```

## 手を動かす前に、知っておくこと

LLVMでは、IRを生成します。
そのIRでは、`Module ⊇ Function ⊇ Block ⊇ Instruction(Builder)` という構成になっています。
これを知っていないと、LLVMのコードを見ても、理解しにくいと思います。(自身が持つ言葉で解釈して誤った理解になりかねません)

![きつねさんでもわかるLlvm読書会 第２回](https://image.slidesharecdn.com/llvm-130706080925-phpapp01/95/llvm-9-638.jpg?cb=1373386334)

小さなC言語コードとIRで例を示します。
Rustじゃなく、Cを選んだのは、clangから手軽にIRを出力できるからです。

```c
// if.c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int i = rand();
    if (i == 1)
    {
        printf("i is one.");
    }
    return 0;
}
```

これをIRに変換

```shell session
$ clang -S -emit-llvm -O3 if.c
```

出力されたファイルは、`if.ll`というIRファイルです。
そこから、`@main`コードを見ます。

```
@.str = private unnamed_addr constant [10 x i8] c"i is one.\00", align 1

define i32 @main() local_unnamed_addr #0 {
  %1 = tail call i32 @rand() #3
  %2 = icmp eq i32 %1, 1
  br i1 %2, label %3, label %5

3:                                                ; preds = %0
  %4 = tail call i32 (i8*, ...) @printf(i8* nonnull dereferenceable(1) getelementptr inbounds ([10 x i8], [10 x i8]* @.str, i64 0, i64 0))
  br label %5

5:                                                ; preds = %3, %0
  ret i32 0
}

declare i32 @rand() local_unnamed_addr #1

declare noundef i32 @printf(i8* nocapture noundef readonly, ...) local_unnamed_addr #2
```

* Module
  * LLVM programs are composed of Module’s, each of which is a translation unit of the input programs.
  * 入力プログラムの変換単位.
    * https://llvm.org/docs/LangRef.html#module-structure
* Function
  * LLVM function definitions consist of the “define” keyword.
  * A function definition contains a list of basic blocks.
  * 関数. 複数の基本ブロックを持つ.
  * https://llvm.org/docs/LangRef.html#functions
* Block
  * Each basic block may optionally start with a label (giving the basic block a symbol table entry), contains a list of instructions, and ends with a terminator instruction (such as a branch or function return).
  * ラベルから始まり、複数の命令を持つ.
  * https://llvm.org/docs/LangRef.html#functions
* Instruction
  * The LLVM instruction set consists of several different classifications of instructions: terminator instructions, binary instructions, bitwise binary instructions, memory instructions, and other instructions.
  * バイナリ命令やメモリ命令など、様々な命令を持つ. 
  * https://llvm.org/docs/LangRef.html#instruction-reference

![sample_llvm_code](https://res.cloudinary.com/silverbirder/image/upload/v1633770792/silver-birder.github.io/blog/sample_llvm_code.png)

## 参考になる資料たち

* チュートリアル
  * C++ [Kaleidoscope](https://llvm.org/docs/tutorial/)
  * Rust [Kaleidoscope](https://github.com/jauhien/iron-kaleidoscope)
    * codegenが動かないため、途中までしか使えません
  * Rust + inkwell [Kaleidoscope](https://github.com/TheDan64/inkwell/blob/master/examples/kaleidoscope)

# Rustで書いてみよう

LLVM Rust inkwell で書いてみます。

## Hello World
まずは、Hello World を出力します。

```rust
use inkwell::context::Context;
use inkwell::OptimizationLevel;

fn main() {
    let context = Context::create();
    let module = context.create_module("main");
    let builder = context.create_builder();

    let i32_type = context.i32_type();
    let i8_type = context.i8_type();
    let i8_ptr_type = i8_type.ptr_type(inkwell::AddressSpace::Generic);

    let printf_fn_type = i32_type.fn_type(&[i8_ptr_type.into()], true);
    let printf_function = module.add_function("printf", printf_fn_type, None);

    let main_fn_type = i32_type.fn_type(&[], false);
    let main_function = module.add_function("main", main_fn_type, None);

    let entry_basic_block = context.append_basic_block(main_function, "entry");
    builder.position_at_end(entry_basic_block);

    let hw_string_ptr = builder.build_global_string_ptr("Hello, world!", "hw");
    builder.build_call(printf_function, &[hw_string_ptr.as_pointer_value().into()], "call");
    builder.build_return(Some(&i32_type.const_int(0, false)));

    let execution_engine = module.create_jit_execution_engine(OptimizationLevel::Aggressive).unwrap();
    unsafe {
        execution_engine.get_function::<unsafe extern "C" fn()>("main").unwrap().call();
    }
}
```

```shell session
$ RUST_BACKTRACE=1 cargo run
```

```rust
module.print_to_file("module.ll");
```

これを挟んでデバッグするのも良いだろう。

## sum

```rust
extern crate inkwell;

use inkwell::OptimizationLevel;
use inkwell::builder::Builder;
use inkwell::context::Context;
use inkwell::execution_engine::{ExecutionEngine, JitFunction};
use inkwell::module::Module;

use std::error::Error;

/// Convenience type alias for the `sum` function.
///
/// Calling this is innately `unsafe` because there's no guarantee it doesn't
/// do `unsafe` operations internally.
type SumFunc = unsafe extern "C" fn(u64, u64, u64) -> u64;

struct CodeGen<'ctx> {
    context: &'ctx Context,
    module: Module<'ctx>,
    builder: Builder<'ctx>,
    execution_engine: ExecutionEngine<'ctx>,
}

impl<'ctx> CodeGen<'ctx> {
    fn jit_compile_sum(&self) -> Option<JitFunction<SumFunc>> {
        let i64_type = self.context.i64_type();
        let fn_type = i64_type.fn_type(&[i64_type.into(), i64_type.into(), i64_type.into()], false);
        let function = self.module.add_function("sum", fn_type, None);
        let basic_block = self.context.append_basic_block(function, "entry");

        self.builder.position_at_end(basic_block);

        let x = function.get_nth_param(0)?.into_int_value();
        let y = function.get_nth_param(1)?.into_int_value();
        let z = function.get_nth_param(2)?.into_int_value();

        let sum = self.builder.build_int_add(x, y, "sum");
        let sum = self.builder.build_int_add(sum, z, "sum");

        self.builder.build_return(Some(&sum));

        unsafe { self.execution_engine.get_function("sum").ok() }
    }
}


fn main() -> Result<(), Box<dyn Error>> {
    let context = Context::create();
    let module = context.create_module("sum");
    let execution_engine = module.create_jit_execution_engine(OptimizationLevel::None)?;
    let codegen = CodeGen {
        context: &context,
        module,
        builder: context.create_builder(),
        execution_engine,
    };

    let sum = codegen.jit_compile_sum().ok_or("Unable to JIT compile `sum`")?;

    let x = 1u64;
    let y = 2u64;
    let z = 3u64;

    unsafe {
        println!("{} + {} + {} = {}", x, y, z, sum.call(x, y, z));
        assert_eq!(sum.call(x, y, z), x + y + z);
    }

    Ok(())
}
```

### fizzbuzz

```rust
extern crate inkwell;

use inkwell::builder::Builder;
use inkwell::context::Context;
use inkwell::execution_engine::ExecutionEngine;
use inkwell::module::Module;
use inkwell::IntPredicate::EQ;
use inkwell::OptimizationLevel;
use std::error::Error;
use std::ptr::null;

struct CodeGen<'ctx> {
    context: &'ctx Context,
    module: Module<'ctx>,
    builder: Builder<'ctx>,
    execution_engine: ExecutionEngine<'ctx>,
}

fn main() -> Result<(), Box<dyn Error>> {
    let context = Context::create();
    let module = context.create_module("fizzbuzz");
    let i64_type = context.i64_type();
    let void_type = context.void_type();
    let i8_type = context.i8_type();
    let i8_ptr_type = i8_type.ptr_type(inkwell::AddressSpace::Generic);
    let null = i8_ptr_type.const_null();
    let printf_fn_type = void_type.fn_type(&[i8_ptr_type.into()], true);
    let printf_function = module.add_function("printf", printf_fn_type, None);

    let fn_type = i64_type.fn_type(&[i64_type.into()], false);
    let function = module.add_function("fizzbuzz", fn_type, None);
    let block = context.append_basic_block(function, "entry");
    let builder = context.create_builder();
    builder.position_at_end(block);
    let fb_string_ptr = builder.build_global_string_ptr("fizzbuzz\n", "fizzbuzz");
    let f_string_ptr = builder.build_global_string_ptr("fizz\n", "fizz");
    let b_string_ptr = builder.build_global_string_ptr("buzz\n", "buzz");
    let x = function.get_nth_param(0).unwrap().into_int_value();
    let x3 = builder.build_int_signed_rem(x, i64_type.const_int(3, false), "rem");
    let x5 = builder.build_int_signed_rem(x, i64_type.const_int(5, false), "rem");
    let x15 = builder.build_int_signed_rem(x, i64_type.const_int(15, false), "rem");
    let x3_cmp = builder.build_int_compare(EQ, x3, i64_type.const_int(0, false), "if");
    let x5_cmp = builder.build_int_compare(EQ, x5, i64_type.const_int(0, false), "if");
    let x15_cmp = builder.build_int_compare(EQ, x15, i64_type.const_int(0, false), "if");
    let fb_then_bb = context.append_basic_block(function, "fb_then");
    let con_1_bb = context.append_basic_block(function, "con_1");
    let con_2_bb = context.append_basic_block(function, "con_2");
    let f_else_bb = context.append_basic_block(function, "f_else_if");
    let b_else_bb = context.append_basic_block(function, "b_else");
    let cont_bb = context.append_basic_block(function, "ifcont");
    builder.build_conditional_branch(x15_cmp, fb_then_bb, con_1_bb);

    builder.position_at_end(fb_then_bb);
    builder.build_call(
        printf_function,
        &[fb_string_ptr.as_pointer_value().into()],
        "c_fb",
    );
    builder.build_unconditional_branch(cont_bb);

    builder.position_at_end(con_1_bb);
    builder.build_conditional_branch(x3_cmp, f_else_bb, con_2_bb);

    builder.position_at_end(f_else_bb);
    builder.build_call(
        printf_function,
        &[f_string_ptr.as_pointer_value().into()],
        "c_f",
    );
    builder.build_unconditional_branch(cont_bb);

    builder.position_at_end(con_2_bb);
    builder.build_conditional_branch(x5_cmp, b_else_bb, cont_bb);

    builder.position_at_end(b_else_bb);
    builder.build_call(
        printf_function,
        &[b_string_ptr.as_pointer_value().into()],
        "c_b",
    );
    builder.build_unconditional_branch(cont_bb);

    builder.position_at_end(cont_bb);
    builder.build_return(Some(&null));

    // module.print_to_file("main.ll");
    let e = module.create_jit_execution_engine(OptimizationLevel::None)?;
    unsafe {
        let x = 6u64;
        e.get_function::<unsafe extern "C" fn(u64) -> ()>("fizzbuzz")?
            .call(x);
    }
    Ok(())
}
```

# JSをパース

```rust
#[macro_use]
extern crate swc_common;
extern crate swc_ecma_parser;
extern crate swc_ecma_ast;

use std::path::Path;

use swc_common::sync::Lrc;
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap,
};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_ast::{Lit, Number};
use swc_ecma_ast::Lit::Num;

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler =
        Handler::with_tty_emitter(ColorConfig::Auto, true, false,
        Some(cm.clone()));

    // Real usage
    let fm = cm
        .load_file(Path::new("./src/test.js"))
        .expect("failed to load test.js");
    // let fm = cm.new_source_file(
    //     FileName::Custom("test.js".into()),
    //     "function foo() {}".into(),
    // );
    let lexer = Lexer::new(
        // We want to parse ecmascript
        Syntax::Es(Default::default()),
        // JscTarget defaults to es5
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    let _module = parser
        .parse_module()
        .map_err(|mut e| {
            // Unrecoverable fatal error occurred
            e.into_diagnostic(&handler).emit()
        })
        .expect("failed to parser module");
}
```

# 四則演算のJSをパース

```rust
extern crate inkwell;
extern crate swc_common;
extern crate swc_ecma_ast;
extern crate swc_ecma_parser;

use inkwell::context::Context;
use inkwell::OptimizationLevel;
use std::error::Error;
use std::path::Path;
use swc_common::sync::Lrc;
use swc_common::{
    errors::{ColorConfig, Handler},
    SourceMap,
};
use swc_ecma_ast::Lit::Num;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

fn main() -> Result<(), Box<dyn Error>> {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    let fm = cm
        .load_file(Path::new("./src/test.js"))
        .expect("failed to load test.js");
    let lexer = Lexer::new(
        Syntax::Es(Default::default()),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);
    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }
    let _module = parser
        .parse_module()
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("failed to parser module");

    let context = Context::create();
    let module = context.create_module("main");
    let builder = context.create_builder();
    for b in _module.body {
        if b.is_stmt() {
            let stmt = b.stmt().unwrap();
            if stmt.is_expr() {
                let expr_stmt = stmt.expr().unwrap();
                let expr = expr_stmt.expr;
                if expr.is_bin() {
                    let bin_expr = expr.bin().unwrap();
                    let left_expr = bin_expr.left;
                    let right_expr = bin_expr.right;
                    let binary_op = bin_expr.op;
                    if left_expr.is_lit() && right_expr.is_lit() {
                        let left_lit = left_expr.lit().unwrap();
                        let right_lit = right_expr.lit().unwrap();
                        let left_value = match left_lit {
                            Num(n) => n.value,
                            _ => 0f64,
                        };
                        let right_value = match right_lit {
                            Num(n) => n.value,
                            _ => 0f64,
                        };
                        let i64_type = context.i64_type();
                        let void_type = context.void_type();
                        let fn_type = void_type.fn_type(&[], false);
                        let function = module.add_function("main", fn_type, None);
                        let basic_block = context.append_basic_block(function, "entry");
                        builder.position_at_end(basic_block);
                        let x = i64_type.const_int(left_value as u64, true);
                        let y = i64_type.const_int(right_value as u64, true);
                        let result = match binary_op {
                            swc_ecma_ast::BinaryOp::Add => builder.build_int_add(x, y, "main"),
                            swc_ecma_ast::BinaryOp::Sub => builder.build_int_sub(x, y, "main"),
                            swc_ecma_ast::BinaryOp::Div => {
                                builder.build_int_signed_div(x, y, "main")
                            }
                            swc_ecma_ast::BinaryOp::Mul => builder.build_int_mul(x, y, "main"),
                            _ => i64_type.const_int(0u64, true),
                        };
                        builder.build_return(Some(&result));
                        let e = module.create_jit_execution_engine(OptimizationLevel::None)?;
                        unsafe {
                            let r = e
                                .get_function::<unsafe extern "C" fn() -> u64>("main")?
                                .call();
                            println!("{:?}", r);
                        }
                    }
                }
            }
        }
    }
    Ok(())
}
```

# 終わりに
