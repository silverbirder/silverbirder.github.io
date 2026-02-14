---
title: 'ブラウザの仕組みを学ぶ'
publishedAt: '2021-05-24'
summary: 'Webフロントエンジニアたるもの、ブラウザの仕組みに興味を持つのは自然の摂理です。本記事では、私がブラウザの仕組みを学んでいく過程を備忘録として残します。'
tags: ["ブラウザ"]
index: false
---

Web フロントエンジニアたるもの、 **ブラウザの仕組みに興味を持つのは自然の摂理** です。本記事では、私がブラウザの仕組みを学んでいく過程を備忘録として残します。

## みんな大好き Chrome

Web フロントエンジニアに愛されているブラウザといえば、~~IE~~Chrome ですよね。
ブラウザで HTML,CSS,JS の動作確認するのは、日常茶飯事です。
ブラウザによって動作が異なることは、Web フロントエンジニアなら周知の事実です。
じゃあ、なんで動作が違うのかというと、

- 「レンダリングエンジンが違うから〜」
- 「Javascript エンジンが違うから〜」

ぐらいは知っているんじゃないかなと思います。
じゃあ、そのレンダリングエンジンってどういう仕組みで動いているのでしょうか。
気になりますよね。

## Chromium について

Chromium も、たぶんご存じの方多いのかなと思いますので、簡単に説明します。

Chromium は、オープンソースのプロジェクト名であり、ブラウザ名でもあります。
Chrome は、Chromium を元に開発されています。
詳しい説明は[Chromium - Wiki](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>)を見てください。

オープンソースってことは、ソースコードが誰でも読めちゃうってことですよね。
だったら、ブラウザの動作を知ることができちゃうじゃないですか！
わーい！😎

## Chromium のリバースエンジニアリング

ではさっそく、Chromium のソースコードを見ていきましょう。

これです。

[![chromium/src](https://res.cloudinary.com/silverbirder/image/upload/v1622126149/silver-birder.github.io/blog/chromium_src.png)](https://source.chromium.org/chromium/chromium/src)

[Chromium - Wiki](<https://en.wikipedia.org/wiki/Chromium_(web_browser)>)によれば、Chromium のソースコードは約 3,500 万行あるそうです。
しかも、言語は C++。私はあまりそれを詳しくないのです 😞。

実際にソースコードをローカルマシン(Macbook Air)へチェックアウトし、ビルドをしてみました。
マシンが貧弱だというのもあるんですが、ビルドに半日ぐらいかかってしまいました。ヘトヘトです。
これじゃあさすがに、手軽にブラウザの動作確認はできそうにないです。

## ブラウザの仕組み資料を読む

ちょっと趣向を変えて、次のような資料を読むことにしました。

- [ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)
  - 記事の公開日が 2011 年 8 月 5 日なので、色々古いかもしれません。

では、さっそく見ていきます。
最初に目につくのが、ブラウザの主な構成要素です。

[![ブラウザの主な構成要素](https://res.cloudinary.com/silverbirder/image/upload/v1656253204/silver-birder.github.io/blog/%E3%83%95%E3%82%99%E3%83%A9%E3%82%A6%E3%82%B5%E3%82%99%E3%81%AE%E6%A7%8B%E6%88%90%E8%A6%81%E7%B4%A0.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

構成要素の内、ユーザーインターフェース、ブラウザエンジン、レンダリングエンジンに着目します。
それぞれ、次の役割があります。

- ユーザーインターフェース
  - アドレスバーや戻る/進むボタンのような UI を担当
- ブラウザエンジン
  - UI とレンダリングエンジンの間の処理を整理
- レンダリングエンジン
  - 要求されたコンテンツ(HTML など)の表示を担当

ちなみに、Chromium のレンダリングエンジンには、webkit を使っていましたが、blink に変わりました。

- [webkit](https://webkit.org/)
- [blink](https://www.chromium.org/blink)

ブラウザの基本的なフローは、次の図の通りです。

[![レンダリングの基本的なフロー](https://res.cloudinary.com/silverbirder/image/upload/v1656253204/silver-birder.github.io/blog/%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%99%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%99%E3%82%A8%E3%83%B3%E3%82%B7%E3%82%99%E3%83%B3%E5%9F%BA%E6%9C%AC%E3%83%95%E3%83%AD%E3%83%BC.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

[![Webkitのメインフロー](https://res.cloudinary.com/silverbirder/image/upload/v1656253203/silver-birder.github.io/blog/Webkit%E3%81%AE%E3%83%A1%E3%82%A4%E3%83%B3%E3%83%95%E3%83%AD%E3%83%BC.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

1. Parsing HTML to construct the DOM tree
1. Render tree construction
1. Layout of the render tree
1. Painting the render tree

それぞれ見ていきます。

---

① Parsing HTML to construct the DOM tree

1 は、HTML をレキサ(字句解析. ex:flex)・パーサ(構文解析. ex:bison)を使って DOM ツリーを構築します。

レキサでは、ステートマシンによって読み込み状態を管理しつつトークンを識別します。空白とかコメントなどは削除されます。

レキサから識別されたトークンをパーサに渡し、構文解析していきます。
HTML は DTD（Document Type Definition）で文脈自由文法なため、機械的に解析できます。
ただ、HTML は寛大な仕様で、次のようなパターンも許容するようになっています。

- `<br />`の代わりの`</br>`
- 迷子のテーブル
- 入れ子のフォーム要素
- 深すぎるタグ階層
- 配置に誤りのある html または body 終了タグ

パーサから DOM（Document Object Model）を構築します。
DOM は、これまでの単なるテキストから、API を持たせたオブジェクトモデルを作ることで、
以降は DOM を使って処理しやすくなります。

[![サンプル マークアップのDOMツリー](https://res.cloudinary.com/silverbirder/image/upload/v1656253203/silver-birder.github.io/blog/%E3%82%B5%E3%83%B3%E3%83%95%E3%82%9A%E3%83%AB%E3%83%9E%E3%83%BC%E3%82%AF%E3%82%A2%E3%83%83%E3%83%95%E3%82%9A%E3%81%AEDOM%E3%83%84%E3%83%AA%E3%83%BC.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

これまでは HTML の話をしていましたが、HTML と並行して CSS も同様に処理していきレンダーオブジェクトというオブジェクトを作っていきます。これは、スタイル情報を付与したオブジェクトになります。
基本的に、CSS と HTML は互いに独立しているので、並列処理が可能です。例えば、CSS を処理したことで、HTML が変化することはないはずです。

[![CSSの解析](https://res.cloudinary.com/silverbirder/image/upload/v1656253203/silver-birder.github.io/blog/CSS%E3%81%AE%E8%A7%A3%E6%9E%90.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

ただ、Javascript は話が違うので、Javascript が読み込まれた時点で HTML のパースを中断して Javascript のパースが開始されます。
また、Javascript が、まだ読み込まれていないスタイルシートの影響を受けそうな特定のスタイルプロパティにアクセスした場合、Javascript はブロックされます。

---

② Render tree construction

① の DOM とレンダーオブジェクトから、レンダーツリーを構築します。
DOM とレンダーオブジェクトは、1 対 1 という訳ではなく、例えば head 要素や、`display:none;`の要素もレンダーツリーに含まれません。
レンダーツリーの更新は、DOM ツリーが更新される度に行われます。

[![レンダーツリーと対応するDOMツリー](https://res.cloudinary.com/silverbirder/image/upload/v1656253203/silver-birder.github.io/blog/%E3%83%AC%E3%83%B3%E3%82%BF%E3%82%99%E3%83%BC%E3%83%84%E3%83%AA%E3%83%BC%E3%81%A8%E5%AF%BE%E5%BF%9C%E3%81%99%E3%82%8BDOM%E3%83%84%E3%83%AA%E3%83%BC.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

レンダーオブジェクトからスタイルを計算するのですが、ちょっと複雑です。
詳しくは、[スタイルの計算](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/#Style_Computation)を見てください。

---

③ Layout of the render tree

レンダーツリーから、レイアウト情報を計算していきます。
レイアウト情報とは、位置(x,y)とサイズ(width,height)です。

レンダーツリーのルートから再帰的にレイアウト情報を計算(layout メソッド)していきます。

1. 親レンダラーが自身の幅を決定します。
1. 親が子を確認して、
   1. 子レンダラーを配置します（x と y を設定します）。
   1. 必要な場合は子の layout メソッドを呼び出します。これにより、子の高さを計算します。
1. 親は子の高さの累積、マージンの高さ、パディングを使用して、自身の高さを設定します。この高さは親レンダラーのさらに親によって使用されます。

※ [レイアウト処理](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/#The_layout_process) 参考

CSS ボックスモデルの図を参考までに共有しておきます。

[![CSS 基本ボックスモデル](https://res.cloudinary.com/silverbirder/image/upload/v1693363991/silver-birder.github.io/blog/boxmodel.png)](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model)

---

④ Painting the render tree

ようやく描画します。
どこに描画するかという配置方法について考えることになります。
大きく分けて、3 つに分かれます。

- 通常
  - オブジェクトはドキュメント内の場所に従って配置されます。つまり、レンダーツリー内の場所は DOM ツリー内の場所と同様になり、ボックスの種類や寸法に従ってレイアウトされます。
    - position:static,relative
- フロート
  - オブジェクトは最初に通常のフローのようにレイアウトされてから、左右のできるだけ遠くに移動されます。
    - float:right,left
- 絶対
  - オブジェクトはレンダーツリー内で DOM ツリーとは異なる場所に配置されます。
    - position:absolute,fixed

※ [配置方法](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/#Positioning_scheme)

配置方法が分かれば、今度は描画する形について考えます。ブロックボックスとインラインボックスです。

[![ブロックとインラインの配列](https://res.cloudinary.com/silverbirder/image/upload/v1656253203/silver-birder.github.io/blog/%E3%83%95%E3%82%99%E3%83%AD%E3%83%83%E3%82%AF%E3%81%A8%E3%82%A4%E3%83%B3%E3%83%A9%E3%82%A4%E3%83%B3%E3%81%AE%E9%85%8D%E5%88%97.png)](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/)

ブロックボックスは、短形の形であり垂直に並びます。
インラインボックスは、独自の形を持たず水平に並びます。

z-index のようなプロパティでは、スタッキングコンテキストという概念を知る必要があります。
詳しくは、[重ね合わせコンテキスト - developer.mozilla.org](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) をご確認ください。

---

## ブラウザを自作してみる

前章では、資料を通してブラウザの動作が理解できました。
読むだけじゃなく、動かして理解してみたいとは思いませんか？
そうです、自作してみましょう。

Rust 製の Servo というブラウザエンジンを開発している人が書いた、次のブラウザ自作に関する記事がとても分かりやすいです。

- [Let's build a browser engine! Part 1: Getting started](https://limpet.net/mbrubeck/2014/08/08/toy-layout-engine-1.html)
  - [mbrubeck/robinson](https://github.com/mbrubeck/robinson)
    - Toy ブラウザエンジン(mbrubeck)
    - Rust 製

Toy ブラウザエンジン(mbrubeck)のメインフローが、これまでの話ととても似ています。

[![Toyブラウザエンジン(mbrubeck)のメインフロー](https://res.cloudinary.com/silverbirder/image/upload/v1622034177/silver-birder.github.io/blog/mbrubeck_toy-layout-engine-7-painting.png)](https://limpet.net/mbrubeck/2014/11/05/toy-layout-engine-7-painting.html)

Style tree は、これまでの話でいうと Render tree だと思います。
Toy ブラウザエンジン(mbrubeck)に、次の HTML と CSS を読み込ませると、下記の画像のようなアウトプットになります。

```html
<html>
  <head>
    <title>Test</title>
  </head>
  <div class="outer">
    <p class="inner">Hello, <span id="name">world!</span></p>
    <p class="inner" id="bye">Goodbye!</p>
  </div>
</html>
```

```css
* {
  display: block;
}

span {
  display: inline;
}

html {
  width: 600px;
  padding: 10px;
  border-width: 1px;
  margin: auto;
  background: #ffffff;
}

head {
  display: none;
}

.outer {
  background: #00ccff;
  border-color: #666666;
  border-width: 2px;
  margin: 50px;
  padding: 50px;
}

.inner {
  border-color: #cc0000;
  border-width: 4px;
  height: 100px;
  margin-bottom: 20px;
  width: 500px;
}

.inner#bye {
  background: #ffff00;
}

span#name {
  background: red;
  color: white;
}
```

[![Toyブラウザエンジン(mbrubeck)のアウトプット](https://res.cloudinary.com/silverbirder/image/upload/v1622034247/silver-birder.github.io/blog/mbrubeck_robinson_output.png)](https://github.com/mbrubeck/robinson)

次のリンクにある自作ブラウザエンジンは、[mbrubeck/robinson](https://github.com/mbrubeck/robinson)を参考にして作られたものだそうです。

- [askerry/toy-browser](https://github.com/askerry/toy-browser)
  - Toy ブラウザエンジン(askerry)
  - C++製

Toy ブラウザエンジン(askerry)に、次の HTML と CSS を読み込ませると、下記の画像のようなアウトプットになります。
見たら分かると思いますが、とても高機能です。

```html
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Browser Test</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" href="demo.css" />
  </head>

  <body>
    <div id="page">
      <header class="header">
        <h1>Toy Browser Engine</h1>
      </header>
      <div id="main">
        <div id="navbar">
          <a href="#" class="navitem"> Home </a>
          <a href="#" class="navitem"> About </a>
          <a href="#" class="navitem"> Some random stuff </a>
          <a href="#" class="navitem"> Conclusion </a>
          <img class="img" src="images/otters.jpg" />
        </div>
        <div id="content">
          <h2>What is this?</h2>
          This is a <b>toy</b> browser engine, implemented for
          <span>fun </span> <img class="icon" src="images/fun.png" /> and
          <span>glory <img class="icon" src="images/glory.png" /></span>.
          <h2>Why would anyone do this?</h2>
          This seems pretty pointless! But I had a few goals:
          <ul>
            <li>Something to build to learn C++</li>
            <li>Learn more about how browsers work</li>
            <li>Make something I've never made before</li>
          </ul>
          <h2>What can it do?</h2>
          <p>
            Currently, the engine can parse a subset of HTML and build a DOM
            tree. It can also parse a small subset of CSS (sometimes
            incorrectly) and use simple selector matching to apply styles to
            elements.
          </p>
          <p>
            It supports <em>very basic</em> rendering of boxes, images, and text
            with simple block and inline layouts.
          </p>
        </div>
      </div>
    </div>
  </body>
</html>
```

```css
/* https://github.com/askerry/toy-browser/blob/master/examples/demo.css */
body {
  font-family: Arial, sans-serif;
  background-color: #bfc0c0;
  color: #253237;
  font-size: 16px;
}
#page {
  padding: 20;
  /* width: 800px; */
  margin: auto;
}

header {
  padding: 10px;
  padding-left: 20px;
  background-color: #434371;
  color: #4acebd;
}

span {
  color: #4acebd;
}

#main {
  background-color: white;
  display: flex;
}

#navbar {
  width: 180px;
  padding: 30px;
  background-color: #4acebd;
  height: 500px;
}

.navitem {
  display: block;
  text-align: center;
  background-color: #434371;
  color: #4acebd;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  border-radius: 4px;
  border-style: solid;
  border-width: 2px;
  border-color: #253237;
}

#content {
  padding: 20px;
  width: 500;
}

.img {
  width: 180px;
}

.icon {
  width: 2em;
}

h2 {
  color: #434371;
}

li {
  margin-bottom: 5px;
}
```

[![Toyブラウザエンジン(askerry)のアウトプット](https://res.cloudinary.com/silverbirder/image/upload/v1693364002/silver-birder.github.io/blog/demo.png)](https://github.com/askerry/toy-browser)

私としては、こちらの方が興味があるので、まずこちらを知り、それを Rust 版で作り直したいなと思います。

## C++ を学ぶ

さて、C++を学ぶために、次のサイトをざっと眺めてみます。

- [C++入門 - www.asahi-net.or.jp](http://www.asahi-net.or.jp/~yf8k-kbys/newcpp0.html)
- [C++入門 - wisdom.sakura.ne.jp](http://wisdom.sakura.ne.jp/programming/cpp/)
- [C++入門 - kaitei.net](http://kaitei.net/cpp/)

## 自作ブラウザのソースコード

[askerry/toy-browser](https://github.com/askerry/toy-browser)のメインコード(main.cc)を載せます。

```c
/* https://github.com/askerry/toy-browser/blob/master/src/main.cc */
namespace {

void renderWindow(int width, int height, const style::StyledNode &sn,
                  sf::RenderWindow *window) {
  layout::Dimensions viewport;
  viewport.content.width = width;
  viewport.content.height = height;
  // Create layout tree for the specified viewport dimensions.
  std::unique_ptr<layout::LayoutElement> layout_root =
      layout::layout_tree(sn, viewport);
  // Paint to window.
  paint(*layout_root, viewport.content, window);
}

int windowLoop(const style::StyledNode &sn) {
  // Create browser window.
  std::unique_ptr<sf::RenderWindow> window(new sf::RenderWindow());
  window->create(sf::VideoMode(FLAGS_window_width, FLAGS_window_height),
                 "Toy Browser", sf::Style::Close | sf::Style::Resize);
  window->setPosition(sf::Vector2i(0, 0));
  window->clear(sf::Color::Black);
  // Render initial window contents.
  renderWindow(FLAGS_window_width, FLAGS_window_height, sn, window.get());
  // Run the main event loop as long as the window is open.
  while (window->isOpen()) {
    sf::Event event;
    while (window->pollEvent(event)) {
      switch (event.type) {
        case sf::Event::Closed:
          window->close();
          break;

        case sf::Event::KeyPressed:
          logger::debug("keypress: " + std::to_string(event.key.code));
          break;

        case sf::Event::Resized:
          logger::debug("new width: " + std::to_string(event.size.width));
          logger::debug("new height: " + std::to_string(event.size.height));
          window->clear(sf::Color::Black);
          renderWindow(event.size.width, event.size.height, sn, window.get());
          break;

        case sf::Event::TextEntered:
          if (event.text.unicode < 128) {
            logger::debug(
                "ASCII character typed: " +
                std::to_string(static_cast<char>(event.text.unicode)));
          }
          break;

        default:
          break;
      }
    }
  }
  return 0;
}
}  // namespace
int main(int argc, char **argv) {
  gflags::ParseCommandLineFlags(&argc, &argv, true);

  // Parse HTML and CSS files.
  const std::string source = io::readFile(FLAGS_html_file);
  std::unique_ptr<dom::Node> root = html_parser::parseHtml(source);
  const std::string css = io::readFile(FLAGS_css_file);
  const std::unique_ptr<css::StyleSheet const> stylesheet = css::parseCss(css);

  // Initialize font registry singleton.
  text_render::FontRegistry *registry =
      text_render::FontRegistry::getInstance();

  // Align styles with DOM nodes.
  std::unique_ptr<style::StyledNode> styled_node =
      style::styleTree(*root, stylesheet, style::PropertyMap());

  // Run main browser window loop.
  windowLoop(*styled_node);

  // Delete styled node and clear font registry.
  styled_node.reset();
  registry->clear();
  return 0;
}
```

次のとおり、これまで学んできたメインフローと、C++がとても似ていることが分かります。

1. HTML と CSS をパース

```c
// Parse HTML and CSS files.
const std::string source = io::readFile(FLAGS_html_file);
std::unique_ptr<dom::Node> root = html_parser::parseHtml(source);
const std::string css = io::readFile(FLAGS_css_file);
const std::unique_ptr<css::StyleSheet const> stylesheet = css::parseCss(css);
```

1. 1 の結果から Style tree(Render tree)を構築

```c
// Align styles with DOM nodes.
std::unique_ptr<style::StyledNode> styled_node =
    style::styleTree(*root, stylesheet, style::PropertyMap());
```

1. 2 の結果から Layout tree を構築

```c
// Create layout tree for the specified viewport dimensions.
std::unique_ptr<layout::LayoutElement> layout_root =
    layout::layout_tree(sn, viewport);
```

1. 3 を paint という描画

```c
// Paint to window.
paint(*layout_root, viewport.content, window);
```

## Re: ブラウザの仕組み資料を読む

もう一度、[ブラウザの仕組み: 最新ウェブブラウザの内部構造](https://www.html5rocks.com/ja/tutorials/internals/howbrowserswork/) を読むと、初めて読んだときに比べて、深く理解できるんじゃないかなと思います。

## 最後に

ブラウザの動作について資料や自作を通して理解を深めました。

ブラウザの動作が分かれば、ブラウザに優しい Web フロントエンド開発ができると思います。

(今度こそ Chromium のリバースエンジニアリングができるかもしれません。)

## その他

Chromium のアドベントカレンダーがありました。参考までにざっと見てみると良いでしょう。
[Chromium Browser Advent Calendar 2017](https://qiita.com/advent-calendar/2017/chromium)
