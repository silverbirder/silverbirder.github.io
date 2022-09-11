---
title: turborepo-remote-cache でキャッシュサーバをセルフホストした
published: true
date: 2022-09-11
description: XXX
tags: ["Turborepo"]
---

vercel 製の turborepo という ビルドシステムが爆速なモノレポツールがあります。
爆速にする機能の 1 つに、remote cache というものがあります。
この機能は vercel のキャッシュサーバを使うのですが、キャッシュサーバをセルフホストする方法もあります。
今回は、それを紹介します。

## なぜ、セルフホストしたいのか

vercel のキャッシュサーバを使う場合、vercel のアカウントが必要です。
[vercel の pricing](https://vercel.com/pricing)を見ると、個人利用(Hobby)では無料ですが、会社(Pro)で使うとすると、`$20 per user / month` という価格になります。
費用対効果に見合うならそれで良いかもしれませんが、まだそれがわからない段階でコストをかけられない場面もあると思います。
そこで、公式にも書いてあるとおり、キャッシュサーバをセルフホストする方法があります。

- https://turborepo.org/docs/core-concepts/remote-caching#custom-remote-caches

## ローカルで、やってみた

実際に試してみました。ソースコードは、次のリンクにあります。

- https://github.com/Silver-birder/turborepo-with-selfhost-remote-cache

手元に Git clone して、README に従って動作確認できると思います。必要なソフトウェアは、Docker と yarn です。

### キャッシュサーバの準備

セルフホストする場合、キャッシュサーバを建てる必要があります。
キャッシュサーバは、https://github.com/fox1t/turborepo-remote-cache を使うと良いです。
Docker イメージが公開されているので、それを使っても良いですし、自前で `docker build` しても良いです。

- Docker イメージ
  - https://hub.docker.com/r/fox1t/turborepo-remote-cache

キャッシュサーバには、最低でも次の 2 つを環境変数を設定する必要があります。

- TURBO_TOKEN
  - turborepo と api を繋げるための TOKEN
- STORAGE_PATH
  - キャッシュオブジェクトを保存するパス
  - STORAGE_PROVIDER が `s3` を指定する場合は、バケット名

簡単にするため、次の.env ファイルを用意しました。

```.env
TURBO_TOKEN=mytoken
STORAGE_PATH=/storage/
```

あとは、キャッシュサーバを起動するために、docker-compose を書きます。

```yml
services:
  remote-cache:
    image: fox1t/turborepo-remote-cache:latest
    env_file:
      - .env
    ports:
      - "3000:3000"
    volumes:
      - ./storage/:/tmp/storage/
```

実際にキャッシュオブジェクトを見たいので、volumes でマウントしています。
VSCode でサイドバーにある Docker からでも、ストレージが見れるので、なくても良いです。

```bash
$ docker-compose up -d
```

これで、キャッシュサーバは PORT:3000 番 で起動します。
では、実際に turborepo からつながるか、試してみます。

turborepo は、`npx create-turbo@latest` で作成できますし、
https://github.com/Silver-birder/turborepo-with-selfhost-remote-cache にはすでに turborepo が入っています。

```bash
$ yarn
$ yarn turbo run build --team="team_myteam" --token="mytoken" --api="http://localhost:3000"
```

--team は、キャッシュを保存するときの名前空間の役割になります。
--token は、先程環境変数で定義したモノです。
--api は、キャッシュサーバの URL です。

実行すると次のログが表示されるはずです。

```bash
yarn run v1.22.19
turbo run build --team=team_myteam --token=mytoken --api=http://localhost:3000
• Packages in scope: docs, eslint-config-custom, tsconfig, ui, web
• Running build in 5 packages
• Remote computation caching enabled
web:build: cache miss, executing 082bae5de9b1745f
docs:build: cache miss, executing 5a55c6367c8caf01
...
```

`Remote computation caching enabled` で、リモートキャッシュが有効となりました。
初回の場合、cache miss となります。
リモートキャッシュの動作がみたいので、手元のキャッシュを削除します。

```
$ rm -rf node_modules/.cache/turbo
```

これで、もう一度、実行すると

```
$ yarn turbo run build --team="team_myteam" --token="mytoken" --api="http://localhost:3000"
yarn run v1.22.19
$ /Users/silverbirder/docker/node/turborepo-with-selfhost-remote-cache/node_modules/.bin/turbo run build --team=team_myteam --token=mytoken --api=http://localhost:3000
• Packages in scope: docs, eslint-config-custom, tsconfig, ui, web
• Running build in 5 packages
• Remote computation caching enabled
docs:build: cache hit, replaying output 5a55c6367c8caf01
web:build: cache hit, replaying output 082bae5de9b1745f
```

手元にキャッシュがないのに、リモートにキャッシュがあるため、キャッシュヒットしました。

### キャッシュ

https://turborepo.org/docs/core-concepts/caching を読むと良いでしょう。

ざっくりいうと、ソースコードや環境変数をインプット(turbo.json の inputs)としてハッシュ化し、生成されたファイルやログといったアウトプット(turbo.json の outputs)をバイナリとして保存します。もしキャッシュヒットした場合は、アウトプットを復元します。つまり、dist やログが復元されます。

## クラウドで、やってみた

キャッシュサーバは、AWS や GCP などのクラウドベンダーにあるコンピューティングリソースへデプロイしましょう。
Docker イメージがあるので、AppRunner や CloudRun が楽にできそうです。

キャッシュストレージは、いまのところ AWS S3 のみ対応とのことです。
https://zenn.dev/aiji42/articles/7bc1b6df91dd76 の記事に書いてあるとおり、S3Client は GCS にも疎通できるとのことなので、
GCS でも使おうと思ったら使えます。が、まあ README に従うなら、S3 に配置するのがベターでしょう。

コンピューティングリソースは、キャッシュオブジェクトへの READ/WRITE 権限が必要です。
そのため、コンピューティングリソースを動かす IAM は、ストレージリソースへの READ/WRITE 権限を足しましょう。

## おわりに

セルフホストして、リモートキャッシュが使えるようになりました。
まだ運用したことがないので、課題を実感していません。引き続き、利用してみようと思います。
