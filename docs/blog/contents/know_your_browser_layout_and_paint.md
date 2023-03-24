---
title: ブラウザのレイアウトとペイントを知る
published: true
date: 2022-07-03
description: ブラウザのレンダリングエンジンにおけるレイアウトやペイントについて気になったので、調べました。その内容をまとめます。レンダリングエンジンは、Chrome の Blink を題材とします。
tags: ["Browser", "Layout", "Paint"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1656938619/silver-birder.github.io/blog/hal-gatewood-tZc3vjPCk-Q-unsplash.jpg
---

ブラウザのレンダリングエンジンにおけるレイアウトやペイントについて気になったので、調べました。
その内容をまとめます。レンダリングエンジンは、Chrome の Blink を題材とします。

## レンダリングエンジンの処理工程

レンダリングエンジンの処理工程は、次の記事が参考になります。

- https://web.dev/rendering-performance/
- https://blog.leap-in.com/lets-learn-how-to-browser-works/
- https://silver-birder.github.io/blog/contents/learning_browser_engine/
- https://developer.chrome.com/blog/inside-browser-part3/

![レンダリングエンジンの工程](https://res.cloudinary.com/silverbirder/image/upload/v1656816689/silver-birder.github.io/blog/browser_rendering_process.jpg)

- (図には書いていないけど)Parse
  - HTML と CSS をパース
  - DOM Tree と Style Rules を生成
- JavaScript
  - 視覚的な操作を処理
- Style
  - HTML 要素が、どの CSS ルールが割り当たるかを決定
  - DOM Tree と Style Rules を紐付けた Render Tree を生成
- Layout
  - HTML 要素の位置と大きさを決定
  - Layout Tree を生成
  - Reflow とも呼ぶ
- Paint
  - ブラウザに表示するピクセルを塗る
  - レイヤーを分ける
  - Draw とも呼ぶ
- Composite
  - 正しい順序で、レイヤーを重ねていく
  - メインスレッドからコンポジットスレッド・ラスタースレッドに切り替わる
    - コンポジットスレッドから、ページを各タイルに分割して、ラスタースレッドに送る
    - ラスタースレッドは、ラスタライズして GPU に格納する

この工程が、実際に動いているところを見てみましょう。

## DevTools でレンダリング工程を見てみる

次のシンプルな HTML を Chrome で開いてみましょう。

```html
<div>Hello</div>
```

開いたページで DevTools を開き、Performance タブをクリックします。
左上にある reload ボタンを押して、計測してみましょう。

![devtools_performance](https://res.cloudinary.com/silverbirder/image/upload/v1656941210/silver-birder.github.io/blog/devtools_performance.png)

計測の結果、 Main を見てみましょう。

![devtools_performance_1](https://res.cloudinary.com/silverbirder/image/upload/v1656941719/silver-birder.github.io/blog/devtools_performance_1.png)

さきほど説明したレンダリングエンジンの工程(色も一致)が、見えると思います。

- 青色 `Parse HTML`
- 紫色 `Recalculate Style`
- 紫色 `Layout`
- (黄色は JavaScript 関係)
- (緑色は Paint/Composite 関係)

視覚的に見やすい一方で、全体を網羅してみるのは難しいです。
そこで、 `Event Log` を開きます。

![devtools_performance_2](https://res.cloudinary.com/silverbirder/image/upload/v1656823105/silver-birder.github.io/blog/devtools_performance_2.png)

レンダリングエンジンのイベントログが、色とともに表示されています。
ここには、さきほど見れなかった黄色や緑色のものもあります。

### Tips: Performance タブに慣れよう

Performance タブには、様々な情報があります。

いきなりプロダクションリリースされているものに対して、Performance 計測すると、何を見たらよいかわからなくなります。

まずは、最小セットの HTML で見ていくと、情報量が絞られて、読みやすくなります。

また、計測の各場所には、工程の色が使われています。色も合わせて見ると、読みやすくなります。

## ブラウザとリフレッシュレートと 60fps

ブラウザでアニメーションなど動きを出すときに、60fps を目標とすると良いです。

http://jankfree.org/ というサイトから引用します。

> Modern browsers try to refresh the content on screen in sync with a device's refresh rate. For most devices today, the screen will refresh 60 times a second, or 60Hz. If there is some motion on screen (such as scrolling, transitions, or animations) a browser should create 60 frames per second to match the refresh rate.

ブラウザは、リフレッシュレートと同期してコンテンツを更新します。
最近のデバイスは、1 秒間に 60 回更新できるようです。そのため、ブラウザは 60fps で動作すべきと書いています。

DevTools から、fps を確認できます。
Rendering タブにある `Frame Rendering Stats`にチェックを入れます。

![devtools_fps_1](https://res.cloudinary.com/silverbirder/image/upload/v1656854862/silver-birder.github.io/blog/devtools_fps_1.png)

そうすると、画面に次の画像が表示されます。

![devtools_fps_2](https://res.cloudinary.com/silverbirder/image/upload/v1656854862/silver-birder.github.io/blog/devtools_fps_2.png)

今、ブラウザは 18.6 fps のようです。

---

fps が少ないと、どうなるんでしょうか。ジャンクと呼ばれる現象が発生します。

> Jank is any stuttering, juddering or just plain halting that users see when a site or app isn't keeping up with the refresh rate. Jank is the result of frames taking too long for a browser to make, and it negatively impacts your users and how they experience your site or app.

リフレッシュレートに、画面が追いついていないと、ジャンクと呼ばれる滑らかではない動作になってしまいます。これは、ユーザーへの悪い体験をさせてしまいます。

https://googlechrome.github.io/devtools-samples/jank/ が、まさにそのジャンクの体験ができます。

## レイアウトスラッシング

JavaScript や CSS を書いていると、DOM を追加してレイアウトが実行されたり、color を変えて、ペイントを実行されたりします。
レンダリングエンジンは、シングルスレッドで動いているため、レイアウトの実行やペイントの実行をしていると、他の工程が動作されません。

次のサイトにある JavaScript の関数を使うと、そのときのレイアウト情報を計算する必要があり、レイアウトが強制的に再計算されます。これがレイアウトスラッシングと呼ばれます。
レイアウトスラッシングは、FPS の低下につながります。

- https://gist.github.com/paulirish/5d52fb081b3570c81e3a
  - 例えば、clientWidth

例を示しましょう。ボタン要素にスタイル変更し、clientWidth を参照したコードです。

```html
<button>click</button>
<script>
  const b = document.querySelector("button");
  b.addEventListener("click", () => {
    b.setAttribute("style", `width: 100px;`);
    b.clientWidth;
  });
</script>
```

clientWidth を実行すると、そのときのレイアウト情報が必要になるため、強制的にレイアウトが実行されます。

![layout_forced](https://res.cloudinary.com/silverbirder/image/upload/v1656941215/silver-birder.github.io/blog/layout_forced.png)

強制レイアウトが発生しているのが、みてとれます。

`b.clientWidth` をコメントアウトすれば、Layout Forced は発生しません。
もっと、明らかに警告となるサンプルを用意しました。

```html
<button id="btn">click</button>
<div id="root"></div>
<template id="template">
  <div style="position: relative">hello</div>
</template>

<script>
  const root = document.getElementById("root");
  const template = document.getElementById("template");
  [...Array(100)].forEach(() =>
    root.appendChild(template.content.cloneNode(true))
  );

  document.getElementById("btn").addEventListener("click", () => {
    setInterval(() => {
      document.querySelectorAll("div").forEach((el) => {
        el.style.left =
          (Math.sin(el.offsetTop + Date.now() / 1000) + 1) * 500 + "px";
      });
    }, 100);
  });
</script>
```

DevTools の Performance タブから見ると、`forced reflow is likely a bottleneck` と警告が出ているのが分かります。

![devtools_warn_forced_reflow](https://res.cloudinary.com/silverbirder/image/upload/v1656941719/silver-birder.github.io/blog/devtools_warn_forced_reflow.png)

対策としては、次があげられます。

- レイアウトスラッシングを発生させる関数を実行しない、もしくはキャッシュする
- `Window.requestAnimationFrame()` を利用する

参考までに

- https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/#avoid-forced-synchronous-layouts

DEMO は、次のページにもあります。

- https://googlesamples.github.io/web-fundamentals/tools/chrome-devtools/rendering-tools/forcedsync.html

## Paint と Composite

Paint もコストがかかります。そこで、Composite に任せることで、メインスレッドを開放し、パフォーマンスが良くなります。
具体的には、コンポジットで動作する transform や opasity とかがあります。

具体的な例を出しましょう。
次の例は、四角のボックスを左右に動かすサンプルです。
左右に動かす手段に、CSS の left のパターンと、transform のパターンを試してみます。

```html
<style>
  @keyframes return {
    50% {
      left: 200px;
    }
    100% {
      left: 0px;
    }
    /* 50% {
      transform: translateX(200px);
    }
    100% {
      transform: translateX(0px);
    } */
  }

  .box {
    position: relative;
    width: 100px;
    height: 100px;
    left: 0px;
    border: 1px solid black;
  }
  .trans {
    animation-name: return;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease;
  }
</style>
<div class="box trans"></div>
```

transform の場合は、left の部分をコメントアウトし、transform 部分をコメントアウトを外します。

このファイルをブラウザで開き、Performance タブで計測し、`Event Log` を確認します。

left の場合、layout,paint,composite が発生しています。

![css_trigger_1](https://res.cloudinary.com/silverbirder/image/upload/v1656936814/silver-birder.github.io/blog/css_trigger_1.png)

transform の場合、composite のみ発生しています。

![css_trigger_2](https://res.cloudinary.com/silverbirder/image/upload/v1656936814/silver-birder.github.io/blog/css_trigger_2.png)

このように、composite のみで動く CSS プロパティを選ぶと、軽量になります。
次のサイトには、CSS のどのプロパティがレイアウト・ペイント・コンポジットどれを更新するのか分かります。

- https://csstriggers.com/

また、DevTools の Layers タブを開くと、ペイントのカウント回数やレイアウトが見れます。

left の場合の Layers は、次の画像です。
数秒経過しただけで、ペイントカウントが、数百を超えました。

![devtools_layout_1](https://res.cloudinary.com/silverbirder/image/upload/v1656941210/silver-birder.github.io/blog/devtools_layout_1.png)

transform の場合の Layers は、次の画像です。
ペイントカウントが、たったの 2 回に留まりました。

![devtools_layout_2](https://res.cloudinary.com/silverbirder/image/upload/v1656941210/silver-birder.github.io/blog/devtools_layout_2.png)

## 終わりに

レイアウトやペイントについて、調査をしていると、意図せずレイアウトやペイントを実行させていた人も、いるかもしれません。
パフォーマンスは、必要になったときにチューニングすればよいと思いますが、基本知識として本記事についての情報は、知っておいて損はないと思います。

## 参考

- https://gist.github.com/paulirish/5d52fb081b3570c81e3a
- https://dev.opera.com/articles/efficient-javascript/
