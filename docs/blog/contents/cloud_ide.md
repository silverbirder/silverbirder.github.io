---
title: コロナ禍におけるエンジニアのためのCloud IDE
published: true
date: 2020-12-12
description: 2020年3月頃からコロナが流行りだし、もう12月になります。働き方が大きく変わり、リモートワークが当たり前の時代となりました。エンジニアの働き方も同様に変わりました。そこで、今回はCloud IDEというものを紹介しようと思います。
tags: ["Cloud IDE", "Engineer"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1613138210/silver-birder.github.io/blog/20201211224606.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1613138210/silver-birder.github.io/blog/20201211224606.png
---

2020年3月頃からコロナが流行りだし、もう12月になります。働き方が大きく変わり、リモートワークが当たり前の時代となりました。
エンジニアの働き方も同様に変わりました。そこで、今回はCloud IDEというものを紹介しようと思います。

<!--  TODO: TOC -->

# リモートワークとDaaS

リモートワークが増えると、DaaSのようなサービスを利用する企業が増えたのではないでしょうか。
DaaSの簡単な説明を引用しますと、次のとおりです。

> DaaSとは、“Desktop as a Service”の頭文字を取った略語で「ダース」と読みます。
普通ならば個人のPCにデスクトップは存在し、データは個人のPC内に保存されていますが、DaaSにおいては個人のデスクトップがクラウド上に構築され、ネットワークを通じてそのデスクトップを呼び出して利用することになります。
ここでは、DaaSとはどういう仕組みなのかを説明し、その必要性、メリットについて詳しく述べていきます。

> DaaSはクラウドサービスの一種で、特定のソフトウェアを端末にインストールすることなく、ネットワークを通じて利用できるという特徴があります。
クラウド上にあるデスクトップ環境を呼び出して利用できるため、個人のPCはディスプレイとキーボードなど必要最低限の機能があれば良いので、テレワークをするために高いスペックのPCを用意する必要はありません。

※ [https://www.ascentech.co.jp/solution/column/daas.html](https://www.ascentech.co.jp/solution/column/daas.html)


例えば、クラウド上で開発環境(お気に入りのエディタ, プログラミング言語, 使い慣れたツール, etc)を構築して、そこにアクセスして仕事をするようになります。アクセス元は、私物のPCや会社から支給されているPCなどが多いと思います。

# Cloud IDE

Cloud IDEは、クラウドにある統合開発環境(IDE)のことで、主にブラウザから操作できるようなものが多いです。
ざっと有名なものをリストアップしてみました。

|提供元|IDE名|
|--|--|
|Microsoft Azure|Visual Studio Codespaces|
|Github|Codespaces|
|Amazon Web Services|Cloud9|
|Google Cloud Platform|Cloud Shell Editor|
|Coder|Coder|
|OSS|Gitpod|

ブラウザで見ると、どんなUIでしょうか。いくつか例を載せておきます。

<figure title="github-codespaces">
<img alt="visual studio codespaces" src="https://visualstudio.microsoft.com/wp-content/uploads/2020/09/codespaces-vs.png">
<figcaption><a href="https://github.co.jp/features/codespaces">https://github.co.jp/features/codespaces</a></figcaption>
</figure>

<figure title="cloud-shell-editor">
<img alt="cloud shell editor" src="https://storage.googleapis.com/gweb-cloudblog-publish/images/Cloud_shell_editor.max-2000x2000.jpg">
<figcaption><a href="https://cloud.google.com/blog/ja/products/application-development/introducing-cloud-shell-editor">https://cloud.google.com/blog/ja/products/application-development/introducing-cloud-shell-editor</a></figcaption>
</figure>

<figure title="gitpod">
<img alt="gitpod" src="https://www.gitpod.io/images/gitpod-editor.jpg">
<figcaption><a href="https://www.gitpod.io">https://www.gitpod.io</a></figcaption>
</figure>

Cloud Shell EditorやGitpodは、OSSの **Theia** というものを使っています。
また、全体的にUIがとても似ていますよね。これは、次の記事でわかりやすく説明されていますので、ご興味があればお読みください。

<ogp-me src="https://qiita.com/monamour555/items/f93287c273a388261968"></ogp-me>

これらのCloud IDEは、ここ最近Publickeyでよく目にします。記事と投稿日時をまとめてみました。

* [https://www.publickey1.jp/blog/20/visual_studio_codeeclipse_theia_10vs_codeweb.html](https://www.publickey1.jp/blog/20/visual_studio_codeeclipse_theia_10vs_codeweb.html)
  * 2020年4月3日 投稿
* [https://www.publickey1.jp/blog/20/githubwebidecodespacesgithub.html](https://www.publickey1.jp/blog/20/githubwebidecodespacesgithub.html)
  * 2020年5月7日 投稿
* [https://www.publickey1.jp/blog/20/webidevisual_studio_codespaecsgithub_codespaces.html](https://www.publickey1.jp/blog/20/webidevisual_studio_codespaecsgithub_codespaces.html)
  * 2020年9月7日 投稿
* [https://www.publickey1.jp/blog/20/githubgitlabwebidegitpodgithub_codespaces.html](https://www.publickey1.jp/blog/20/githubgitlabwebidegitpodgithub_codespaces.html)
  * 2020年9月11日 投稿
* [https://www.publickey1.jp/blog/20/googlevscodeeclipse_theiagoogle_cloud_shell.html](https://www.publickey1.jp/blog/20/googlevscodeeclipse_theiagoogle_cloud_shell.html)
  * 2020年11月10日 投稿

稚拙な推測ですが、リモートワークが普及し、働く環境も変化したためかなと思っています。
物理的なPCで開発するのではなく、クラウド上にあるPCで開発する、それが当たり前になるのかなと。

# Theia

Theiaとは何か、Githubのaboutより引用します。

> Eclipse Theia is a cloud & desktop IDE framework implemented in TypeScript

※ [https://github.com/eclipse-theia/theia](https://github.com/eclipse-theia/theia)

このOSSの興味深いところの1つに、設計書が公開されているところです。

<ogp-me src="https://docs.google.com/document/d/1aodR1LJEF_zu7xBis2MjpHRyv7JKJzW7EWI9XRYCt48"></ogp-me>

Theiaは、ローカルで動かすことができます。Webアプリだけじゃなく、ネイティブアプリ(Electron)もあります。

<ogp-me src="https://github.com/eclipse-theia/theia/blob/master/doc/Developing.md#quick-start"></ogp-me>

また、Dockerコンテナも公開されています。

<ogp-me src="https://github.com/theia-ide/theia-apps"></ogp-me>

ベンダーニュートラルなので、VMインスタンスにTheiaを入れて独自に運用するなど、ベンダーに依存しません。

# 個人的な話

個人的に、Gitpodを使いたいのですが無料だと月50時間までしか使えません。

<ogp-me src="https://www.gitpod.io/pricing/"></ogp-me>

"Professional Open Source" というものを応募したところ、[Gitpodの組織](https://github.com/gitpod-io) へ招待頂き、公開リポジトリの無制限利用ができるようになりました。

# Gitpodを使い続けて思うこと

Gitpodは、.gitpod.ymlというファイルで環境構築されます。

<ogp-me src="https://www.gitpod.io/docs/configuration/"></ogp-me>

ベースとなるDockerイメージを指定して、必要なライブラリを事前にインストールできたりします。
公式ブログに、Gitpodの完全ガイドがあります。

<ogp-me src="https://www.gitpod.io/blog/gitpodify/"></ogp-me>

また、様々なOSSをGitpodで簡単に動作確認できます。

[https://contribute.dev/](https://contribute.dev/)

実際にGitpodを使ってみると、確かに便利です。
アクセス元のPCは、非力なノートPCでも良く、GithubのRepository毎にGitpodのコンテナがあるため、相互に影響しません。
ただ、ネットワーク遅延でちょっと待ったり、Gitpodのショートカットキーより、ブラウザのショートカットキーが上書きされて困ることが多少あります。

# 終わりに
ブラウザ上で開発するのって、昔からあったように思いますが、あんまり注目されていなかったのでしょうか（私が無知なだけかもしれません）。
AWSやGCP、Githubなど各社が積極的に手を出しているところを見ると、これからますます期待できる分野なのだと思います。
