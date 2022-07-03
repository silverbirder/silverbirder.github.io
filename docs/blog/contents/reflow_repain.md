---
title: ブラウザのレイアウトとペイントを考慮したパフォーマンス最適化
published: true
date: 2022-07-03
description: XXX
tags: ["Browser", "Layout", "Paint"]
---

Web のフロントエンドエンジニアは、ブラウザのレンダリングエンジンについて知っておいて損はないと思います。
そこで、レンダリング工程のレイアウトとペイントについて、最近調べたことをまとめます。

※ レンダリングエンジンは、Chrome の Blink を題材とします

## 背景

XXX

## レンダリングエンジンの動き

レンダリングエンジンの工程は、次の記事が参考になります。

- https://web.dev/rendering-performance/
- https://blog.leap-in.com/lets-learn-how-to-browser-works/
- https://silver-birder.github.io/blog/contents/learning_browser_engine/

![レンダリングエンジンの工程](https://res.cloudinary.com/silverbirder/image/upload/v1656816689/silver-birder.github.io/blog/browser_rendering_process.jpg)

各工程の色は、この後使うので、覚えておいてください。

- Parse
  - html をパース
- JavaScript
  - 視覚的な操作を処理される
- Style
  - どの要素にどの CSS ルールが割り当たるか
- Layout
  - どの位置に配置されるか
- Paint
  - 描画する
- Composite
  - レイヤーを合成する
  - メインスレッドから、異なるスレッドで動く.
  - GPU

## DevTools でレンダリング工程を見てみる

シンプルな HTML を Chrome でで開いてみましょう。

```html
<div>Hello</div>
```

開いたページで DevTools を開き、Performance タブをクリックし、計測してみると、次の画像になります。

![devtools_performance_1](https://res.cloudinary.com/silverbirder/image/upload/v1656823105/silver-birder.github.io/blog/devtools_performance_1.png)

![devtools_performance_2](https://res.cloudinary.com/silverbirder/image/upload/v1656823105/silver-birder.github.io/blog/devtools_performance_2.png)

説明にあった色と工程が見えると思います。

## レイアウトやペイントからの再実行

JavaScriptやCSSを書いていると、DOMを追加してレイアウトが実行されたり、colorを変えて、ペイントを実行されたりします。

エンジン的には、シングルスレッドで動いているため、レイアウトの実行やペイントの実行は、できる限り控えたいところです。

## レイアウトスラッシング

JavaScriptの以下の関数を使うと、そのときのレイアウト情報を計算する必要があり、レイアウトが強制的に再計算されます。FPSの低下につながる。

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

DevToolsから見ると、エラーが出ているのが、分かります。

参考までに

- https://web.dev/avoid-large-complex-layouts-and-layout-thrashing/#avoid-forced-synchronous-layouts

requestAnimationFrame を使いましょう。以下に例があります。

- https://blog.wilsonpage.co.uk/preventing-layout-thrashing/

## ペイントとコンポジット

ペイントもコストがかかります。そこで、コンポジット(GPU)に任せることで、メインスレッドを開放し、パフォーマンスが良くなります。
具体的には、コンポジットで動作するtransformやopasityとかですね。

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

## ペイントをDevToolsで見よう

DevToolsからペイントのカウント回数やレイアウトが見れます。
レイアウトを分けると、ペイントの描画が独立されるため、パフォーマンスがよいです。
具体的には、translateZのような3次元のCSSを使うと分離されます。

## ジャンクと 60fps

レンダリングの目標値として、60fps があります。

- http://jankfree.org/

> Modern browsers try to refresh the content on screen in sync with a device's refresh rate. For most devices today, the screen will refresh 60 times a second, or 60Hz. If there is some motion on screen (such as scrolling, transitions, or animations) a browser should create 60 frames per second to match the refresh rate.

> Jank is any stuttering, juddering or just plain halting that users see when a site or app isn't keeping up with the refresh rate. Jank is the result of frames taking too long for a browser to make, and it negatively impacts your users and how they experience your site or app.

DevToolsで、fpsを見れるようにしましょう。

- https://googlechrome.github.io/devtools-samples/jank/


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
