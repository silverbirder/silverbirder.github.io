---
title: 'フロントエンド開発者のためのCSS設計ガイド：メンテナンス性を高める10の実践'
publishedAt: '2024-12-16'
summary: 'こんにちは、Webフロントエンド開発者のみなさま。silverbirderと申します。突然ですが、みなさんは普段どのようにCSSを設計していますか？愚直にプロパティを書いていますか？それとも、何かしらのルールがありますか？私自身、この1年間、スタイルに関わるさまざまな開発を経験してきました。その経験から、CSS設計に関するプラクティスが少しずつ固まってきました。そこで今回は、私が得た知見の中から **10つの考え** を共有したいと思います。これらの考えが、みなさんのCSS設計に少しでも役立つヒントになれば幸いです。'
tags: ["フロントエンド"]
index: false
---

こんにちは、Webフロントエンド開発者のみなさま。silverbirderと申します。

突然ですが、みなさんは普段どのようにCSSを設計していますか？愚直にプロパティを書いていますか？それとも、何かしらのルールがありますか？

私自身、この1年間、スタイルに関わるさまざまな開発を経験してきました。その経験から、CSS設計に関するプラクティスが少しずつ固まってきました。そこで今回は、私が得た知見の中から **10つの考え** を共有したいと思います。これらの考えが、みなさんのCSS設計に少しでも役立つヒントになれば幸いです。

## CSS設計

HTMLとCSSのサンプルを使って具体例をご紹介します。コードは CodePen でプレビューできるようにしていますので、視覚的に確認しながらお読みください。

また、各見出しは独立しているため、興味のあるセクションだけをお読みいただいても問題ありません。ぜひご活用ください。

### 親が子をレイアウトする

CSSで `padding` や `margin` を使うのは日常茶飯事です。
例えば、以下のようなコードを考えてみましょう。

```html
<div class="wrapper">
  <div class="item1">item1</div>
  <div class="item2">item2</div>
</div>
```

```css
.wrapper {
  background-color: lightgray;
}

.item1 {
  margin-bottom: 0.25rem;
  margin-top: 0.5rem;
  background-color: lightblue;
}

.item2 {
  margin-bottom: 0.25rem;
  background-color: lightblue;
}
```

@[codepen](https://codepen.io/silverbirder/pen/gbYwrOa)

このコードでは、以下のようにスペースを調整しています。

- `.item`間に `0.25rem` のスペース
- `.item`全体の上下に `0.5rem` のスペース

スペースを適切に調整することで、要素のグループ分けが視覚的にわかりやすくなります。
このコードでも、意図したデザインを表現することはできます。

しかし、機能が増えてデザインが変更される場合を考えてみましょう。例えば、以下のような修正が発生したとします。

- item1 と item2 の間に item3 を追加

この場合、多くの人は item1 や item2 をコピーして item3 を挿入するでしょう。
しかし、間のスペースを正しく保つために、item3 の `margin-bottom` を `0.25rem` に設定しなければなりません。
さらに、 **item間のスペースが変更された場合は、item1、item2、item3 それぞれのスタイルを修正する必要** があります。

このような状況を避けるために、 **itemの周りのスペースは「親」が調整するべき** だと私は考えます。
**item自身の責務は、自身の内部スタイルに限定するべき** です。
そこで、以下のようにコードを修正します。

```html
<div class="wrapper">
  <div class="item">item1</div>
  <div class="item">item2</div>
</div>
```

```css
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: lightgray;
}

.item {
  background-color: lightblue;
}
```

@[codepen](https://codepen.io/silverbirder/pen/xbKEVYo)

この方法では、以下のようなメリットがあります。

- 親要素（`.wrapper`）が、子要素（`.item`）の間のスペースを調整
- `.item`自身のスタイルは再利用可能に
- レイアウト調整は `.wrapper` だけで済む

また、[Every Layout](https://every-layout.dev/) の Stack パターンのように、以下の方法も利用できます。

```css
.wrapper > * + * {
  margin-top: 0.25rem;
}
/* 再帰的にする場合 */
.wrapper * + * {
  margin-top: 0.25rem;
}
```

この方法も有効ですが、少し直感的ではないかもしれません。
特に、後から読む人やメンテナンスをする人にとっては難解に感じる場合があります。

その点、`gap` を使った方法はシンプルでわかりやすく、メンテナンス性が高いでしょう。レイアウトでよく使うのは、以下のものでしょうか。

- `flex`
  - `gap`
- `grid`
  - `row-gap`
  - `column-gap`
- `margin`
- `padding`

今後も、理解しやすく柔軟性のある設計を意識していきたいですね。

### できれば、固定値を使わない

CSSを書く際、ついｴｲﾔｯと固定値を使ってしまうことがあるかもしれません。
例えば、以下のようなコードです。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
```

```css
.wrapper {
  position: relative;
  background-color: lightblue;
  width: 200px;
  height: 100px;
}
.item {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: lightgreen;
  width: 180px;
  height: 80px;
}
```

@[codepen](https://codepen.io/silverbirder/pen/vEBXGjG)

このようなスタイルが絶対に悪いわけではありません。状況によっては適切な場合もあります。
しかし、 **固定値を多用すると、次のような理由でレイアウトが崩れるリスクが高まります** 。

- ブラウザのウィンドウサイズが変更された場合
- アイテム内のコンテンツが動的に変化した場合

意図するデザインに応じて対処は異なりますが、私なら以下のように修正します。

```css
.wrapper {
  background-color: lightblue;
  /* 親要素の幅に合わせる */
  width: 100%;
  /* 最大の幅を200pxに制限 */
  max-width: 200px;
  /* 横:縦 = 2:1 の比率を維持 */
  aspect-ratio: 2 / 1;
  /* 内部の余白を10pxに設定 */
  padding: 10px;
  /* widthにpaddingやborderを含める */
  box-sizing: border-box;
}
.item {
  background-color: lightgreen;
  /* 親要素のサイズにフィットさせる */
  width: 100%;
  height: 100%;
}
```

@[codepen](https://codepen.io/silverbirder/pen/jENMqxz)

この修正では、以下のような柔軟性が得られます。

- 親要素に応じて自動で調整されるサイズ
- 最大幅の制限や比率維持により意図したデザインを保つ
- コンテンツが動的に変化しても崩れにくいレイアウト

基本的な考え方として、CSSでは **『ブラウザに計算させる』** ことを意識するのがベターです。
固定値に頼らず、柔軟な設計を心がけることで、より適応性の高いスタイルが実現できます。

#### 絶対長と相対長

CSSの単位には、 **絶対長** と **相対長** の2種類があります。
その名のとおり、 **絶対長** は常に固定の長さを表し、 **相対長** は他の要素や値に基づく相対的な長さを示します。

- 絶対長の例
  - `px`
  - `in`
- 相対長の例
  - フォントサイズを基準
    - `em`、`rem`
    - `ex`、`rex`
    - `cap`、`rcap`
    - `ch`、`rch`
    - `ic`、`ric`
  - ビューポートを基準
    - `vh`、`lvh`、`svh`、`dvh`
    - `vw`、`lvw`、`svw`、`dvw`
  - 行の高さを基準
    - `lh`、`rlh`
  - コンテナクエリを基準
    - `cqw`、`cqh`
  - 親要素を基準
    - `%`

##### `em` と `rem` の違い

- `em`: 親要素のフォントサイズを基準にした相対値。
- `rem`: ルート要素（`:root`）のフォントサイズを基準にした相対値。

例えば、`:root { font-size: 16px; }` の場合、`1rem` は常に `16px` に相当します。一方、`em` はその要素の親に依存します。

##### 動的な計算: CSS 関数

CSS の関数を使うと、柔軟なスタイル設定が可能です。

- `calc()`: 四則演算を用いて動的に値を計算。
- `minmax()`: 最小値と最大値を指定して柔軟なレイアウトを設定。

---

これらの相対長や CSS 関数を使うことで、 **値の計算をブラウザに任せられる** ため、 **開発者が細かく四則演算を行う必要が減ります** 。また、基準値を `:root` で定義しておけば、 **基準を変更するだけで相対値も自動的に調整され** 、柔軟性が向上します。

例えば、フォントサイズを `rem` で管理すれば、デバイスに応じたフォントサイズの調整が容易になります(次の見出しで解説します)。さらに、ページの横幅をビューポート単位（`vw` や `%`）で基準にしつつ、コンテナクエリを組み合わせれば、画面幅に応じてレイアウトが自動的に変化します。また、`flex` コンテナを活用することで、より柔軟で適応性の高いデザインが実現します。

その他の単位について詳しく知りたい方は、以下のMDNのリンクをご参照ください。

- [CSS 値と単位 - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_Values_and_Units)
- [length - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/length)

##### 実例：デバイスに応じたフォントサイズの調整

以下のCSSは、デバイスごとに異なるフォントサイズを指定する例です。

```css
.wrapper {
  /* スマートフォン向けスタイル */
  font-size: 16px;

  /* タブレット向けスタイル */
  @media (768px <= width < 1024px) {
    font-size: 24px;
  }
  /* ラップトップ向けスタイル */
  @media (1024px <= width < 1280px) {
    font-size: 32px;
  }
  /* デスクトップ向けスタイル */
  @media (1280px <= width) {
    font-size: 40px;
  }
}
```

このコードでも問題ありませんが、より柔軟な書き方として `rem` を使用する方法があります。

##### `rem` を使った柔軟なスタイル

まず、`:root` に基準となるフォントサイズを指定します。

```css
:root {
  font-size: 16px;
}
```

そして、以下のように `rem` を使ってスタイルを記述します。

```css
.wrapper {
  /* 1rem = 16px; */
  font-size: 1rem;

  /* タブレット向けスタイル */
  @media (768px <= width < 1024px) {
    font-size: 1.5rem;
  }
  /* ラップトップ向けスタイル */
  @media (1024px <= width < 1280px) {
    font-size: 2rem;
  }
  /* デスクトップ向けスタイル */
  @media (1280px <= width) {
    font-size: 2.5rem;
  }
}
/* 全体に関わるなら、:rootの中でやるのも良いかもしれません。 */
```

この方法では以下のメリットがあります。

- 相対的な値がわかりやすい
  - 例えば、デスクトップ向けのフォントサイズが基準サイズ（`16px`）の 2.5 倍であることが一目でわかります。
- 全体の調整が簡単
  - `:root` のフォントサイズを変更すれば、すべての `rem` の値が一括で更新されます。これにより、デザイン全体の調整が効率的になります。

##### `clamp()` を使った高度な例

さらに、以下のように `clamp()` を使うことで、フォントサイズを1行で指定することも可能です。

```css
.wrapper {
  /* 最小viewportが375px、最大が1280px */
  font-size: clamp(1rem, 0.378rem + 2.65vw, 2.5rem);
  /* ref: https://github.com/9elements/min-max-calculator */
}
```

1行で書けますが、直感的には分かりにくいかもしれません。そのため、`font-size`を分けて書く方がメンテナンスしやすいかもしれません。

### レスポンシブのメディアクエリは、小さい順に

Webサイトを閲覧するデバイスには、さまざまな大きさがあります。
一般的には、以下のようなデバイスごとにスタイルを分けることが多いです。

- スマートフォン
- タブレット
- ラップトップ
- デスクトップ

サービスによっては、さらに細かく分けたり、特殊なデバイスに対応する場合もあります。
幅広いデバイスに対応するためには、デバイスのサイズに応じて見やすいCSSを書くことが重要です。その際によく使われる手法が **メディアクエリ** です。

#### メディアクエリの書き方

メディアクエリは主に2種類の書き方があります。

##### 1. 小さい順

```css
.wrapper {
  /* スマートフォン向けスタイル */

  @media (min-width: 768px) {
    /* タブレット向けスタイル */
  }

  @media (min-width: 1024px) {
    /* ラップトップ向けスタイル */
  }

  @media (min-width: 1280px) {
    /* デスクトップ向けスタイル */
  }
}
```

##### 2. 大きい順

```css
.wrapper {
  /* デスクトップ向けスタイル */

  @media (max-width: 1024px) {
    /* ラップトップ向けスタイル */
  }

  @media (max-width: 768px) {
    /* タブレット向けスタイル */
  }

  @media (max-width: 640px) {
    /* スマートフォン向けスタイル */
  }
}
```

#### おすすめなのは小さい順

最近では、 **モバイルファースト** のアプローチが一般的になっています。
小さい順にスタイルを記述することで、デバイスのサイズが大きくなるに従ってスタイルを **上書き** する形になり、直感的に分かりやすいというメリットがあります。

ただし、「タブレットの `min-width` や `max-width` は何だっけ？」といった疑問が生じることもあります。
この点を改善するために、 **Media Queries Level 4** の記法を活用する方法があります。

#### Media Queries Level 4 の記法

以下のように記述すると、デバイスの範囲が明確になり、直感的に理解しやすくなります。

```css
.wrapper {
  /* スマートフォン向けスタイル */

  @media (768px <= width < 1024px) {
    /* タブレット向けスタイル */
  }

  @media (1024px <= width < 1280px) {
    /* ラップトップ向けスタイル */
  }

  @media (1280px <= width) {
    /* デスクトップ向けスタイル */
  }
}
```

このように記述することで、例えば「タブレットは `768px` から `1024px` の間」と範囲がはっきり分かります。

### CSSの値は、共通変数で扱う

CSSを書く際、フォントサイズ、背景色、ボーダーの角丸などの値を記述するのはよくあることです。

```css
.item {
  border: 1px solid hsl(360deg 100% 15%);
  border-radius: 30px;
  padding: 2px;
  margin: 2px;
}
```

このような値を繰り返し記述するうちに、同じ意図を持つ値が複数箇所に出現することがよくあります。
例えば、ブランドカラーやスペーシングの値などです。このような繰り返しは、 **DRY（Don't Repeat Yourself）原則に反している** と言えます。

近年、多くの企業がデザインシステムを導入・運用しており、こうした色やスペーシングの値はデザイントークンとして管理されています。([Tokens Studio for Figma](https://www.figma.com/community/plugin/843461159747178978/tokens-studio-for-figma)がお気に入りです)

そこで、CSSの値を共通変数として定義することをお勧めします。
CSSではカスタムプロパティ、CSS-in-JSではJavaScript変数、SassではSass変数を使用できます。

```css
:root {
  --radius-outer: 30px;
  --color-border: hsl(360deg 100% 15%);
  --spacing-x: 2px;
}

.item {
  /* var(変数名, デフォルト値) */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-outer);
  padding: var(--spacing-x);
  margin: var(--spacing-x);
}
```

このように定義すれば、ボーダー色を変更したい場合でも、`:root` の変数を修正するだけで済みます。

#### Z軸を意識する

CSSを書く中で、`z-index` を使用して要素の重なり順を調整する場面があります。以下の例を見てみましょう。

```html
<div class="wrapper">
  <div class="layer1">layer1</div>
  <div class="layer2">layer2</div>
  <div class="layer3">layer3</div>
</div>
```

```css
.wrapper {
  position: relative;
}

.layer1 {
  position: absolute;
  background-color: lightblue;
  z-index: 1;
  width: 300px;
  height: 300px;
}
.layer2 {
  position: absolute;
  background-color: lightgreen;
  z-index: 3;
  width: 100px;
  height: 100px;
}
.layer3 {
  position: absolute;
  background-color: lightcoral;
  z-index: 2;
  width: 200px;
  height: 200px;
}
```

@[codepen](https://codepen.io/silverbirder/pen/KwPgzJx)

このコードでは、`z-index` の値に基づいて、`layer2（lightgreen）`が一番上に表示されます。
このように要素が増えると、`z-index` の値を管理するのが複雑になります。

そこで、`z-index` の値も共通変数として定義すると、管理が簡単になります。

```css
:root {
  --layer-bottom: 1;
  --layer-middle: 2;
  --layer-top: 3;
}

.wrapper {
  position: relative;
}

.layer1 {
  position: absolute;
  background-color: lightblue;
  z-index: var(--layer-bottom);
  width: 300px;
  height: 300px;
}
.layer2 {
  position: absolute;
  background-color: lightgreen;
  z-index: var(--layer-top);
  width: 100px;
  height: 100px;
}
.layer3 {
  position: absolute;
  background-color: lightcoral;
  z-index: var(--layer-middle);
  width: 200px;
  height: 200px;
}
```

`z-index`に関連して大事な概念が、 **重ね合わせコンテキスト** です。重ね合わせコンテキストとは、以下のとおりです。

> 重ね合わせコンテキスト (Stacking context) は、ビューポートまたはウェブページに面していると想定されるユーザーに対する仮想的な Z 軸に沿って並べられた HTML 要素の三次元の概念化です。 HTML 要素は、要素の属性に基づいてこの空間を優先度つきの順序で占有します。
[重ね合わせコンテキスト - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context)

重ね合わせコンテキスト内では、`z-index`の値を比較して要素の重なり順を制御できます。しかし、 **異なる重ね合わせコンテキストに属する `z-index` 同士は比較できません** 。詳しく知りたい方は、以下のリンクを参考にしてください。

- [君は真に理解しているか？z-indexとスタッキングコンテキストの関係 - ICS MEDIA](https://ics.media/entry/200609/)

重ね合わせコンテキストを生成する条件にはいくつかのパターンがあります。以下は、特によく見られるものです。

- `position` の値が `absolute` または `relative` であり、かつ `z-index` の値が `auto` 以外の要素
- `position` の値が `fixed` または `sticky` の要素
- フレックスコンテナーの子であり、 `z-index` の値が auto 以外の要素。
- グリッド (grid) コンテナーの子であり、 `z-index` の値が auto 以外の要素。

詳しくは、以下の MDN の記事をご覧ください。

- [重ね合わせコンテキスト - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_positioned_layout/Understanding_z-index/Stacking_context) より引用

新しい重ね合わせコンテキストを生成する簡単な方法として `isolation` プロパティがあります。`isolation`プロパティを使って新しい重ね合わせコンテキストを生成することできるので、 **他の重ね合わせコンテキストにあるz-indexの影響を受けず** に、`z-index`の値を設定できます。

以下は、`isolation`プロパティの例です。

```html
<div class="wrapper">
  <div class="item"></div>
</div>
<div class="outer"></div>
```

```css
.wrapper {
  position: absolute;
  /* 新しく、重ね合わせコンテキストを生成 */
  /* コメントアウトしてみて、挙動を確認してみてください。 */
  isolation: isolate;
}

.item {
  position: absolute;
  width: 100px;
  height: 150px;
  background-color: lightpink;
  /* wrapperが新しく重ね合わせコンテキストを生成した場合、outerよりitemが下になる */
  /* wrapperが新しく重ね合わせコンテキストを生成しない場合、outerよりitemが上になる */
  z-index: 999;
}

.outer {
  position: absolute;
  width: 150px;
  height: 100px;
  background-color: lightgreen;
  z-index: 1;
}
```

@[codepen](https://codepen.io/silverbirder/pen/mybrPoW)

重ね合わせコンテキストについて視覚的に理解したくなると思う方には、以下のChrome拡張機能がオススメです。

- [CSS Stacking Context inspector - Chrome ウェブストア](https://chromewebstore.google.com/detail/css-stacking-context-insp/apjeljpachdcjkgnamgppgfkmddadcki?hl=ja)

#### 影とエレベーション

`box-shadow`を使用すると、要素に影をつけることができます。以下は基本的な例です。

```html
<div class="wrapper"></div>
```

```css
.wrapper {
  width: 100px;
  height: 100px;
  background-color: #dddddd;
  border-radius: 4px;
  /* x方向6px、y方向6px、ぼかし6px、広がり0px、色 */
  box-shadow: 6px 6px 6px 0px rgba(0, 0, 0, 0.45);
}
```

@[codepen](https://codepen.io/silverbirder/pen/GgKNEwQ)

`box-shadow` は以下の要素を定義できます。

- 影の方向 (x軸、y軸)
- ぼかし
- 広がり
- 色 (RGBAやHEX形式など)

影のぼかしや広がり具合は、 **要素の物理的な高さに応じて変化する** ことが一般的です。そこで、エレベーションというものを紹介します。

[エレベーション（概要）｜デジタル庁デザインシステムβ版](https://design.digital.go.jp/foundations/elevation/) より引用しますと、

> エレベーションは、ブラウザ上で表示されるコンポーネントの高さの度合いを示します。

**要素のZ軸の高さによって影のぼかしや広がりを定義しておく** と、より直感的なデザインが可能になります。以下は、エレベーションのレイヤーごとに影を定義し、それをカスタムプロパティを使用して適用する例です。

```html
<div class="wrapper">
  <div class="item layer-1"></div>
  <div class="item layer-2"></div>
  <div class="item layer-3"></div>
</div>
```

```css
:root {
  --shadow-layer-1: 2px 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-layer-2: 4px 4px 8px rgba(0, 0, 0, 0.3);
  --shadow-layer-3: 6px 6px 12px rgba(0, 0, 0, 0.4);
}

.wrapper {
  display: flex;
  gap: 10px;
}

.item {
  width: 100px;
  height: 100px;
  background-color: #dddddd;
  border-radius: 4px;
}

.layer-1 {
  box-shadow: var(--shadow-layer-1);
}

.layer-2 {
  box-shadow: var(--shadow-layer-2);
}

.layer-3 {
  box-shadow: var(--shadow-layer-3);
}
```

@[codepen](https://codepen.io/silverbirder/pen/WbeoOVm)

#### `position: absolute` を使用する際の注意点

`position: absolute` を使う場合、基準となる祖先要素に `position: relative` などを設定する必要があります。 **設定しない場合、ルート要素(html)が基準となってしまいます** 。以下の例のように、必ず `position: relative` をつけましょう。

```html
<div class="wrapper">
  <div class="image"></div>
  <div class="text">Hello, World</div>
</div>
```

```css
.wrapper {
  /* 位置指定要素として定義 */
  position: relative;
  width: 200px;
  height: 200px;
  background-color: lightblue;
}

.image {
  width: 200px;
  height: 150px;
  background-color: lightgreen;
}

.text {
  /* wrapperに対して、top:0, left:0 の位置 */
  position: absolute;
  top: 0px;
  left: 0px;
}
```

@[codepen](https://codepen.io/silverbirder/pen/jENMqJp)

この設定により、`.text` 要素は `.wrapper` を基準に配置されます。基準を明示的に設定することで、意図した配置が確実になります。

### `flex` で要素を伸縮させる

要素を縦横に柔軟に配置する際には、`display: flex` を使用することが一般的です。
以下のように、`flex-direction` を使うことで、フレックスアイテムの配置を調整できます。

```html
<div class="wrapper">
  <div class="item">item1</div>
  <div class="item">item2</div>
</div>
```

```css
.wrapper {
  display: flex;

  /* スマートフォンやタブレットでは縦に積む */
  flex-direction: column;

  /* ラップトップ以上の画面幅では横に並べる */
  @media (min-width: 1024px) {
    flex-direction: row;
  }
}
```

@[codepen](https://codepen.io/silverbirder/pen/RNbGaOK)

`flex` の大きな特徴は、 **フレックスコンテナ内でアイテムの伸縮を制御できる点** です。主に以下の3つのプロパティを利用します。

- `flex-grow`: 残りの空間をどれだけ占めるか（デフォルト: 0）。
- `flex-shrink`: コンテナ内が狭い場合にどれだけ縮むか（デフォルト: 1）。
- `flex-basis`: 初期の寸法。この値を基準に、`flex-grow` や `flex-shrink` によって大きさが変化します（デフォルト: `auto`）。

`flex-basis: auto` の場合、横方向では `width`、縦方向では `height` の `auto` に基づきます。

#### Sidebarパターンの活用

[Every Layout の Sidebar パターン](https://every-layout.dev/layouts/sidebar/) は、`flex` を活用した良い例です。
以下のコードは、そのSidebarパターンの例です。

```html
<div class="with-sidebar">
  <div class="sidebar"></div>
  <div class="not-sidebar"></div>
</div>
```

```css
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  background-color: lightblue;
  height: 500px;
  width: 800px;
}

.sidebar {
  /* ↓ The width when the sidebar _is_ a sidebar */
  flex-basis: 20rem;
  flex-grow: 1;
  background-color: lightgreen;
}

.not-sidebar {
  /* ↓ Grow from nothing */
  flex-basis: 0;
  flex-grow: 999;
  /* ↓ Wrap when the elements are of equal width */
  min-width: 50%;
  background-color: lightpink;
}
```

@[codepen](https://codepen.io/silverbirder/pen/NPKRNmY)

この例では、`.with-sidebar` をフレックスコンテナとして定義し、アイテムごとに伸縮を設定しています。
さらに、`.not-sidebar` に `min-width` を指定することで、幅が足りなくなった場合は `flex-wrap` により自動的に折り返します。

結果として、以下のようなレスポンシブデザインが実現します。

- 横幅が広い場合: サイドバーは左、ノットサイドバーは右に並びます。
- 横幅が狭い場合: サイドバーは上、ノットサイドバーは下に積まれます。

メディアクエリを使わず、`flex` の伸縮性を活用することで、柔軟なレイアウトを実現できる点がこの方法の利点です。

### `display: contents` で要素を「なかったこと」にする

HTMLやCSSを書いていると、レスポンシブデザインで困ることがあります。例えば、以下のようなHTML構造があったとします。

```html
<div class="card">
  <div class="title">タイトル</div>
  <div class="description">説明</div>
  <img class="image" src="https://via.placeholder.com/150" />
</div>
```

以下のような表示要件を満たす必要があるとします。

- スマートフォン表示: タイトル、説明、画像を縦に並べる。
- ラップトップ表示: 左側に画像、右側にタイトルと説明を縦に並べる。

スマートフォン表示だけなら、`flex-direction: column` を指定するだけで対応できます。
しかし、ラップトップ表示を考慮すると、HTML構造を変える必要が出てきます。

ここで活用できるのが `display: contents` です。このプロパティを使えば、要件を満たす柔軟なデザインが可能になります。

#### `display: contents` を用いた解決方法

以下のHTMLとCSSを見てみましょう。

```html
<div class="card">
  <div class="wrapper">
    <div class="title">title</div>
    <div class="description">description</div>
  </div>
  <img class="image" src="https://via.placeholder.com/150" />
</div>
```

```css
.card {
  display: flex;
  /* スマホの場合、縦に積む */
  flex-direction: column;
  gap: 1rem;

  /* ラップトップの場合、横に並べる */
  @media (1024px <= width) {
    flex-direction: row;
  };
}

.wrapper {
  /* スマホの場合、なかったことにする */
  display: contents;

  /* ラップトップの場合、縦に積む */
  @media (1024px <= width) {
    display: flex;
    flex-direction: column;
  };
}
```

@[codepen](https://codepen.io/silverbirder/pen/azomNgb)

`display: contents` を指定すると、 **その要素は「なかったこと」として扱われます。**
以下のようにブラウザ上で解釈されます。

```html
<div class="card">
  <!-- <div class="wrapper"> -->
    <div class="title">title</div>
    <div class="description">description</div>
  <!-- </div> -->
  <img class="image" src="https://via.placeholder.com/150" />
</div>
```

このため、`.card` の `flex-direction` や `gap` のスタイルが `.title` や `.description` に直接適用されます。
結果として、スマートフォン表示とラップトップ表示の両方の要件を満たすことができます。

### テキストスタイルはテキストに適用する

CSS は "Cascading Style Sheets" の略で、「カスケーディング（Cascading）」とは、親から子、孫へとスタイルが継承されることを指します。
この特性を利用すると、親要素にスタイルを定義するだけで子要素にも適用されます。

例えば、以下のような HTML と CSS を考えます。

```html
<div class="wrapper">
  <span class="text">Hello, World</span>
</div>
```

```css
.wrapper {
  /* レイアウトスタイル */
  padding: 1rem;

  /* テキストスタイル */
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: red;
}
```

@[codepen](https://codepen.io/silverbirder/pen/jENMqjv)

この場合、`.wrapper` で定義したスタイルが `.text` 要素にも適用され、期待する結果が得られます。
しかし、この設計には問題が潜んでいます。

#### 問題点: 意図しない継承のリスク

親要素にテキストスタイルを定義すると、子要素全体に適用されます。
例えば、以下のように `.wrapper` に新しいテキストを追加した場合を考えます。

```html
<div class="wrapper">
  <span class="text">Hello, World</span>
  <div>
    <span>Thank you</span>
  </div>
</div>
```

@[codepen](https://codepen.io/silverbirder/pen/qEWaZeO)

ここでは、`Thank you` にも `font-size` や `color` といったスタイルが適用されます。
これが意図通りであれば問題ありません。しかし規模が大きくなると、このような継承は意図しないデザインの崩れや混乱を引き起こす原因になります。

#### 解決策: テキストスタイルをテキストに適用する

親要素にまとめてテキストスタイルを適用したくなるかもしれませんが、それは意図しないデザイン崩れを引き起こす可能性があります。CSS設計が曖昧にならないよう、以下のように **テキストスタイルをテキストに適用すること** をお勧めします。

```css
.wrapper {
  /* レイアウトスタイル */
  padding: 1rem;

  /* 特定の子要素 (.text) にスタイルを限定 */
  & > .text {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: red;
  }
}
```

@[codepen](https://codepen.io/silverbirder/pen/qEWaNWb)

また、汎用的に使用するテキストスタイルは、以下のようにクラスを分離して定義するのが良いでしょう。

```css
.wrapper {
  /* レイアウトスタイル */
  padding: 1rem;
}

.text {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: red;
}
```

`font-size`、`font-weight`、`line-height` のセットは、デザインシステムでいう「 **タイポグラフィ** 」として定義するとさらに効果的です。これにより、統一感のあるデザインが実現できます。

### CSSボックスモデルを理解する

ブラウザのレンダリングエンジンは、コンテンツを描画する際に **CSS基本ボックスモデル** を使用します。このボックスモデルは、要素を長方形のボックスとして表現し、以下の4つの領域で構成されています。

- コンテンツ領域: 文字や画像などの「実際の」コンテンツが含まれる部分。
- パディング領域: コンテンツと境界（ボーダー）の間のスペース。
- 境界領域: ボーダーが描画される部分。
- マージン領域: ボックスの外側の余白。

詳しくは以下のリンクを参考にしてください。

- [CSS 基本ボックスモデル入門 - CSS: カスケーディングスタイルシート | MDN](https://developer.mozilla.org/ja/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)

#### `width` や `height` の指定が引き起こす問題

CSSで `width` や `height` を指定すると、その値は **コンテンツ領域** のみに適用されます。
ボーダーやパディングはその値に含まれません。この挙動を知らないと、以下のような問題に直面することがあります。

```html
<div class="wrapper"></div>
```

```css
/* 横幅は、100px + paddingの左右 2px + borderの左右 2px = 104px */
.wrapper {
  width: 100px;
  height: 100px;
  padding: 1px;
  border: 1px solid black;
}
```

@[codepen](https://codepen.io/silverbirder/pen/OPLRXLz)

この場合、表示される `.wrapper` の横幅は `100px` ではなく、ボーダーとパディングを加えた `104px` になります。

#### 解決策: `box-sizing` プロパティを使う

こうした問題を解決するために、`box-sizing` プロパティを使います。
`box-sizing: border-box;` を指定すると、`width` や `height` の値にボーダーとパディングが含まれるようになります。

```css
/* 横幅は 100px */
.wrapper {
  width: 100px;
  height: 100px;
  padding: 1px;
  border: 1px solid black;
  box-sizing: border-box;
}
```

@[codepen](https://codepen.io/silverbirder/pen/azomZbz)

これにより、要素の外側のサイズが意図通りに計算され、デザインの予測がしやすくなります。

#### グローバル設定での注意点

多くのプロジェクトでは、全ての要素に対して `box-sizing: border-box;` を適用するスタイルを採用しています。

```css
*,
*::before,
*::after {
  box-sizing: border-box;
}
```

ただし、このようなグローバル設定を採用する場合は、以下の点に注意してください。

##### チーム内での周知

全員がこのスタイルを理解していることが重要です。
知らない人が個別に `box-sizing: border-box;` を追加してしまうと、冗長なコードが発生します。

### 縦横のラインを揃える

デザインにおいて、 **縦横のラインが揃っていることは非常に重要** です。
ラインが揃うことで、どの要素が同じグループであるかが視覚的に明確になり、コンテンツの理解がしやすくなります。

例えば、カードUIを横に並べた際、画像やタイトル、説明文の位置が揃っていないと、全体的に乱雑な印象を与えます。
以下の例では、画像サイズが異なるために上下が揃っていません。

```html
<div class="wrapper">
  <div class="card">
    <img src="https://via.placeholder.com/150" />
    <div class="title">Title 1</div>
    <div class="description">Description 1</div>
  </div>
  <div class="card">
    <img src="https://via.placeholder.com/160" />
    <div class="title">Title 2</div>
    <div class="description">Description 2</div>
  </div>
  <div class="card">
    <img src="https://via.placeholder.com/150" />
    <div class="title">Title 3</div>
    <div class="description">Description 3</div>
  </div>
</div>
```

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background-color: lightblue;
}

.card {
  display: grid;
  background-color: lightgreen;

  & > .title {
    background-color: lightcoral;
  }

  & > .description {
    background-color: lightyellow;
  }
}
```

@[codepen](https://codepen.io/silverbirder/pen/NPKRrWz)

このままでは、カードごとに高さが異なり、全体が揃いません。

#### 解決策: サブグリッドの活用

`subgrid` を使用すると、縦のラインを揃えることができます。以下の例では、サブグリッドを活用してカードの要素間の位置を揃えています。

```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  background-color: lightblue;
}

.card {
  display: grid;
  /* サブグリッドを適用する */
  grid-template-rows: subgrid;
  grid-row: span 3;
  grid-row-gap: 0px;

  background-color: lightgreen;

  & > .title {
    background-color: lightcoral;
  }

  & > .description {
    background-color: lightyellow;
  }
}
```

@[codepen](https://codepen.io/silverbirder/pen/JoPRKoY)

この設定により、カード内の要素の高さが統一され、縦のラインが揃います。

#### 他の解決策

サブグリッドが適用しにくい場合、以下の方法を検討してください。

##### 1. `min-height` を設定

要素ごとに最低限の高さを確保することで、全体のラインを揃えます。

##### 2. テキストの省略

テキスト量を調整し、要素間の見た目を揃えます。

##### 3. グリッドの活用

サブグリッドを使用しなくても、グリッドレイアウト自体で縦横のラインを調整できます。
例えば、`grid-template-rows` を設定するだけでも揃えやすくなります。

### 画像表示は `img` 要素か `background-image` プロパティか

Webサイトで画像を表示する方法として、主に以下の2つがあります。

1. `img` 要素で画像を表示
1. CSS の `background-image` プロパティで画像を表示

どちらの方法でも画像を表示できますが、適切な使い分けをすることで、コードの可読性やアクセシビリティが向上します。

#### 使い分けの基準

画像の役割によって、以下の基準で使い分けると良さそうです。

##### 1. コンテンツの一部として必要な画像

コンテンツとして画像がないと意味が成り立たない場合は、`img` 要素を使用します。
例えば、記事中の画像や商品写真が該当します。

##### 2. 装飾的な画像

コンテンツとして必須ではなく、デザイン上の背景要素として使用する場合は、`background-image` プロパティを使います。
例えば、ページの背景やボタンの装飾が該当します。

#### 別の視点からの使い分け

以下の観点で使い分けることも有効です。

- 背景画像として使用する場合 → `background-image` プロパティ
- 背景画像ではない画像として使用する場合 → `img` 要素

`background-image` という名前なので、それはそうですよね。(笑)

## 終わりに

最後までお読みいただき、ありがとうございました。この記事が、みなさんのCSS設計に少しでも役立つきっかけになれば幸いです。
