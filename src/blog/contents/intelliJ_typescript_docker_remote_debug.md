<!-- 
title: IntelliJ + TypeScript + Docker で Remote Debug (Break Point)
date: 2019-12-28T00:00:00+09:00
draft: false
description: 
image: 
icon: 😎
-->

# TL;DR
1. Dockerコンテナ上で、 `ts-node-dev --inspect=0.0.0.0:9229 ./dist/index.js` を実行

![ts-node-dev](https://res.cloudinary.com/silverbirder/image/upload/v1614345272/silver-birder.github.io/blog/ts-node-dev.png)

2. IntelliJ上で、`Attach to Node.js/Chrome` を実行

`Run > Edit Configuration ... > +ボタン > Attach to Node.js/Chrome`

![Attach to Node.js/Chrome](https://res.cloudinary.com/silverbirder/image/upload/v1614345318/silver-birder.github.io/blog/Attach_to_Node_js_Chrome.png)

3. IntelliJ上でBreakPointを貼り、ブラウザにアクセス

![IntelliJ Breakpoint](https://res.cloudinary.com/silverbirder/image/upload/v1614345359/silver-birder.github.io/blog/IntelliJ_Breakpoint.png)

※ Dockerコンテナでは、アプリ用ポート(8080)と、inspect用ポート(9229)を開放する必要あり

![8080と9229portの開放](https://res.cloudinary.com/silverbirder/image/upload/v1614345390/silver-birder.github.io/blog/8080%E3%81%A89229port%E3%81%AE%E9%96%8B%E6%94%BE.png)
