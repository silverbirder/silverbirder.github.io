---
title: CI/CDのDaggerで、GithubActionsとCircleCIにシュッと連携してみた
published: true
date: 2022-08-23
description: 前々から気になっていた、CI/CD の非ベンダーロックインな Dagger というツールを試してみました。本記事では、試した内容について共有しようと思います。
tags: ["Dagger", "CI", "CD", "GithubActions", "CircleCI"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1661254015/silver-birder.github.io/blog/igor-bispo-sV5JRC3t71M-unsplash.jpg
---

前々から気になっていた、CI/CD の非ベンダーロックインな Dagger というツールを試してみました。
本記事では、試した内容について共有しようと思います。

## CI/CD のパイプラインを書く

Dagger では、[CUE](https://cuelang.org/) という言語を使って CI/CD のパイプラインを書きます。
[公式サイトのチュートリアル](https://docs.dagger.io/1200/local-dev)から、そのまま使ってみます。
コードは、次のようなものになります。

```go
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
actions は、実行するものを定義していて、`dagger do <action名>` のようにして使います。
上の定義にある`source: core.#Source` は、 `source` がアクション名で、`core` が実行するパッケージになります。
パッケージは、次の 2 つに分類されます。

- [dagger.io](https://github.com/dagger/dagger/tree/v0.2.0/pkg/dagger.io)
  - 標準機能
    - core
- [universe.dagger.io](https://github.com/dagger/dagger/tree/v0.2.0/pkg/universe.dagger.io)
  - 非標準機能
    - yarn, netlify, aws, bash, etc

## ローカル環境で Dagger を動かす

実際にローカルで動かしてみます。

```bash
$ dagger do test
[✔] actions.test.container                                                                                                                11.6s
[✔] actions.test.install.container.script                                                                                                  0.1s
[✔] actions.source                                                                                                                         0.5s
[✔] actions.test.install.container                                                                                                         2.3s
[✔] actions.test.container.script                                                                                                          0.1s
[✔] actions.test.install.container.export                                                                                                  0.0s
[✔] actions.test.container.export                                                                                                          0.2s
Field  Value
logs   """\n  yarn run v1.22.17\n  $ react-scripts test\n  Done in 6.78s.\n\n  """
```

特に問題なく、PASS しています。`--log-format plain` をつけると、実行の詳細な情報が出力されます。

```bash
$ dagger do test --log-format plain
8:06PM INFO  actions.test.install.container.script._write | computing
8:06PM INFO  actions.test.container._image._dag."0"._pull | computing
8:06PM INFO  actions.test.install.container._image._dag."0"._pull | computing
8:06PM INFO  actions.test.container.script._write | computing
8:06PM INFO  actions.source | computing
...
```

ちなみに、`actions.source` が実行されているのは、`actions.test`が`actions.source`に依存しているためと思います。

```bash
$ NETLIFY_TOKEN=**** USER=**** dagger do deploy
[✔] actions.deploy.container.script                                                                                                        0.2s
[✔] actions.build.install.container                                                                                                        3.8s
[✔] client.env                                                                                                                             0.0s
[✔] actions.source                                                                                                                         0.4s
[✔] actions.build.install.container.script                                                                                                 0.2s
[✔] actions.build.container                                                                                                               21.0s
[✔] actions.build.container.script                                                                                                         0.2s
[✔] actions.deploy                                                                                                                         4.8s
[✔] actions.build.install.container.export                                                                                                 0.1s
[✔] actions.build.container.export                                                                                                         0.1s
[✔] actions.deploy.container                                                                                                              91.0s
[✔] client.filesystem."./build".write                                                                                                      0.3s
[✔] actions.deploy.container.export                                                                                                        0.0s
Field      Value
site       "****-dagger-todoapp"
url        "https://******-dagger-todoapp.netlify.app"
deployUrl  "https://xxxx--******-dagger-todoapp.netlify.app"
logsUrl    "https://app.netlify.com/sites/******-dagger-todoapp/deploys/xxxx"
```

ローカル環境で、CI/CD のパイプラインコードを動かくことができました。
次は、CI と連携したいと思います。

## CircleCI で Dagger を動かす

まずは、CircleCI で Dagger を動かしてみます。
CircleCI の yml ファイルは、次の定義になります。

```yaml
# .circleci/config.yml
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

CircleCI の環境変数に、`NETLIFY_TOKEN`と`USER`を設定しておきます。
この定義ファイルは、Dagger をインストールして、先程ローカル環境で動かしていた `dagger do test` や `dagger do deploy` を実行しているだけです。

この定義は、CircleCI 上で PASS します。めちゃくちゃ簡単ですね。

## GithubActions で Dagger を動かす

次は、GithubActions で Dagger を動かしてみます。
GithubActions の yml ファイルは、次の定義になります。

```yaml
# .github/workflows/todoapp.yml
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

ここの定義も、CircleCI の定義とほとんど一緒だと思います。
ただ、少し違うのは、GithubActions では、`uses: dagger/dagger-for-github@v3` が使えるため、
`cmds`が、`do test` や `do deploy` のように、`dagger`を書かなくて済むようになります。

GithubActions の環境変数に、`NETLIFY_TOKEN`と`USER`を設定しておきます。
そうすれば、このパイプラインも成功します。

## 終わりに

ローカル環境で、CI/CD のパイプラインをテストできて、それをシュッと CI サービスに連携できました。
今回は、チュートリアルのものをそのまま使っているので、テストやデプロイがシンプルな構成になっていましたが、
実務になると、より複雑な構成になると思うので、手元で確認できるのは良いものと思いました。
ただし、`CUE`への学習コストがかかるため、導入する際は、そのあたりも含めて検討しましょう。
