---
title: CI/CDのDagger入門、GithubActionsとCircleCIにシュッと連携してみた
published: true
date: 2022-08-23
description: xx
tags: ["Dagger", "CI", "CD"]
---

前々から気になっていた、CI/CD の非ベンダーロックインな Dagger というツールを試してみました。
本記事では、試した内容について共有しようと思います。

## CI/CD のパイプラインを書く

Dagger では、CUE という言語を使って CI/CD のパイプラインを書きます。
[公式サイトのチュートリアル](https://docs.dagger.io/1200/local-dev)から、そのまま使ってみます。
コードは、次のようなものになります。

```
package todoapp

import (
	"dagger.io/dagger"

	"dagger.io/dagger/core"
	"universe.dagger.io/netlify"
	"universe.dagger.io/yarn"
)

dagger.#Plan & {
	actions: {
		source: core.#Source & {
			path: "."
			exclude: [
				"node_modules",
				"build",
				"*.cue",
				"*.md",
				".git",
			]
		}

		build: yarn.#Script & {
			name:   "build"
			source: actions.source.output
		}

		test: yarn.#Script & {
			name:   "test"
			source: actions.source.output
			container: env: CI: "true"
		}

		deploy: netlify.#Deploy & {
			contents: actions.build.output
			site:     string | *"dagger-todoapp"
		}
	}
}
```

見慣れない構文かもしれませんが、何をやっているかはなんとなく分かるんじゃないかなと思います。
actions は、実行するものを定義していて、`dagger do build` のようにして使います。

## ローカル環境で Dagger を動かす

実際にローカルで動かしてみます。
テストとデプロイをやってみます。

```
$ dagger do test
```

```
$ dagger do deploy
```

どちらも成功しました。

## CircleCI で Dagger を動かす

```yaml
version: 2.1

jobs:
  install-and-run-dagger:
    docker:
      - image: cimg/base:stable
    steps:
      - checkout
      - setup_remote_docker:
          version: "20.10.14"
      - run:
          name: "Install Dagger"
          command: |
            cd /usr/local
            wget -O - https://dl.dagger.io/dagger/install.sh | sudo sh
            cd -
      - run:
          name: "Update project"
          command: |
            dagger project init
            dagger project update
      - run:
          name: "Testing"
          command: |
            dagger do test --log-format plain
      - run:
          name: "Deploy to Netlify"
          command: |
            dagger do deploy --log-format plain

workflows:
  dagger-workflow:
    jobs:
      - install-and-run-dagger
```

`dagger do test` や `dagger do deploy` が、dagger のコードです。

- GithubActions で Dagger を動かす

```yaml
name: todoapp

on:
  push:
    branches:
      - main

jobs:
  dagger:
    runs-on: ubuntu-latest
    steps:
      - name: Clone repository
        uses: actions/checkout@v2
      - name: Update project
        uses: dagger/dagger-for-github@v3
        with:
          version: 0.2
          cmds: |
            project init
            project update
      - name: Testing
        uses: dagger/dagger-for-github@v3
        with:
          version: 0.2
          cmds: |
            do test
      - name: Deploy to Netlify
        uses: dagger/dagger-for-github@v3
        with:
          version: 0.2
          cmds: |
            do deploy
        env:
          USER: ${{ secrets.USER }}
          NETLIFY_TOKEN: ${{ secrets.NETLIFY_TOKEN }}
```

`do test`や`do deploy`が、dagger のコードです。
`dagger/dagger-for-github@v3` というのを `uses`していますが、
CircleCI のコードのように、dagger をインストールして使うだけでも大丈夫です。

- 終わりに

ローカル環境で、CI/CD のパイプラインをテストできて、それをシュッと CI サービスに連携できました。
今回は、チュートリアルのものをそのまま使っているので、テストやデプロイがシンプルな構成になっていましたが、
実務になると、より複雑な構成になると思うので、手元で確認できるのは良いものと思いました。
