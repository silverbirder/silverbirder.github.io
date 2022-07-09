---
title: Tips：JavaScriptのdebuggerを使ってデバッグしよう (Chrome/Node.js/Jest)
published: true
date: 2022-07-09
description: XX
tags: ["JavaScript", "Debugger"]
---

JavaScript の標準機能 `debugger` を使って、ブレークポイントデバッグをしましょう。
標準機能なので、React などのライブラリでも使えます。

<ogp-me src="https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/debugger"></ogp-me>

## Browser

次の HTML ファイルを Chrome で開きます。

```html
<button>Button</button>
<script>
  document.querySelector("button").addEventListener("click", () => {
    debugger;
    alert("Hello World");
  });
</script>
```

また、DevTOols も開いておきます。
その状態で、Button をクリックしましょう。
そうすると、次の画像のようになります。

![browser_debugger](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/browser_debugger.png)

## Node

Node.js でも、使えます。

```javascript
// main.js
debugger;
console.log("Hello World");
```

```bash
node --inspect-brk main.js
```

- https://nodejs.org/ja/docs/guides/debugging-getting-started/

Chrome から`chrome://inspect` にアクセス。
`Open dedicated DevTools for Node` を Click したら、デバッグできます。

![node_debugger_1](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/node_debugger_1.png)

![node_debugger_2](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/node_debugger_2.png)

![node_debugger_3](https://res.cloudinary.com/silverbirder/image/upload/v1657342289/silver-birder.github.io/blog/node_debugger_3.png)

## Jest

```javascript
// main.test.js
test("1 equal 1", () => {
  debugger;
  expect(1).toBe(1);
});
```

```bash
node --inspect-brk node_modules/.bin/jest --runInBand main.test.js
or on Windows
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand main.test.js
```

また、同じく Chrome から`chrome://inspect` にアクセスすると、同様にデバッグできます。

![jest_debugger_1](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/jest_debugger_1.png)

![jest_debugger_2](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/jest_debugger_2.png)

![jest_debugger_3](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/jest_debugger_3.png)

## 終わりに

IDE やエディタでデバッグ設定することもできますが、こちらの方が断然楽ですね。
