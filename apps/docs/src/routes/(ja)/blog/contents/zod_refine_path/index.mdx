---
title: zodのrefineにあるpathにハマった
published: true
date: 2023-01-07
description: zodのrefineを使っていたのですが、pathの使い方を全く理解できておらず、小一時間ほどハマってしまったことがあったので、備忘録として残しておきます。
tags: ["zod"]
---

zod の refine を使っていたのですが、path の使い方を全く理解できておらず、小一時間ほどハマってしまったことがあったので、備忘録として残しておきます。

## 背景

zod を使って、バリデーションロジックを書いていました。
バリデーションで複数フィールドを参照する必要があったため、refine を使っていました。

https://github.com/colinhacks/zod#refine

## path

サンプルコードを以下に示します。

```javascript
import { z } from "zod";

const schema = z.object({
  a: z
    .object({
      first: z.string(),
    })
    .refine(({ first }) => first === "first", {
      path: ["b"],
    }),
});
```

a というオブジェクトに refine を定義しました。refine の第 2 引数の path に `['b']` を定義しました。

schema のテストをしてみます。

```javascript
import test from "tape";

test("invalid", (t) => {
  // Act
  const data = schema.safeParse({
    a: {
      first: "BUG",
    },
  });

  // Assert
  t.deepEqual(data.error.issues[0].path, ["a", "b"]);
  t.end();
});
```

エラー(issue)の path は、`['a', 'b']` になります。めちゃくちゃ当たり前なんですが、以上です。(笑)

stackblitz にも残しておきました。

https://stackblitz.com/edit/nodemon-fkzaw5?file=index.js

zod の github にある path の説明は、`appended to error path` と書いています。
