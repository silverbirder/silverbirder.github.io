---
title: 'JavaScriptのdebuggerを使ってデバッグしよう (Browser/Node.js/Jest)'
publishedAt: '2022-07-09'
summary: 'JavaScript の標準機能 `debugger` を使って、デバッグをしましょう。標準機能なので、React などのライブラリでも使えます。'
tags: ["フロントエンド", "開発ツール"]
index: false
---

JavaScript の標準機能 `debugger` を使って、デバッグをしましょう。
標準機能なので、React などのライブラリでも使えます。

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

開いたページで、DevTools も開いておきます。
その状態で、Button をクリックしましょう。

そうすると、次の画像のようになります。

![browser_debugger](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/browser_debugger.png)

`debugger`と書いた箇所で、処理が停止されます。
そのブレークポイントから、ステップイン、ステップアウト、ステップオーバーといった操作ができます。
Console タブで、変数や関数などの実行結果を確認できます。

このように、簡単にデバッグができるようになります。

## Node.js

Node.js でも、同様に `debugger` が使えます。
次の JavaScript コードを用意します。

```javascript
// main.js
debugger;
console.log("Hello World");
```

このファイルを次のコマンドで実行します。

```bash
node --inspect-brk main.js
```

実行すると、次の画像のような出力になります。

![node_debugger_1](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/node_debugger_1.png)

その後、Chrome から `chrome://inspect` にアクセスしてください。
アクセスすると、次の画像の画面になります。

![node_debugger_2](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/node_debugger_2.png)

`Open dedicated DevTools for Node` を Click したら、次の画像のようになります。

![node_debugger_3](https://res.cloudinary.com/silverbirder/image/upload/v1657342289/silver-birder.github.io/blog/node_debugger_3.png)

そうです、さきほどと同じように、`debugger` の箇所で、処理が停止されます。
簡単ですね。

## Jest

テストフレームワークの Jest も、同じように `debugger` が使えます。
次のテストコードを用意します。

```javascript
// main.test.js
test("1 equal 1", () => {
  debugger;
  expect(1).toBe(1);
});
```

このファイルに対して、次のコマンドを実行します。

```bash
## mac
node --inspect-brk node_modules/.bin/jest --runInBand main.test.js
## windows
node --inspect-brk ./node_modules/jest/bin/jest.js --runInBand main.test.js
```

実行すると、次の画像のような出力になります。

![jest_debugger_1](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/jest_debugger_1.png)

また、同じく Chrome から`chrome://inspect` にアクセスすると、同様にデバッグできます。

![jest_debugger_2](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/jest_debugger_2.png)

![jest_debugger_3](https://res.cloudinary.com/silverbirder/image/upload/v1657342288/silver-birder.github.io/blog/jest_debugger_3.png)

Browser,Node.js と同じ使い方になります。
わかりやすいですね。

## 終わりに

IDE やエディタでデバッグ設定することもできますが、こちらの方が断然楽ですね。

## 参考

- https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Statements/debugger
- https://nodejs.org/ja/docs/guides/debugging-getting-started/
- https://jestjs.io/ja/docs/troubleshooting
