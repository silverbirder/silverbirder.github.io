---
title: ブラウザのレイアウトとペイントを考慮したパフォーマンス最適化
published: true
date: 2022-07-03
description: XXX
tags: ["Browser", "Layout", "Paint"]
---

ブラウザのレンダリングエンジンにおけるレイアウトやペイントについて気になったので、調べました。
その内容をまとめます。
レンダリングエンジンは、Chrome の Blink を題材とします。

## レンダリングエンジンの処理工程

レンダリングエンジンの処理工程は、次の記事が参考になります。

- https://web.dev/rendering-performance/
- https://blog.leap-in.com/lets-learn-how-to-browser-works/
- https://silver-birder.github.io/blog/contents/learning_browser_engine/
- https://developer.chrome.com/blog/inside-browser-part3/

![レンダリングエンジンの工程](https://res.cloudinary.com/silverbirder/image/upload/v1656816689/silver-birder.github.io/blog/browser_rendering_process.jpg)

各工程の色は、この後使うので、覚えておいてください。

- (図には書いていないけど)Parse
  - HTML と CSS をパース
  - DOM Tree と Style Rules を生成
- JavaScript
  - 視覚的な操作を処理される
- Style
  - HTML 要素が、どの CSS ルールが割り当たるかを決める
  - DOM Tree と Style Rules を紐付けた Render Tree を生成
- Layout
  - HTML 要素の位置と大きさを決める
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

開いたページの DevTools を開き、Performance タブをクリックします。
reload ボタンを押して、計測してみましょう。

![devtools_performance](https://res.cloudinary.com/silverbirder/image/upload/v1656839846/silver-birder.github.io/blog/devtools_performance.png)

計測結果の Main スレッドを見てみましょう。

![devtools_performance_1](https://res.cloudinary.com/silverbirder/image/upload/v1656823105/silver-birder.github.io/blog/devtools_performance_1.png)

さきほど説明したレンダリングエンジンの工程が、見えると思います。

- 青色 `Parse HTML`
- 紫色 `Recalculate Style`
- 紫色 `Layout`
- (黄色は JavaScript 関係)
- (緑色は Paint/Composite 関係)

視覚的に見やすい一方で、全体を網羅してみるのは難しいです。
そこで、下にある `Event Log` を開きます。

![devtools_performance_2](https://res.cloudinary.com/silverbirder/image/upload/v1656823105/silver-birder.github.io/blog/devtools_performance_2.png)

レンダリングエンジンのイベントログが、色とともに表示されています。
ここには、さきほど見れなかった黄色や緑色のものもあります。

### Tips: Performance タブに慣れよう

Performance タブには、様々な情報があります。

いきなりプロダクションリリースされているものに対して、Performance 計測すると、何を診たらよいかわからなくなります。

まずは、最小セットの HTML で見ていくと、情報量が絞られて、読みやすくなります。

また、計測の各場所には、工程の色が使われています。色も合わせて見ると、読みやすくなります。

## ブラウザとリフレッシュレートと 60fps

ブラウザでアニメーションなど動きを出すときに、60fps を目標とすると良いです。

http://jankfree.org/ というサイトから引用します。

> Modern browsers try to refresh the content on screen in sync with a device's refresh rate. For most devices today, the screen will refresh 60 times a second, or 60Hz. If there is some motion on screen (such as scrolling, transitions, or animations) a browser should create 60 frames per second to match the refresh rate.

ブラウザは、リフレッシュレートと同期してコンテンツを更新します。
最近のデバイスは、1 秒間に 60 回更新できるようです。そのため、ブラウザは 60fps で動作すべきです。

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

## レイアウトやペイントからの再実行

JavaScript や CSS を書いていると、DOM を追加してレイアウトが実行されたり、color を変えて、ペイントを実行されたりします。

エンジン的には、シングルスレッドで動いているため、レイアウトの実行やペイントの実行は、できる限り控えたいところです。

## レイアウトスラッシング

JavaScript の以下の関数を使うと、そのときのレイアウト情報を計算する必要があり、レイアウトが強制的に再計算されます。FPS の低下につながる。

- JavaScript
  - https://gist.github.com/paulirish/5d52fb081b3570c81e3a

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

強制レイアウトが発生しているのが、みてとれます。

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

DevTools から見ると、エラーが出ているのが、分かります。

参考までに

- https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/#avoid-forced-synchronous-layouts

requestAnimationFrame を使いましょう。以下に例があります。

- https://blog.wilsonpage.co.uk/preventing-layout-thrashing/

## ペイントとコンポジット

ペイントもコストがかかります。そこで、コンポジット(GPU)に任せることで、メインスレッドを開放し、パフォーマンスが良くなります。
具体的には、コンポジットで動作する transform や opasity とかですね。

- CSS
  - https://csstriggers.com/transform

```html
<style>
  @keyframes return {
    /* 50% {
      transform: translateX(200px);
    }
    100% {
      transform: translateX(0px);
    } */
    50% {
      left: 200px;
    }
    100% {
      left: 0px;
    }
  }

  .box {
    position: relative;
    width: 100px;
    height: 100px;
    left: 0px;
    border: 1px solid black;
    /* will-change: transform; */
  }
  .trans {
    animation-name: return;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease;
  }
</style>
<div class="box trans"></div>
<script>
  const box = document.querySelector(".box");
  const btn = document.querySelector(".btn");
  btn.addEventListener("click", () => box.classList.add("trans"));
</script>
```

参考までに

- https://googlesamples.github.io/web-fundamentals/tools/chrome-devtools/rendering-tools/forcedsync.html
- https://web.dev/stick-to-compositor-only-properties-and-manage-layer-count/

- https://developers.google.com/speed/docs/insights/browser-reflow

```
必要以上に DOM を深くしないようにします。DOM ツリー内の 1 階層での変更が、上はルート、下は変更されたノードの子に至るまで、ツリー内の全階層での変更の引き金になることがあります。それにより、リフローに要する時間がさらに長くなります。
CSS ルールを最小限に抑え、使用されていない CSS ルールを削除します。
アニメーションなどの複雑なレンダリングの変更は、フローの外で行うようにします。これは「position: absolute」や「position: fixed」を使用することで実現できます。
不必要で複雑な CSS セレクタの使用は避けます。特に、セレクタの照合に CPU パワーを必要とする子孫セレクタの使用は避けます。
```

## ペイントを DevTools で見よう

DevTools からペイントのカウント回数やレイアウトが見れます。
レイアウトを分けると、ペイントの描画が独立されるため、パフォーマンスがよいです。
具体的には、translateZ のような 3 次元の CSS を使うと分離されます。

## その他

https://dev.opera.com/articles/efficient-javascript/

## 参考

https://gist.github.com/paulirish/5d52fb081b3570c81e3a
http://jankfree.org/
https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/
https://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
https://web.dev/speed-layers/
https://dev.opera.com/articles/efficient-javascript/?page=3#reflow
https://medium.com/swlh/what-the-heck-is-repaint-and-reflow-in-the-browser-b2d0fb980c08
https://developers.google.com/speed/docs/insights/browser-reflow
http://www.stubbornella.org/content/2009/03/27/reflows-repaints-css-performance-making-your-javascript-slow/
https://engineering.linecorp.com/ja/blog/reflow-and-markup-optimization/
https://qiita.com/jkr_2255/items/5cdead4ee7fa289bfeed
http://www.inazumatv.com/contents/archives/8167
https://scrapbox.io/pastak-pub/%E3%83%95%E3%83%AD%E3%83%B3%E3%83%88%E3%82%A8%E3%83%B3%E3%83%89%E3%83%AF%E3%83%BC%E3%82%AF%E3%82%B7%E3%83%A7%E3%83%83%E3%83%97_DOM%E3%81%A8%E3%83%AC%E3%83%B3%E3%83%80%E3%83%AA%E3%83%B3%E3%82%B0%E3%83%91%E3%83%95%E3%82%A9%E3%83%BC%E3%83%9E%E3%83%B3%E3%82%B9
https://github.com/GoogleChrome/devtools-samples
https://blog.wilsonpage.co.uk/preventing-layout-thrashing/
