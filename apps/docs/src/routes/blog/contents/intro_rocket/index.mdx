---
title: Markdownで執筆するなら、WebComponentsが使えるSSG、Rocketがオススメ！
published: true
date: 2021-12-24
description: Markdownでブログやドキュメントを書いていますか？執筆活動に集中したいのに、Markdownだけだとかゆいところに手が届かないもどかしさ、感じたことありませんか？そんな方に、MarkdownとWebComponentsがシームレスに統合できる静的サイトジェネレータ(以降、SSGと呼ぶ)、Rocketをおすすめします。
tags: ["Markdown", "Rocket", "Modern Web", "SSG", "Web Components", "Writing"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1640308914/silver-birder.github.io/blog/rocket_homepage.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1640308914/silver-birder.github.io/blog/rocket_homepage.png
---

Markdown でブログやドキュメントを書いていますか？
執筆活動に集中したいのに、Markdown だけだとかゆいところに手が届かないもどかしさ、感じたことありませんか？

そんな方に、Markdown と WebComponents がシームレスに統合できる静的サイトジェネレータ(以降、SSG と呼ぶ)、Rocket をおすすめします。

## 対象読者

- (ブログなど)執筆活動に集中したい人
  - 執筆に、Markdown を利用している
- 執筆したコンテンツを SSG で公開している人
- SSG の移行コストを極力減らしたい人

## そもそも、Markdown って何？

Markdown は、Qiita や Zenn、はてなブログなどの各サービス(以降、執筆サービスと呼ぶ)、に使われていたり、Git リポジトリの説明書として README.md を書いたりしますよね。

その Markdown ですが、どういう目的で作られたモノなのでしょうか。

[Daring Fireball: Markdown](https://daringfireball.net/projects/markdown/) から引用します。

> Markdown is a text-to-HTML conversion tool for web writers. Markdown allows you to write using an easy-to-read, easy-to-write plain text format, then convert it to structurally valid XHTML (or HTML).

Markdown は、**Web ライター**向けに開発された PlainText から HTML へ変換するためのツールです。
また、Markdown には**書きやすさ、読みやすさが大切**です。

Web ライターは、ブログ記事やネット広告の文章など、Web 向けコンテンツを執筆する人です。
そう、**執筆**です。Markdown は、執筆のための道具です。

そのため、ブログ記事や Git リポジトリの説明書に Markdown を用いるのは、目的に合っています。
逆に、構造的な特徴を利用して、一種のデータファイルとして Markdown を使ったり、ショッピングやゲームといったアプリケーションに Markdown を使うのは、目的に反します。

## Markdown と HTML

Markdown には、見出しや箇条書き、テーブルなどの記法(シンタックス)があります。
これらの記法を用いて、構造的に記事を書くことができます。

執筆で欲しい記法がなかった場合は、どうしたら良いでしょうか。

[Daring Fireball: Markdown Syntax Documentation](https://daringfireball.net/projects/markdown/syntax) より引用します。

> For any markup that is not covered by Markdown’s syntax, you simply use HTML itself. There’s no need to preface it or delimit it to indicate that you’re switching from Markdown to HTML; you just use the tags.

Markdown には HTML が使えます。執筆サービスの Markdown で、HTML を書いてみると、恐らく使えるはずです。

Markdown は HTML へ変換するという目的を考えると、HTML が使用できるというのは納得できると思います。
ただし、**HTML を使用することで、読みやすさや書きやすさは少し悪くなってしまうため、多用は避けなければいけません**。

## HTML では物足りない

執筆サービスを使ってみるとわかると思いますが、おおよそ次の機能が提供されています。

- 埋め込み(Embed)コンテンツ
  - URL を書くと、Description やタイトル、画像を表示してくれる
- 目次(TOC)生成
  - 文章の見出しを収集し、目次を生成してくれる

これらの機能によって、執筆したコンテンツが読みやすくなったり、執筆の効率性が向上したりします。
当たり前ですが、Markdown には、そのような機能が存在しません。
Markdown は、記法を定義しているだけなので、Markdown に機能拡張を望んでいる訳ではありません。

しかし、執筆をしていくと、それらの機能が**どうしても欲しくなってきます**。
機能がなくても、Markdown 記法を駆使すれば、埋め込みコンテンツっぽく表示できますし、目次も手動で生成できます。
ただ、本来執筆に集中したいのに、見出しが増えるたびに、目次を手動更新するというのは、非効率的です。

その非効率、どうしたら良いでしょうか。

### 案 1. Markdown から HTML への変換処理で、機能拡張する

Markdown から HTML への変換処理で、埋め込みコンテンツや目次生成といった機能を拡張します。
具体的な話をした方が分かりやすいと思うので、目次生成を例にして、説明します。

説明しやすいために自前で変換処理を書きますが、本来は、Hugo や GatsbyJS、MDX などを想定しています。

[Markdown を HTML に変換する · JavaScript Primer #jsprimer](https://jsprimer.net/use-case/nodecli/md-to-html/) がちょうど分かりやすかったので参考にします。

Markdown と変換処理の transform.js を、次のものとします。

```markdown
# Header1

Hello, World
```

```javascript
// transform.js
const fs = require("fs");
const { marked } = require("marked"); // markdownをhtmlへ変換してくれる

const markdown = fs.readFileSync("README.md", { encoding: "utf-8" });
const html = marked(markdown);
console.log(html);
```

transform.js は、とてもシンプルです。README.md を html に変換して標準出力するだけです。
実行してみましょう。

```bash
$ node transform.js
<h1 id="header1">Header1</h1>
<p>Hello, World</p>
```

期待通り、HTML が出力されました。次は、目次生成です。
はてなブログでは、目次生成に `[:contents]` というマーカーを書くと、そこが目次となります。
脱線ですが、[remark](https://github.com/remarkjs/remark) という、Markdown に変換処理をしてくれるツールがあります。

目次生成のサンプルコードを書いていきます。

```markdown
[:contents]

# Header1

Hello, World
```

```javascript
// transform.js
const fs = require("fs");
const { marked } = require("marked"); // markdownをhtmlへ変換してくれる

const markdown = fs.readFileSync("README.md", { encoding: "utf-8" });
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

期待通り、Markdown の目次が生成されています。
これは簡単な例ですが、機能拡張していくと、transform.js の処理が増えたり、README.md にマーカーがたくさん書かれていきます。

このように変換処理に機能拡張するのは、変換処理に機能を一任できるというメリットがあります。
ですが、**Markdown が変換処理に依存してしまう**こととなってしまいます。
これは、変換処理を違うものへ移行するときに**移行コスト**が発生してしまいます。

また、Markdown 自体に、**Markdown 記法や HTML でもないマーカーを埋める**というのも、ちょっと違和感を感じます。

### 案 2. WebComponents で、機能拡張する

WebComponents は、Web 標準技術の 1 つで、HTML 要素を独自にカスタマイズできる機能(Custom Elements)があります。
例えば、目次生成するための HTML 要素、`<generate-toc>`を WebComponents で開発したとします。
この HTML 要素は、全ての見出しテキストを収集し、箇条書きで表示するだけの WebComponents だとします。

Markdown のイメージは、次のとおりになります。

```markdown
<generate-toc />

# Header1

Hello, World
```

この Markdown を、任意の HTML 変換処理(さきほどの transform.js でも可)をすると、次の結果になります。

```html
<generate-toc />

<h1 id="header1">Header1</h1>
<p>Hello, World</p>
```

Markdown は HTML を許容するため、`<generate-toc />`が、そのまま HTML 出力されます。
このままだと、ブラウザが `generate-toc` を識別できません。そのため、`generate-toc`を定義したコード、つまり WebComponents を読み込む必要があります。
例えば、次のようなコードを読み込みます。

```html
<script>
  class GenerateToc extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: "open" });
      // TODO: 見出しを収集し、箇条書きのHTMLを構築する処理
      shadow.innerHTML = `<div id="toc"><ul><li>Header1</li></ul></div>`;
    }
  }
  customElements.define("generate-toc", GenerateToc);
</script>
```

これで、ブラウザは `generate-toc`を識別できるようになったため、期待通り目次が表示されます。

WebComponents を利用するメリットは、**変換処理に依存せず WebComponents に依存します**。ブラウザの標準技術に依存するというのは、全く問題ありません。
変換処理の移行をしても、WebComponents のコードがあれば、同じ動作が実現できます。

また、再掲ですが、Markdown に次の文章があったとしても、Markdown の仕様に反しません。

```markdown
<generate-toc />

# Header1

Hello, World
```

Markdown の目的や仕様、Web というプラットフォームを考慮すると、Markdown と WebComponents の組み合わせは、相性が良いと思います。

## ようやく登場、Rocket

お待たせしました、ようやく Rocket の登場です。

Rocket は、Markdown と WebComponents をシームレスに統合できる SSG です。
Modern Web と呼ばれる Web 標準技術の開発支援を行うプロジェクトがあり、その中のサブプロジェクトとして[rocket](https://rocket.modern-web.dev/)があります。
他のサブプロジェクトとして、[テストランナー](https://modern-web.dev/docs/test-runner/overview/)と[開発サーバー](https://modern-web.dev/docs/dev-server/overview/)の[modern-web](https://modern-web.dev/)、WebComponents の開発、テスト、リンターなどの[open-wc](https://open-wc.org/)があります。

Rocket の事例は、次のものがあります。

- https://modern-web.dev/
- https://rocket.modern-web.dev/
- https://open-wc.org/
- https://apolloelements.dev/

Rocket は、技術的には、Eleventy という SSG の Wrapper になります。
Eleventy は、Markdown を HTML へ変換してくれます。Rocket は、その Eleventy に Modern Web の技術(WebComponents,TestRunner,DevServer)を混ぜています。

### Modern Web って？

Javascript を使って開発すると、Babel のトランスパイラ、ESLint のリンター、Jest のテスター、Webpack のビルダーなど、扱うツールが多く、必要以上に複雑になり、開発者は疲弊してしまいます。
本来、開発に注力すべきなのに、それらの複雑さによって、アジリティ低下につながることを、開発者は知っています。

そこで、WebComponents や、ESModules といった Web 標準技術で開発することで、複雑さといったものを軽減していく狙いが、Modern Web にはあります。

※ JSDOM のようなブラウザ API をモックすることでテストするのではなく、本来動いているブラウザでテストするテストランナーもあります。

Modern Web は、そういった Web 標準技術の開発を支援します。

## Rocket の特徴

[Rocket のホームページ](https://rocket.modern-web.dev/)に、Rocket の特徴を 6 つ書いてあります。
しかし、本記事の流れ的に Markdown と WebComponents の統合についてを説明すべきだと思うので、次の 1 つだけ特徴を紹介して、その他は割愛します。

- Meta Framework
  - Build on top of giants like Eleventy, Rollup, and Modern Web.

Eleventy や(話題にしていませんでしたが)Rollup、Modern Web という巨人の肩に乗ることで、Rocket の魅力があると思っています。

これまでの話で、『Eleventy で Markdown を HTML に変換して、WebComponents を読み込ませればよいでしょ？Rocket 必要？』と思う方がいるかもしれません。実際、その 2 つだけあれば充分だと思います。

ただ、Modern Web というプロジェクト支援があると、開発アジリティは向上します。
具体的には、Markdown や Javascript 変更による自動リロード、[Eleventy の画像変換処理](https://www.11ty.dev/docs/plugins/image/)、[Markdown のリンク先チェック](https://rocket.modern-web.dev/tools/check-html-links/overview/)などがあります。
まあ、必須ではないので Eleventy と WebComponents でも良いと思いますが、私は Rocket を使います。

## Markdown Javascript

Markdown と WebComponents の統合について説明します。

Rocket には、Markdown Javascript という機能があります。これは内部的に MDJS というライブラリを使っています。
以下に、MDJS についての InfoQ の記事がありますので、よければご参照ください。

- [新しい MDJS マークアップ言語により JavaScript を Markdown に追加してインタラクティブなドキュメント作成が可能に](https://www.infoq.com/jp/news/2020/08/mdjs-markdown-web-components/)

Markdown Javascript は、Markdown に Javascript を記入でき、インタラクティブに実行できる機能を備えています。
例えば、次のような Markdown を書いたとします。

````markdown
```js script
console.log("Hello, World");
```
````

これを書いて、Rocket で実行すると、ブラウザの開発ツールのコンソール画面に `Hello, World`と表示されます。
これを応用して、WebComponents を定義することもできます。

````markdown
```js script
class MyDiv extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `Hello, World`;
  }
}

customElements.define("my-div", MyDiv);
```

<my-div></my-div>
````

これを Rocket で実行すると、画面に `Hello World` と表示されます。
このように、Markdown 上に WebComponents を定義し、インタラクティブに実行されるため、**即座に WebComponents を使うことができます**。

使い捨ての WebComponents であればこれで良いのですが、使いまわしたいときがあると思います。
そういう場合は、共通する箇所に WebComponents を定義するのが良いでしょう。
Numjucks の script ヘッダに、共通化したい WebComponents を書いてあげると、どの Markdown からでも定義した WebComponents を使えます。

### Bare Import のサポート

Rocket は、Modern Web の[開発サーバー](https://modern-web.dev/docs/dev-server/overview/)を内部で使用しています。開発サーバーには、[Bare Import をサポートしています](https://modern-web.dev/blog/introducing-modern-web/#highlights-1)。

Bare Import の例を示します。
事前に `npm install canvas-confetti` インストールしていることを前提とした場合、次の Markdown は`confetti()`が実行されます。

````markdown
```js script
import confetti from "canvas-confetti";
confetti();
```
````

このように、相対パスや絶対パスを意識せず Bare で指定できるようになります。
ちなみに、canvas-conftti は、紙吹雪を出してくれます。見たほうが早いと思うので、押したら紙吹雪が出るボタンを下に表示しますね。

<button id="trigger">Click Me!</button>

```js script
import confetti from "canvas-confetti";
document.querySelector("#trigger").addEventListener("click", () => {
  confetti();
});
```

### WebComponents のコミュニティからライブラリを使う

独自に WebComponents を書かなくても、次の WebComponents のコミュニティサイトから良さそうなものを使うこともできます。

- [webcomponents.org](https://www.webcomponents.org/)

例えば、[emoji-picker-element](https://www.webcomponents.org/element/emoji-picker-element)という WebComponents を使ってみたいとします。emoji-picker-element は、絵文字キーボードの UI に似ています。Mac なら、command + control + スペースキー で表示されます。

使い方は、簡単です。
先ほどと同じく、`npm install emoji-picker-element` でインストールしておけば、次の Markdown を書くだけで `<emoji-picker-element>`が使えます。

````markdown
```js script
import "emoji-picker-element";
```

<emoji-picker></emoji-picker>
````

`<emoji-picker-element>`を下に出しておきますね。

```js script
import "emoji-picker-element";
```

<emoji-picker></emoji-picker>

## 宣伝

WebComponents についての入門書を Amazon で、500 円で販売しています。
今回の Rocket については書いていませんが、[open-wc](https://open-wc.org/)のテストについて触れています。

- [はじめての Web Components 入門: 4 つの基本機能から関連ライブラリまで](https://www.amazon.co.jp/gp/product/B08CY2QCFV/)

また、私のポートフォリオページを Rocket で作成しています。このブログも Markdown で執筆しています。よければご覧ください。

- [silverbirder's page](https://silverbirder.github.io/)
  - このブログの Markdown ファイルは、[こちら](https://github.com/silverbirder/silverbirder.github.io/blob/main/docs/blog/contents/intro_rocket.md)

## 終わりに

Rocket の紹介が、随分と後ろの方になってしまいました。前置きが長すぎたかもしれません。
少しでも誰かのお役に立てればと思います。
