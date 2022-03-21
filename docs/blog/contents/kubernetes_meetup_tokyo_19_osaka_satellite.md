---
title: 【大阪・梅田】Kubernetes Meetup Tokyo #19 大阪サテライト- 2019年5月31日参加レポート
published: true
date: 2019-06-01
description: 大阪からKubernetes Meetup Tokyoに参加できるとのことで、こちらに参加してきました。Kubernetesの生みの親である3人の内の1人のJoe Bedaから、Kubernetesの歴史の経緯について教えて頂きました。その話がとてもわかりやすく、なるほどなと思ったので、ぜひとも共有したいと思います。
tags: ["Report", "Kubernetes", "Tokyo", "Osaka"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614428700/silver-birder.github.io/blog/kubernetes_osaka_satellite.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614428700/silver-birder.github.io/blog/kubernetes_osaka_satellite.png
---

大阪からKubernetes Meetup Tokyoに参加できるとのことで、こちらに参加してきました。
Kubernetesの生みの親である3人の内の1人のJoe Bedaから、**Kubernetesの歴史**の経緯について教えて頂きました。
その話がとてもわかりやすく、なるほどなと思ったので、ぜひとも共有したいと思います。

<iframely-embed card="small" url="https://k8sjp-osaka.connpass.com/event/131981/"></iframely-embed>

※ 以降の内容は、私なりの解釈が入っており誤った認識かもしれません。ご了承下さい。
発表の内容は全てYoutubeにありますので、そちらが正しいものです。ご参考下さい。

<iframely-embed url="https://www.youtube.com/watch?v=ETHGx8_Q-1k"></iframely-embed>

<!--  TODO: TOC -->

# Who is Joe Beda ?
> Joe Beda は、Kubernetes の co-founder（共同創設者/最初に開発した3人のうちの1人）/ 昨年 VMware に買収された Heptio の CTO / O'Reilly「Kubernetes: Up & Running」 (邦題「入門Kubernetes」）の共著者で、現在も Kubernetes をリードしている1人です。今回は、Kubernetes のこれまでと未来についてお話いただきます。

※ [https://k8sjp.connpass.com/event/126207/](https://k8sjp.connpass.com/event/126207/)

Kubernetesの最初のコミッターで、超有名人。
Googleで働いていたときは、KubernetesやCompute Engineを作っていたそうです。

Joeさん曰く、プラットフォームで開発する上でおもしろいことは、下記２点のバランスだと仰っていました。

1. ユーザーが**簡単**に使ってもらえる事
2. 想定していなかった使われ方があった場合の柔軟性

私なりの解釈で言うと、例えば、GCPというプラットフォームの中で、GKEを使うとします。
ボタンをポチポチするだけでクラスターが作成されますよね。簡単で使ってみたくなります。

ただ、簡単だけだと細かい要求を満たせないので、オプションを設定できるようにしたり、
カスタマイズしやすいものへ改善されていきます。柔軟性ってことでしょうか？
この柔軟性をしすぎると複雑になってしまい、ユーザーが使ってくれなくなる恐れがあります（マニアックなユーザーは残るかもしれないけど）。
そこのバランスが大切なのかなと思いました。

Joeさんの詳細な説明は[こちら](https://www.linkedin.com/in/jbeda)です。

# The origins and future of Kubernetes (en/英語)
Joeさんは英語で話されてました。
CPCAmerica(?)の田中さんが通訳をされていたのですが、ものすごくわかりやすかったです。感謝です！
あと、記憶力はんぱねぇ...。

<o-embed src="https://twitter.com/mumoshu/status/1134438272518635521?s=20" height="400px"></o-embed>

※ 以下、[@‏apstndb](https://twitter.com/apstndb) さんの要約Tweetを参考にしました。神!!!

<o-embed src="https://twitter.com/silver_birder/status/1134406467744804864?s=20" height="400px"></o-embed>

## kubernetesの歴史
### Borgの誕生
Googleでは、BigDataを処理するための[MapReduce](https://ja.wikipedia.org/wiki/MapReduce)を開発していました。
MapReduceを扱うために、[GlobalWorkQueue](https://www.slideshare.net/hasanveldstra/the-anatomy-of-the-google-architecture-fina-lv11/34-GWQ_Google_Workqueue_ulliBatch_SubmissionScheduler)(GWQ)というものを開発され、これは主にバッチのために作成されたものでした。そこからバッチだけでなく、リアルタイムに実行したい(検索など)サービスに対応するために生まれたのがBorgだそうです。
Googleのような大規模な検索であれば、数％の効率Upでも大きなコスト削減につながるメリットがあります。
これが、Kubernetesの元となりました。

### Kubernetesの誕生
GoogleでBorgを開発を進めていく中で、世の中は仮想マシンを扱うユーザーが多かったそうです。
Borgはプロプライエタリなソフトウェアだったため、Borgの世界を知ってほしい、開発者を引き込みたいという願いから、
OSSとしてKubernetesが誕生しました。
またKubernetesは、APIドリブンで開発者の生産性を上げるというのが先で、効率やセキュリティは後からついてきたそうです。

### Kubernetesの魅力
Kubernetesとは、「コンテナオーケストレーター」と多くの人は知っていると思います。普及した大きなポイントですね。
他の観点で「１つのデータベースだけでクラスタを管理している設計」が魅力的だという話がありました。
（勝手な解釈かもしれません。すみません）

<figure title="kubernetes overview">
<img alt="kubernetes overview" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428761/silver-birder.github.io/blog/google_kubernetes_overview.png">
<figcaption>kubernetes overview</figcaption>
</figure>

Kubernetesでは、クラスタの状態を管理するために分散型KVSである[etcd](https://github.com/etcd-io/etcd)を使っています(その他の状態管理はキャッシュしているそうです。)。
etcdには、APIServerを経由しなければアクセスできないため、一貫したデータの維持が実現できます。
そのetcdの周りにある、ビジネスロジックを実現するコントローラー([Scheduler, Controller Manager](https://kubernetes.io/docs/concepts/overview/components/))が価値を提供します。
例えば、PodをNodeにアサインしたり、エンドポイントを提供したり、レプリケーションしたりなどなど...。

kubernetesのcontrol planeである、APIServer, Scheduler, Controller Managerがあれば、シングルノードでもマルチノードでも動きます。
kubernetesをDockerForMacで動かしたときは、そういえばシングルノードでしたね。マルチノードってイメージでしたけど。

<figure title="kubernetes jazz Improv">
<img alt="kubernetes jazz Improv" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428854/silver-birder.github.io/blog/google_kubernetes_jazz_Improv.png">
<figcaption>kubernetes jazz Improv</figcaption>
</figure>

Kubernetesはコンテナオーケストレーションとよく言われますが、事前にすべてがプランされたオーケストレーションではなく、ジャズのように即興で計画して組み立てていくものに近い思想だそうです。
私は音楽に疎い人なのですが意味は理解しました。（笑）性格的には即興は苦手っす。

### CRDとOperators
PodやReplication,Deploymentなど様々なリソースがあります。
ただ、Kubernetes が持っていないものを実装するにはどうすればよいのでしょうか。
そこで、Custom Resource Definitions (CRD)です。
なんだそれは...?

<iframely-embed card="small" url="https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/"></iframely-embed>

<iframely-embed card="small" url="https://qiita.com/cvusk/items/773e222e0971a5391a51"></iframely-embed>

要は、PodやDeploymentのようなリソースを独自に作ることができるのですね。おぉなんだそれ！
独自に機能を作るためには、Custom Resource と Costom Controllerが必要になり、両方をあわせて
Operatorsというものが生まれました。

例えば、下記のようなものがあります。
<iframely-embed card="small" url="https://github.com/oracle/mysql-operator"></iframely-embed>

<iframely-embed card="small" url="https://github.com/kubeflow/tf-operator"></iframely-embed>

Yahooでは、gimbalというOSSを使ってKubernetesを導入したみたいです。
<iframely-embed card="small" url="https://github.com/heptio/gimbal"></iframely-embed>

<iframely-embed card="small" url="https://techblog.yahoo.co.jp/advent-calendar-2018/oss-gimbal/"></iframely-embed>

詳しくは分かりませんが、こういった拡張しやすい機能があるおかげでドンドン普及するのだなと勉強になりました。

### Q&A
#### Q1. StatefulSets には今回触れられなかったが、どういう扱いなのか

<o-embed src="https://twitter.com/apstndb/status/1134409892033261569?s=20" height="400px"></o-embed>

#### Q2. スケーラビリティに関して

<o-embed src="https://twitter.com/apstndb/status/1134410827627487232?s=20" height="400px"></o-embed>

#### Q3. Kubernetes はなぜ etcd を使っているか

<o-embed src="https://twitter.com/apstndb/status/1134411776009785345?s=20" height="400px"></o-embed>

<o-embed src="https://twitter.com/apstndb/status/1134412148237512705?s=20" height="400px"></o-embed>

<o-embed src="https://twitter.com/apstndb/status/1134412317439844352?s=20" height="400px"></o-embed>

#### Q4. Virtual Kubelet とか k3s みたいなエッジで活用する動きがコミュニティでは感じられるが、どう見ている?

<o-embed src="https://twitter.com/apstndb/status/1134413224839745536?s=20" height="500px"></o-embed>

<o-embed src="https://twitter.com/apstndb/status/1134413431316987904?s=20" height="500px"></o-embed>

#### そのほか

参加者からの質問は、どれも鋭いものばかり。
適度な質問をしたいなとつぶやきました...。届かなかったけど...。
<o-embed src="https://twitter.com/silver_birder/status/1134412867988480000?s=20" height="300px"></o-embed>

# Osaka会場
会場提供は、株式会社Aimingさんでした。

<iframely-embed card="small" url="https://aiming-inc.com/ja/"></iframely-embed>

会場場所は、グランフロント大阪タワーBの18階にありました。(高い!)
今回使わさせて頂いた場所は、会議室でしょうか。
30,40人ぐらい入れるスペースで、清潔感がありました。

<figure title="kubernetes osaka satelite aiming">
<img alt="kubernetes osaka satelite aiming" src="https://res.cloudinary.com/silverbirder/image/upload/v1614428802/silver-birder.github.io/blog/kubernetes_osaka_satelite_aiming.jpg">
<figcaption>kubernetes osaka satelite aiming</figcaption>
</figure>

東京との中継は、ときどき音声が途切れてしまうときもありますが、しっかりと写っていました。
ただ、コンテンツとしては、YouTubeにあげらているので、わざわざOsakaに出席しなくても良いのでは？とも思いました。

しかし、それでもOsakaに出席しても良い面もあるのかなと思います。

* 他の方とのコミュニケーションが取れる
* 一緒に発表を聞いて議論ができる

まあ、私はコミュ障なので、ほぼなかったですが...。

改善ポイントとしては、**中継地からも質問ができる**ようになってくれたら良いなと期待しています。

# 最後に
Kubernetesについて、どういった経緯で誕生したのか、またCRDについても勉強になりました。
また、Kubernetesとは違うのですが、「**OSSのちから**」というものがエンジニアの世界では大事だと強く感じました。
普段エンジニアが開発する上で、ほぼ間違いなくOSSを使っています。
エンジニアにとって、OSSは不可欠な存在であり、利用するばかりです。

Googleがしたように、「広く使ってほしい、エンジニアを巻き込みたい」という願いから、
OSSとしてKubernetesが広まっていった一要因と思いました。これが有償ならどうだったのでしょうか。
ここまで普及したのでしょうか。

OSSに貢献する企業は、日本にも多く存在します。
個人でもOSSへ貢献できますし、OSS Gateという初心者向けのものもあります。
Kubernetesのコントリビューターは、ちょっとハードルが高いですが、
私もエンジニアとしてOSSへ貢献し続けていこうと思います。

# そのほか
拙い文章なのに、最後まで読んでいただき、ありがとうございます。
twitterをしていますので、フォローしてもらえるとうれしいです。([silver_birder](https://twitter.com/silver_birder))
