<!-- 
title: ブラウザの仕組みを学ぶ
date: 2021-05-24T20:28:00+09:00
draft: true
description: 
image: 
icon: 📚
-->

<figure title="Photo by Remotar Jobs on Unsplash">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1621950014/silver-birder.github.io/blog/remotar-jobs-s5kTY-Ve1c0-unsplash.jpg" alt="Photo by Remotar Jobs on Unsplash">
<figcaption><span>Photo by <a href="https://unsplash.com/@remotarjobs?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Remotar Jobs</a> on <a href="https://unsplash.com/s/photos/chrome-browser?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a></span></figcaption>
</figure>

Webフロントエンジニアたるもの、**ブラウザの仕組みに興味を持つのは自然の摂理**です。本記事では、私がブラウザの仕組みを学んでいく過程を備忘録として残します。

# みんな大好きChrome
Webフロントエンジニアに愛されているブラウザといえば、~~IE~~Chromeですよね。
ブラウザでHTML,CSS,JSの動作確認するのは、日常茶飯事です。
ブラウザによって動作が異なることは、Webフロントエンジニアなら周知の事実です。
じゃあ、なんで動作が違うのかというと、

* 「レンダリングエンジンが違うから〜」
* 「Javascriptエンジンが違うから〜」

ぐらいは知っているんじゃないかなと思います。
じゃあ、そのレンダリングエンジンってどういう仕組みで動いているのでしょうか。
気になりますよね。

# Chromiumについて

Chromiumも、たぶんご存じの方多いのかなと思いますので、簡単に説明します。

Chromiumは、オープンソースのプロジェクト名であり、ブラウザ名でもあります。
Chromeは、Chromiumを元に開発されています。
詳しい説明は[Chromium - Wiki](https://en.wikipedia.org/wiki/Chromium_(web_browser))を見てください。

オープンソースってことは、ソースコードが誰でも読めちゃうってことですよね。
だったら、ブラウザの動作を知ることができちゃうじゃないですか！
わーい！😎

# Chromiumのリバースエンジニアリング

ではさっそく、Chromiumのソースコードを見ていきましょう。

これです。

* [source.chromium.org/chromium](https://source.chromium.org/chromium)

他にも参考となるリンクも載せておきます。

* [chromium.org](https://www.chromium.org/Home)
* [chromium.googlesource.com](https://chromium.googlesource.com/)
* [chromium.googlesource.com/docs/](https://chromium.googlesource.com/chromium/src/+/master/docs/README.md)

[Chromium - Wiki](https://en.wikipedia.org/wiki/Chromium_(web_browser))によれば、Chromiumのソースコードは約3,500万行あるそうです。
しかも、言語はC++。私はあまりそれを詳しくないのです😞。

実際にソースコードをローカルマシン(Macbook Air)へチェックアウトし、ビルドをしてみました。
マシンが貧弱だというのもあるんですが、ビルドに半日ぐらいかかってしまいました。ヘトヘトです。
これじゃあさすがに、手軽にブラウザの動作確認はできそうにないです。

# ブラウザの仕組み資料を読む

ちょっと趣向を変えて、次のような資料を読むことにしました。

* [ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)
  * 記事の公開日が2011年8月5日なので、色々古いかもしれません。

では、さっそく見ていきます。
最初に目につくのが、ブラウザの主な構成要素です。

<figure title="ブラウザの主な構成要素">
<img src="https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/layers.png" alt="ブラウザの主な構成要素">
<figcaption><span><a href="https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/">ブラウザの主な構成要素 - www.html5rocks.com</a></span></figcaption>
</figure>

構成要素の内、ユーザーインターフェース、ブラウザエンジン、レンダリングエンジンに着目します。
それぞれ、次の役割があります。

* ユーザーインターフェース
  * アドレスバーや戻る/進むボタンのようなUIを担当
* ブラウザエンジン
  * UIとレンダリングエンジンの間の処理を整理
* レンダリングエンジン
  * 要求されたコンテンツ(HTMLなど)の表示を担当

ちなみに、Chromiumのレンダリングエンジンには、webkitを使っていましたが、blinkに変わりました。

* [webkit](https://webkit.org/)
* [blink](https://www.chromium.org/blink)

ブラウザの基本的なフローは、次の図の通りです。

<figure title="レンダリングの基本的なフロー">
<img src="https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/flow.png" alt="レンダリングの基本的なフロー">
<figcaption><span><a href="https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/">レンダリングの基本的なフロー - www.html5rocks.com</a></span></figcaption>
</figure>

<figure title="Webkitのメインフロー">
<img src="https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/webkitflow.png" alt="Webkitのメインフロー">
<figcaption><span><a href="https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/">Webkitのメインフロー - www.html5rocks.com</a></span></figcaption>
</figure>

1. Parsing HTML to construct the DOM tree
2. Render tree construction
3. Layout of the render tree
4. Painting the render tree

それぞれ見ていきます。

----
① Parsing HTML to construct the DOM tree

1は、HTMLをレキサ(字句解析. ex:flex)・パーサ(構文解析. ex:bison)を使ってDOMツリーを構築します。

レキサでは、ステートマシンによって読み込み状態を管理しつつトークンを識別します。空白とかコメントなどは削除されます。

レキサから識別されたトークンをパーサに渡し、構文解析していきます。
HTMLはDTD（Document Type Definition）で文脈自由文法なため、機械的に解析できます。
ただ、HTMLは寛大な仕様で、次のようなパターンも許容するようになっています。

* \<br\>の代わりの\<\/br\>
* 迷子のテーブル
* 入れ子のフォーム要素
* 深すぎるタグ階層
* 配置に誤りのある html または body 終了タグ

パーサからDOM（Document Object Model）を構築します。
DOMは、これまでの単なるテキストから、APIを持たせたオブジェクトモデルを作ることで、
以降はDOMを使って処理しやすくなります。

これまではHTMLの話をしていましたが、HTMLと並行してCSSも同様に処理していきレンダーオブジェクトというオブジェクトを作っていきます。これは、スタイル情報を付与したオブジェクトになります。
基本的に、CSSとHTMLは互いに独立しているので、並列処理が可能です。例えば、CSSを処理したことで、HTMLが変化することはないはずです。

ただ、Javascriptは話が違うので、Javascriptが読み込まれた時点でHTMLのパースを中断してJavascriptのパースが開始されます。
また、Javascriptが、まだ読み込まれていないスタイルシートの影響を受けそうな特定のスタイルプロパティにアクセスした場合、Javascriptはブロックされます。

----
② Render tree construction

①のDOMとレンダーオブジェクトから、レンダーツリーを構築します。
DOMとレンダーオブジェクトは、1対1という訳ではなく、例えばhead要素や、`display:none;`の要素もレンダーツリーに含まれません。
レンダーツリーの更新は、DOMツリーが更新される度に行われます。

レンダーオブジェクトからスタイルを計算するのですが、ちょっと複雑です。
詳しくは、[スタイルの計算](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/#Style_Computation)を見てください。

----
③ Layout of the render tree

レンダーツリーから、レイアウト情報を計算していきます。
レイアウト情報とは、位置(x,y)とサイズ(width,height)です。

レンダーツリーのルートから再帰的にレイアウト情報を計算(layoutメソッド)していきます。

1. 親レンダラーが自身の幅を決定します。
2. 親が子を確認して、
   1. 子レンダラーを配置します（xとyを設定します）。
   2. 必要な場合は子のlayoutメソッドを呼び出します。これにより、子の高さを計算します。
3. 親は子の高さの累積、マージンの高さ、パディングを使用して、自身の高さを設定します。この高さは親レンダラーのさらに親によって使用されます。

※ [レイアウト処理](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/#The_layout_process) 参考

CSSボックスモデルの図を参考までに共有しておきます。

<figure title="CSS 基本ボックスモデル">
<img src="https://mdn.mozillademos.org/files/8685/boxmodel-(3).png" alt="CSS 基本ボックスモデル">
<figcaption><span><a href="https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model">CSS 基本ボックスモデル - developer.mozilla.org</a></span></figcaption>
</figure>

---
④ Painting the render tree

ようやく描画します。

---

なんとなく、ブラウザの動作が分かったのですが、いまいちピンときていません。
そこで、自作して理解を深めます。

# ブラウザを自作してみる

Rust製のServoというブラウザエンジンを開発している人が書いた記事が、とても参考になります。

* [Let's build a browser engine! Part 1: Getting started](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
  * [mbrubeck/robinson](https://github.com/mbrubeck/robinson)

<figure title="Toyブラウザエンジン(mbrubeck)のメインフロー">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1622034177/silver-birder.github.io/blog/mbrubeck_toy-layout-engine-7-painting.png" alt="Toyブラウザエンジン(mbrubeck)のメインフロー">
<figcaption><span><a href="https://limpet.net/mbrubeck/2014/11/05/toy-layout-engine-7-painting.html">Toyブラウザエンジン(mbrubeck)のメインフロー - limpet.net</a></span></figcaption>
</figure>

<figure title="Toyブラウザエンジン(mbrubeck)のアウトプット">
<img src="https://res.cloudinary.com/silverbirder/image/upload/v1622034247/silver-birder.github.io/blog/mbrubeck_robinson_output.png" alt="Toyブラウザエンジン(mbrubeck)のアウトプット">
<figcaption><span><a href="https://github.com/mbrubeck/robinson">Toyブラウザエンジン(mbrubeck)のアウトプット - github.com/mbrubeck/robinson</a></span></figcaption>
</figure>

なので、これはRustで作られています。
次のリンクにある自作ブラウザエンジンは、C++で書かれていて、さっきのよりも高機能です。

* [askerry/toy-browser](https://github.com/askerry/toy-browser)

<figure title="Toyブラウザエンジン(askerry)のアウトプット">
<img src="https://github.com/askerry/toy-browser/raw/master/examples/demo.png" alt="Toyブラウザエンジン(askerry)のアウトプット">
<figcaption><span><a href="https://github.com/askerry/toy-browser">Toyブラウザエンジン(askerry)のアウトプット - github.com/askerry/toy-browser</a></span></figcaption>
</figure>

私としては、こちらのほうが興味があるので、まずこっちを知り、それをRust版で作り直したいなと思います。

# C++ を学ぶ

さて、C++を学ぶために、次のサイトをざっと眺めてみます。

* [C++入門 - www.asahi-net.or.jp](http://www.asahi-net.or.jp/~yf8k-kbys/newcpp0.html)
* [C++入門 - wisdom.sakura.ne.jp](http://wisdom.sakura.ne.jp/programming/cpp/)
* [C++入門 - kaitei.net](http://kaitei.net/cpp/)

# Re: ブラウザの仕組み資料を読む

もう一度、[ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/) を読むと、初めて読んだときに比べて、深く理解できます。

# 最後に

以上。

# その他

Chromiumのアドベントカレンダーがありました。参考までにざっと見てみると良いでしょう。
[Chromium Browser Advent Calendar 2017](https://qiita.com/advent-calendar/2017/chromium)