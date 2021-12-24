---
title: Markdownで執筆するなら、WebComponentsが使えるSSG、Rocketがお勧め
published: true
date: 2021-12-24
description: Markdownでブログやドキュメントを書いていますか？執筆活動に集中したいのに、Markdownだけだとかゆいところに手が届かないもどかしさ、感じたことありませんか？そんな方に、MarkdownとWebComponentsがシームレスに統合できる静的サイトジェネレータ(以降、SSGと呼ぶ)、Rocketをおすすめします。
tags: ["Markdown", "Rocket", "Modern Web", "SSG", "Web Components", "Writing"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1640308914/silver-birder.github.io/blog/rocket_homepage.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1640308914/silver-birder.github.io/blog/rocket_homepage.png
---

Markdownでブログやドキュメントを書いていますか？
執筆活動に集中したいのに、Markdownだけだとかゆいところに手が届かないもどかしさ、感じたことありませんか？

そんな方に、MarkdownとWebComponentsがシームレスに統合できる静的サイトジェネレータ(以降、SSGと呼ぶ)、Rocketをおすすめします。

## 対象読者

* SSGでWebサイト構築している人
* (ブログなど)執筆活動に集中したい人
  * 執筆に、Markdownを利用している
* SSGの移行コストを極力減らしたい人

## そもそも、Markdownって何？

Markdownは、QiitaやZenn、Hatenaなどの各サービス(以降、執筆サービスと呼ぶ)、に使われていたり、Gitリポジトリの説明書としてREADME.mdを書いたりしますよね。

そのMarkdownですが、どういう目的で作られたモノなのでしょうか。

[Daring Fireball: Markdown](https://daringfireball.net/projects/markdown/) から引用します。

> Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML).

Markdownは、**Webライター**向けに開発されたTextからHTMLへ変換するためのツールです。
また、Markdownには**書きやすさ、読みやすさが大切**です。

Webライターは、ブログ記事やネット広告の文章など、Web向けコンテンツを執筆する人です。
そう、**執筆**です。Markdownは、執筆のための道具です。

そのため、ブログ記事やGitリポジトリの説明書にMarkdownを用いるのは、目的に合っています。
逆に、構造的な特徴を利用して、一種のデータファイルとしてMarkdownを使ったり、ショッピングやゲームといったアプリケーションにMarkdownを使うのは、目的に反します。

## MarkdownとHTML

Markdownには、見出しや箇条書き、テーブルなどの記法(シンタックス)があります。
これらの記法を用いて、構造的に記事を書くことができます。

執筆で欲しい記法がなかった場合は、どうしたら良いでしょうか。

[Daring Fireball: Markdown Syntax Documentation](https://daringfireball.net/projects/markdown/syntax) より引用します。

> For any markup that is not covered by Markdown’s syntax, you simply use HTML itself. There’s no need to preface it or delimit it to indicate that you’re switching from Markdown to HTML; you just use the tags.

MarkdownにはHTMLが使えます。執筆サービスのMarkdownプレビューで、HTMLを書いてみると、恐らく使えるはずです。

MarkdownはHTMLへ変換するという目的を考えると、HTMLが使用できるというのは納得できると思います。
ただし、**HTMLを使用することで、読みやすさや書きやすさは少し悪くなってしまうため、多用は避けなければいけません**。

## HTMLでは物足りない

執筆サービスを使ってみるとわかると思いますが、おおよそ次の機能が提供されています。

* 埋め込み(Embed)コンテンツ
  * URLを書くと、Descriptionやタイトル、画像を表示してくれる
* 目次(TOC)生成
  * 文章の見出しを収集し、目次を生成してくれる

これらは、記法というより機能だと、私は思うので、Markdownの標準記法に求めるつもりはありません。

しかし、執筆をしていくと、**どうしても欲しくなってきます**。
それら機能がなくても、Markdown記法を駆使すれば、埋め込みコンテンツっぽく表示できますし、目次も手動で生成できます。
ただ、本来執筆に集中したいのに、見出しが増えるたびに、目次を手動更新するというのは、非効率的です。

その非効率、どうしたら良いでしょうか。

### 案1. MarkdownからHTMLへの変換処理で、機能拡張する

案1は、MarkdownからHTMLへの変換処理で、埋め込みコンテンツや目次生成といった機能を拡張します。
具体的な話をした方が分かりやすいと思うので、目次生成を例にして、説明します。

説明しやすいために自前で変換処理を書きますが、本来は、HugoやGatsbyJS、MDXなどを想定しています。

[MarkdownをHTMLに変換する · JavaScript Primer #jsprimer](https://jsprimer.net/use-case/nodecli/md-to-html/) がちょうど分かりやすかったので参考にします。

Markdownと変換処理のtransform.jsを、次のものとします。

```markdown
<!-- README.md -->
# Header1
Hello, World
```

```javascript
// transform.js
const fs = require("fs");
const { marked } = require("marked"); // markdownをhtmlへ変換してくれる

const markdown = fs.readFileSync("README.md", { encoding: 'utf-8' });
const html = marked(markdown);
console.log(html);
```

transform.jsは、とてもシンプルです。README.mdをhtmlに変換して標準出力するだけです。
実行してみましょう。

```bash
$ node transform.js
<h1 id="header1">Header1</h1>
<p>Hello, World</p>
```

期待通り、HTMLが出力されました。次は、目次生成です。
はてなブログでは、目次生成に `[:contents]` というマーカーを書くと、そこが目次となります。
脱線ですが、[remark](https://github.com/remarkjs/remark) という、Markdownに変換処理をしてくれるツールがあります。

目次生成のサンプルコードを書いていきます。

```markdown
<!-- README.md -->
[:contents]

# Header1
Hello, World
```

```javascript
// transform.js
const fs = require("fs");
const { marked } = require("marked"); // markdownをhtmlへ変換してくれる

const markdown = fs.readFileSync("README.md", { encoding: 'utf-8' });
reMarkdown = markdown
             // TODO: replaceの第2引数の固定を動的に設定
             .replace(/\[:contents\]/g, '<div id="toc"><ul><li>Header1</li></ul></div>');
const html = marked(reMarkdown);
console.log(html);
```

とても馬鹿げているコードだと思いますが、伝えたいことが書けているので、これで良いです。
実行してみます。

```bash
$ node transform.js
<div id="toc"><ul><li>Header1</li></ul></div>

<h1 id="header1">Header1</h1>
<p>Hello, World</p>
```

期待通り、Markdownの目次(toc)が生成されています。
これは簡単な例ですが、機能拡張していくと、transform.jsの処理が増えたり、README.mdにマーカーがたくさん書かれていきます。

このように変換処理に機能拡張するのは、変換処理に機能を一任できるというメリットがあります。
ですが、**Markdownが変換処理に依存してしまう**こととなってしまいます。
これは、変換処理を違うものへ移行するときに**移行コスト**が発生してしまいます。(例えば、HugoからGatsbyJSに移行)

また、Markdown自体に、**Markdown記法やHTMLでもないマーカーを埋める**というのも、ちょっと違和感を感じます。

### 案2. WebComponentsで、機能拡張する

WebComponentsは、Web標準技術の1つで、HTML要素を独自にカスタマイズできる機能(Custom Elements)があります。
例えば、目次生成するためのHTML要素、`<view-toc>`をWebComponentsで開発したとします。
このHTML要素は、全ての見出しテキストを収集し、箇条書きで表示するだけのWebComponentsだとします。

Markdownのイメージは、次のとおりになります。

```markdown
<!-- README.md -->
<view-toc />

# Header1
Hello, World
```

このMarkdownを、任意のHTML変換処理(さきほどのtransform.jsでも可)をすると、次の結果になります。

```html
<view-toc />

<h1 id="header1">Header1</h1>
<p>Hello, World</p>
```

MarkdownはHTMLを許容するため、view-tocタグが、そのままHTML出力されます。
このままだと、ブラウザが `view-toc` を識別できません。そのため、`view-toc`を定義したコード、つまりWebComponentsを読み込む必要があります。
例えば、次のようなコードを読み込みます。

```html
<script>
  class ViewToc extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({mode: 'open'});
      // TODO: 見出しを収集し、箇条書きのHTMLを構築する処理
      shadow.innerHTML = `<div id="toc"><ul><li>Header1</li></ul></div>`;
    }
  }
  customElements.define('view-toc', ViewToc);
</script>
```

これで、ブラウザは `view-toc`を識別できるようになったため、期待通り目次が表示されます。

WebComponentsを利用するメリットは、**変換処理に依存せずWebComponentsに依存します**。ブラウザの標準技術に依存するというのは、全く問題ありません。
変換処理の移行をしても、WebComponentsのコードがあれば、同じ動作が実現できます。

また、再掲ですが、Markdownに次の文章があったとしても、Markdownの仕様に反しません。

```markdown
<!-- README.md -->
<view-toc />

# Header1
Hello, World
```

Markdownの目的や仕様、Webというプラットフォームを考慮すると、MarkdownとWebComponentsの組み合わせは、相性が良いと思います。

## ようやく登場、Rocket

お待たせしました、ようやくRocketの登場です。

Rocketは、MarkdownとWebComponentsをシームレスに統合できるSSGです。
Modern Web と呼ばれるWeb標準技術の開発支援を行うプロジェクトがあり、その中のサブプロジェクトとして[rocket](https://rocket.modern-web.dev/)があります。
他のサブプロジェクトとして、[テストランナー](https://modern-web.dev/docs/test-runner/overview/)と[開発サーバー](https://modern-web.dev/docs/dev-server/overview/)の[modern-web](https://modern-web.dev/)、WebComponentsの開発、テスト、リンターなどの[open-wc](https://open-wc.org/)があります。

Rocketの事例は、次のものがあります。

* https://modern-web.dev/
* https://rocket.modern-web.dev/
* https://open-wc.org/
* https://apolloelements.dev/

### Modern Web って？

Javascriptを使って開発すると、Babelのトランスパイラ、ESLintのリンター、Jestのテスター、Webpackのビルダーなど、扱うツールが多く、必要以上に複雑になり、開発者は疲弊してしまいます。
本来、開発に注力すべきなのに、それらの複雑さによって、アジリティ低下につながることを、開発者は知っています。

そこで、WebComponentsや、ESModulesといったWeb標準技術で開発することで、複雑さといったものを軽減していく狙いが、Modern Webにはあります。

※ JSDOMのようなブラウザAPIをモックすることでテストするのではなく、本来動いているブラウザでテストするテストランナーもあります。

Modern Webは、そういったWeb標準技術の開発を支援します。

## Rocketの技術構成

Rocketは、EleventyというSSGのWrapperになります。
Eleventyは、MarkdownをHTMLへ変換してくれます。Rocketは、そのEleventyにModern Webの技術(WebComponents,TestRunner,DevServer)を混ぜています。

Eleventyには、テンプレートに独自の制御プログラムを書けるテンプレートエンジンとして、Numjucksを採用しています。
Numjucksで、HTMLを柔軟に書き換えられますが、私はあまり好みません。理由は、**そのテンプレートエンジンにどっぷり依存してしまう**からです。
できれば、(ケースバイケースですが) WebComponentsで書いた方が良いと思っています。

## Rocketの特徴

[Rocketのホームページ](https://rocket.modern-web.dev/)に、Rocketの特徴を6つ書いてあります。
しかし、本記事の流れ的にMarkdownとWebComponentsの統合についてを説明すべきだと思うので、次の1つだけ特徴を紹介して、その他は割愛します。

* Meta Framework
  * Build on top of giants like Eleventy, Rollup, and Modern Web.

Eleventyや(話題にしていませんでしたが)Rollup、Modern Webという巨人の肩に乗ることで、Rocketの魅力があると思っています。

これまでの話で、『EleventyでMarkdownをHTMLに変換して、WebComponentsを読み込ませればよいでしょ？Rocket必要？』と思う方がいるかもしれません。実際、その2つだけあれば充分だと思います。

ただ、Modern Webというプロジェクト支援があると、開発アジリティは向上します。
具体的には、MarkdownやJavascript変更による自動リロード、[Eleventyの画像変換処理](https://www.11ty.dev/docs/plugins/image/)、[Markdownのリンク先チェック](https://rocket.modern-web.dev/docs/tools/check-html-links/)などがあります。
まあ、必須ではないので EleventyとWebComponentsでも良いと思いますが、私はRocketを使います。

## Markdown Javascript

MarkdownとWebComponentsの統合について説明します。

Rocketには、Markdown Javascriptという機能があります。これは内部的にMDJSというライブラリを使っています。
以下に、MDJSについてのInfoQの記事がありますので、よければご参照ください。

* [新しいMDJSマークアップ言語によりJavaScriptをMarkdownに追加してインタラクティブなドキュメント作成が可能に](https://www.infoq.com/jp/news/2020/08/mdjs-markdown-web-components/)

Markdown Javascriptは、MarkdownにJavascriptを記入でき、インタラクティブに実行できる機能を備えています。
例えば、次のようなMarkdownを書いたとします。

````markdown
```js script
console.log('Hello, World');
```
````

これを書いて、Rocketで実行すると、ブラウザの開発ツールのコンソール画面に `Hello, World`と表示されます。
これを応用して、WebComponentsを定義することもできます。

````markdown
```js script
class MyDiv extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `Hello, World`;
  }
}

customElements.define('my-div', MyDiv);
```

<my-div></my-div>
````

これをRocketで実行すると、画面に `Hello World` と表示されます。
このように、Markdown上にWebComponentsを定義し、インタラクティブに実行されるため、**即座にWebComponentsを使うことができます**。

使い捨てのWebComponentsであればこれで良いのですが、使いまわしたいときがあると思います。
そういう場合は、共通する箇所にWebComponentsを定義するのが良いでしょう。
Numjucksのscriptヘッダに、共通化したいWebComponentsを書いてあげると、どのMarkdownからでも定義したWebComponentsを使えます。

### Bare Importのサポート

Rocketは、Modern Webの[開発サーバー](https://modern-web.dev/docs/dev-server/overview/)を内部で使用しています。開発サーバーには、[Bare Importをサポートしています](https://modern-web.dev/blog/introducing-modern-web/#highlights-1)。

Bare Importの例を示します。
次のMarkdownは、事前に `npm install canvas-confetti` インストールしていることを前提とした場合、`confetti()`が実行されます。

````markdown
```js script
import confetti from 'canvas-confetti';
confetti();
```
````

このように、相対パスや絶対パスを意識せずBareで指定できるようになります。
ちなみに、canvas-confttiは、紙吹雪を出してくれます。見たほうが早いと思うので、押したら紙吹雪が出るボタンを下に表示しますね。

<button id="trigger">Click Me!</button>

```js script
import confetti from 'canvas-confetti';
document.querySelector('#trigger').addEventListener('click', () => {
    confetti();
});

```

### WebComponentsのコミュニティからライブラリを使う

独自にWebComponentsを書かなくても、次のWebComponentsのコミュニティサイトから良さそうなものを使うこともできます。

* [webcomponents.org](https://www.webcomponents.org/)

例えば、[emoji-picker-element](https://www.webcomponents.org/element/emoji-picker-element)というWebComponentsを使ってみたいとします。emoji-picker-elementは、絵文字キーボードのUIに似ています。Macなら、command + control + スペースキー で表示されます。

使い方は、簡単です。
先ほどと同じく、`npm install emoji-picker-element` でインストールしておけば、次のMarkdownを書くだけで `<emoji-picker-element>`が使えます。

````markdown
```js script
import 'emoji-picker-element';
```

<emoji-picker></emoji-picker>
````

`<emoji-picker-element>`を下に出しておきますね。

```js script
import 'emoji-picker-element';
```

<emoji-picker></emoji-picker>

## 宣伝

WebComponentsについての入門書をAmazonで、500円で販売しています。
今回のRocketについては書いていませんが、[open-wc](https://open-wc.org/)のテストについて触れています。

* [はじめてのWeb Components入門: 4つの基本機能から関連ライブラリまで](https://www.amazon.co.jp/gp/product/B08CY2QCFV/)

また、私のポートフォリオページをRocketで作成しています。このブログもMarkdownで執筆しています。よければご覧ください。

* [silverbirder's page](https://silver-birder.github.io/)
  * このブログのMarkdownファイルは、[こちら](https://github.com/Silver-birder/Silver-birder.github.io/blob/main/docs/blog/contents/intro_rocket.md)

## 終わりに

Rocketの紹介が、随分と後ろの方になってしまいました。前置きが長すぎたかもしれません。
少しでも誰かのお役に立てればと思います。