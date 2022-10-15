---
title: XX
published: true
date: 2022-10-14
description: XXXX
tags: [""]
---

## 書くこと

graphql guild 便利だな。
どう便利？

有名なのは、graphql codegen。
graphql schema から typescriptの型を生成してくれるやつ。

graphql config を書くと、guildの様々なツールでそのまま使える。

1. graphql schemaをとってこれる
よく、バックエンドのrepoをgit submoduleやgit clone graphql schemaで取るみたいなことが多いと思うけど、
graphqlの公開しているURLがわかれば、そこからschemaを手元に生成できる。

2. graphiql が configだけで動く

yoga を入れたら、configを勝手にみてくれて、graphiql が動く。
便利。

3. cli で いろいろ便利なのがある

graphql schemaのどれを使っているかcoverage、
手元でもっているschemaとリモートにあるschemaのdiffが知れる、
documentが、schemaからバリデートしてくれるvalidate (queryのfieldとかdeprecatedとか)

