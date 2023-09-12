---
title: turborepo-remote-cache でキャッシュサーバをセルフホストした
published: true
date: 2022-09-11
description: vercel 製の turborepo という ビルドシステムが爆速なモノレポツールがあります。爆速にする機能の 1 つに、リモートキャッシュというものがあります。この機能は vercel のキャッシュサーバを使うのですが、キャッシュサーバをセルフホストする方法もあります。今回は、それを紹介します。
tags: ["Turborepo"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1662900642/silver-birder.github.io/blog/danny-sleeuwenhoek-YkBaEl7f1C8-unsplash.jpg
---

vercel 製の turborepo という ビルドシステムが爆速なモノレポツールがあります。
爆速にする機能の 1 つに、リモートキャッシュというものがあります。
この機能は vercel のキャッシュサーバを使うのですが、キャッシュサーバをセルフホストする方法もあります。
今回は、それを紹介します。

## なぜ、セルフホストしたいのか

vercel のキャッシュサーバを使う場合、vercel のアカウントが必要です。
[vercel の pricing](https://vercel.com/pricing)を見ると、個人利用(Hobby)では無料ですが、会社(Pro)で使うとすると、`$20 per user / month` という価格になります。費用対効果に見合うならそれで良いかもしれませんが、まだそれがわからない段階でコストをかけられない場面もあると思います。そこで、[公式にも書いてある](https://turborepo.org/docs/core-concepts/remote-caching#custom-remote-caches)とおり、キャッシュサーバをセルフホストする方法があります。

## ローカルで、やってみた

実際に試してみました。ソースコードは、次のリンクにあります。

- https://github.com/silverbirder/turborepo-with-selfhost-remote-cache

手元に Git clone して、README に従って動作確認できると思います。必要なソフトウェアは、Docker と Yarn です。

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

```
# .env
TURBO_TOKEN=mytoken
STORAGE_PATH=/storage/
```

あとは、キャッシュサーバを起動するために、docker-compose を書きます。

```yml
# docker-compose.yml
services:
  remote-cache:
    image: fox1t/turborepo-remote-cache:latest
    env_file:
      - .env
    ports:
      - "3000:3000"
```

次のコマンドで、キャッシュサーバを起動しましょう。

```bash
$ docker-compose up -d
```

これで、キャッシュサーバは PORT:3000 番 で起動します。

### turbo build

では、実際に turborepo からつながるか、試してみます。

turborepo は、`npx create-turbo@latest` で作成できます。
作成後、作成したフォルダで次のコマンドを実行します。

```bash
$ yarn
$ yarn turbo run build --team="team_myteam" --token="mytoken" --api="http://localhost:3000"
```

turbo コマンドのオプションで、3 つ指定します。

- team
  - キャッシュを保存するときの名前空間の役割
- token
  - 先程定義した環境変数
- api
  - キャッシュサーバの URL

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
初回の場合、cache miss となります。ハッシュ値は、`web: 082bae5de9b1745f` と `docs:5a55c6367c8caf01` になります。
キャッシュがローカルに保存されるため、削除します。

```bash
$ rm -rf node_modules/.cache/turbo
```

ではもう一度、turbo build してみましょう。

```bash
$ yarn turbo run build --team="team_myteam" --token="mytoken" --api="http://localhost:3000"
yarn run v1.22.19
$ /Users/silverbirder/docker/node/turborepo-with-selfhost-remote-cache/node_modules/.bin/turbo run build --team=team_myteam --token=mytoken --api=http://localhost:3000
• Packages in scope: docs, eslint-config-custom, tsconfig, ui, web
• Running build in 5 packages
• Remote computation caching enabled
docs:build: cache hit, replaying output 5a55c6367c8caf01
web:build: cache hit, replaying output 082bae5de9b1745f
```

どうでしょうか、`cache hit` と表示されています。手元にキャッシュがないのにも関わらず、リモートのキャッシュサーバにキャッシュがあるため、`cache hit` となります！

### キャッシュオブジェクト

キャッシュのオブジェクトは、ハッシュ値名で、アウトプット(file やログ)のバイナリになります。
Docker コンテナ内で見ると、次のようなファイルが置かれています。

```bash
$ ls -hl storage/team_myteam/
total 5392
-rw-r--r--  1 silverbirder  staff   1.3M Sep 11 16:20 082bae5de9b1745f
-rw-r--r--  1 silverbirder  staff   1.3M Sep 11 16:20 5a55c6367c8caf01
```

--team オプションで指定した名前で、フォルダが作成されています。
そのため、team 毎にキャッシュが作成されます。

### キャッシュとは

turborepo のキャッシュについては、[公式](https://turborepo.org/docs/core-concepts/caching) を読むと良いでしょう。

ざっくりいうと、次の流れで cache miss,cache hit になります。

1. turbo build を実行
2. turbo.json の`build`タスクの inputs(ソースコードなど)や環境変数をハッシュ化
3. キャッシュが既にローカルまたはリモートに存在していなければ、cache miss
4. turbo.json の`build`タスクの outputs(dist フォルダ、標準出力など)をバイナリ化し、ハッシュ名で保存

3 の手順で、キャッシュが存在していれば、`cache hit` となり、outputs が復元します。

## クラウドで、やってみた

キャッシュサーバは、AWS や GCP などのクラウドベンダーにあるコンピューティングリソースへデプロイしましょう。
Docker イメージがあるので、AppRunner や CloudRun が楽にできそうです。

キャッシュストレージは、いまのところ AWS S3 のみ対応とのことです。
AWS S3 のクライアントは、[S3Client を使っているため、GCS にも対応可能](https://zenn.dev/mizchi/articles/s3-compatible-client)です。まあ README に従うなら、S3 に配置するのがベターでしょう。コンピューティングリソースを動かす IAM は、ストレージリソースへの READ/WRITE 権限を足しましょう。

## おわりに

セルフホストして、リモートキャッシュが使えるようになりました。
まだ運用したことがないので、課題を実感していません。引き続き、利用してみようと思います。
