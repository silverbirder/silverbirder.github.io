---
title: Cloud Native Days Tokyo 2019 -2019年7月22-23日参加レポート
published: true
date: 2019-07-27
description: 今回、東京で開催されましたCloud Native Days Tokyo 2019に2日間とも参加してきましたので、報告しようと思います。セッション毎の報告というより、全体を通した感想を話そうかなと思います。
tags: ["Report", "Cloud Native Days", "Tokyo", "Kubernetes"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614429605/silver-birder.github.io/blog/cloud_native_days_tokyo_2019.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614429605/silver-birder.github.io/blog/cloud_native_days_tokyo_2019.png
---

今回、東京で開催されましたCloud Native Days Tokyo 2019に2日間とも参加してきましたので、報告しようと思います。
セッション毎の報告というより、全体を通した感想を話そうかなと思います。

<!--  TODO: TOC -->

<ogp-me src="https://cloudnativedays.jp/cndt2019/"></ogp-me>

リンクをまとめています。
    
<ogp-me src="https://qiita.com/zaki-lknr/items/1c26bb713aef9645f5e6"></ogp-me>

# CNCFの利用率
一日目のKeynoteで印象的だった内容です。 
発表者は、OSDT実行委員長である長谷川さんです。  

来場者アンケート1354人から聞いた「クラウドネイティブ技術を活用フェーズについて」の紹介がありました。
既に本番環境に適用している人は、なんと<b>46%</b>という驚きの結果でした。また、開発環境に至っては、<b>63%</b>ということでした。  
このイベントに参加している時点である程度フィルターはかかっていると思いますが、それでも大きな割合だと感じました。

次の図では、CNCFプロジェクトの180日間におけるCommit数をグラフ化したものです。
生みの親であるGoogleが1位でindependent(個人)が2番目、日本企業Fujitsuが6位です。熱意が伝わってきますね。  
 
<figure title="https://www.stackalytics.com/cncf?date=180">
<img alt="https://www.stackalytics.com/cncf?date=180" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429648/silver-birder.github.io/blog/stackalytics_cncf.png">
<figcaption><a href="https://www.stackalytics.com/cncf?date=180">https://www.stackalytics.com/cncf?date=180</a></figcaption>
</figure>

※ 2019/07/24時点

ただ、CNCFのメンバーとして日本企業は<b>17社</b>しかないそうで、まだまだこれからといったところでしょうか。

<ogp-me src="https://landscape.cncf.io/members"></ogp-me>

さらには、Kubernetesから認定された日本企業ではまだないみたいです。残念です。  

<ogp-me src="https://kubernetes.io/partners/#kcsp"></ogp-me>

今後は、次のようなカンファレンスが海外でもあるみたいです。ぜひ参加してみたいと思います。  

<ogp-me src="https://events.linuxfoundation.org/events/kubecon-cloudnativecon-europe-2019/"></ogp-me>

<ogp-me src="https://events.linuxfoundation.org/events/kubecon-cloudnativecon-north-america-2019/"></ogp-me>

# CloudNativeとは？
> クラウドネイティブ技術は、パブリッククラウド、プライベートクラウド、ハイブリッドクラウドなどの近代的でダイナミックな環境において、スケーラブルなアプリケーションを構築および実行するための能力を組織にもたらします。 このアプローチの代表例に、コンテナ、サービスメッシュ、マイクロサービス、イミューダブルインフラストラクチャ、および宣言型APIがあります。

※ [https://github.com/cncf/toc/blob/master/DEFINITION.md#日本語版](https://github.com/cncf/toc/blob/master/DEFINITION.md#日本語版)

「スケーラブルなアプリケーションを構築および実行」が重要です。これを実現する手段の１つにKubernetesがあります。
「CloudNative = Kubernetes」ではなく、「CloudNative ∋ Kubernetes」という感じです。

ただ、最近ではKubernetesを違う観点で考える人が増えてきたそうです。
それが、二日目のKeynoteで発表された北山さんのスライドにあります。

<o-embed src="https://speakerdeck.com/shkitayama/change-the-game-change-the-world"></o-embed>

Kubernetesは「platformのためのplatform」と言われるようになりました。
これは、slide.No.9(Kubernetes is a platform)で見て分かる通りで、次のようなことがわかります。

* 運用管理者
  * Self-Healingによってスケールが簡単になる
* アプリケーション開発者
  * 簡単にデプロイすることができる

これらは、たしかに「プラットフォームから得られる価値」になりますが、
逆に次のような考慮が必要なってきます。

* 運用管理者
  * Self-Healingはどこまで信頼性を担保できるか
* アプリケーション開発者
  * ユーザー影響を最小限にするためには、どうればよいか

これらのような「プラットフォームを利用するコスト」が「プラットフォームから得られる価値」よりも大きくなってしまいがちになります。
そこで、Operator (CRD)という概念が最近ホットになっています。

# なぜCRDがホットなのか？
CRDという言葉は様々なセッションで取り上げらていました。
CRDとOperatorについては、下記をご参考下さい。

<ogp-me src="https://silver-birder.github.io/blog/contents/kubernetes_meetup_tokyo_19_osaka_satellite"></ogp-me>

Kubernetesを運用すると、既存のリソースだけでは物足りない所がでてくるそうです。
そういう部分が「プラットフォームを利用するコスト」を大きくしてしまいます。
そこで、オリジナルのカスタマイズしたリソースを独自に開発し、運用を自動化することを目的とした
CRD、Operatorが生まれました。
ただ、独自に1から作るよりも、下記のサイトから使った方が効率的なときもあります。

<ogp-me src="https://operatorhub.io/"></ogp-me>

けど、結局は困ったとき、ソースコードを読むことになるので、それぐらいの能力がないと、
運用を回せない気がします。

zlabのladicleさんの次のスライドがとてもわかりやすく、まとまっていました。
これは貴重な資料ですね。

<o-embed src="https://speakerdeck.com/ladicle/kuberneteswokuo-zhang-siteri-falseoperesiyonwozi-dong-hua-suru"></o-embed>

ちなみに、独自に1から作ったケースがサイバーエージェントの山本さんの発表で、次のスライドです。  

<o-embed src="https://speakerdeck.com/mayuyamamoto/kuberneteskuo-zhang-woli-yong-sitazi-zuo-autoscalerdeshi-xian-surusutoresuhurinayun-yong-falseshi-jie"></o-embed>

同じくサイバーエージェントの青山さんがライブコーディングされていたリポジトリが次のものになります。

<ogp-me src="https://github.com/cloudnativejp/webserver-operator"></ogp-me>

# Kubernetesは必要ですか？
Kubernetesを使うべきかの話が2日間でちらほらありました。
次のような議論もあります。

<ogp-me src="https://www.atmarkit.co.jp/ait/articles/1907/23/news120.html"></ogp-me>

CloudNativeなアプリケーション構築を目指す場合、どうしてもKubernetesを使う方向になりがちですよね。  
今回参加したセッションの多くの企業では、Kubernetesを採用するための検討が下記のような感じでした。

* プレインなKubernetesか、マネージドなKubernetesか
  * 大体はマネージドなKubernetesを使う。
  * かゆい所に手を伸ばすときになって、プレインなKubernetesを使う。
* Kubernetesのエンジニアは何人か。それは専属か
  * どこもKubernetesの知識を保有するエンジニアは少ない。
  * 数人程度で専任で進めることが多い。
* ノウハウを蓄積するために、スモールスタート

様々なセッションがあった中で、とても王道なステップを踏まれている企業がありました。それは、SoftbankPaymentServiceの鈴木さんの次のスライドです。  

<ogp-me src="https://www.slideshare.net/JunyaSuzuki1/springpcf-cndt2019-osdt2019-keynote"></ogp-me>

企業に適したCloudNative化だなと勉強になりました。  
特に「運用を回すコストを考慮すると、KubernetesではなくPaaSを使う」  というポイントが好きです。  

# Circuit Breaker
耳にタコができるぐらい、この単語を聞きました。
下記のサイトが参考になります。

<ogp-me src="https://qiita.com/yasuabe2613/items/3bff44e662c922083264#circuit-breaker"></ogp-me>

> 同期リクエストの先で一部のマイクロサービスに障害があると、クライアントやその先の「クライアントのクライアント」までブロッキングが波及することになりかねない。
この問題を、クライアントと実サービスの間に Circuit Breaker と呼ばれるプロキシを介在させて、実サービスの呼び出し失敗が一定基準を超えると、クライアントからのリクエストを即座にリジェクトさせて、ブロッキング連鎖を解消するパターン。

Kubernetesでアプリケーションを構築すると、分散システムの恩恵を受けるために、
アプリケーションをマイクロサービス化する流れになります。そのマイクロサービス化でよく踏む地雷が、
「後ろのAPIが死んだら、連鎖的に他サーバも死ぬ」という現象です。  
これを回避するために、上記のCircuit Breakerパターンを使う企業が多数いらっしゃいました。
本当にいろんなセッションで聞きました...。

# twelve factor app
次のWantedlyさんのスライドが、私の中では話題になりました。

<o-embed src="https://speakerdeck.com/potsbo/k8s-kubernetes-8-factors"></o-embed>

要は、「アプリケーションとしての設計の考え方(twelve factor app)を、インフラ部分でも適用してみた」という感じです。
どれも具体的なところまで説明されており、実際にKubernetesを構築する際に役に立つものだと思います。  

# 技術にフォーカスした発表
今回のイベントでは、何か1つの技術にフォーカスした発表が多くありました。
それぞれ私なりにまとめてみました。ご参考下さい。

## Chaos Engineering

<o-embed src="https://speakerdeck.com/mahito/cndt-osdt-2019-2g1"></o-embed>

## Docker

<ogp-me src="https://www.slideshare.net/AkihiroSuda/cndt-docker"></ogp-me>

## Envoy

<o-embed src="https://speakerdeck.com/taiki45/cloudnative-days-tokyo-2019-understanding-envoy"></o-embed>

## Logging

<o-embed src="https://speakerdeck.com/yosshi_/kubernetes-loggingru-men"></o-embed>

## LinuxKernel

<o-embed src="https://speakerdeck.com/tenforward/cndt2019"></o-embed>

## Prometheus

<o-embed src="https://speakerdeck.com/tokibi/prometheus-setup-with-long-term-storage"></o-embed>

## Sandbox

<ogp-me src="https://docs.google.com/presentation/d/1O9Q9E1hH6mBA5w8oDENnCYObZvij1-Dr_obvsY3X29k/edit"></ogp-me>

## Scheduler

<o-embed src="https://speakerdeck.com/ytaka23/cloudnative-days-tokyo-2019"></o-embed>

## Spinnaker

<o-embed src="https://speakerdeck.com/sansanbuildersbox/introduction-to-deployment-patterns-with-spinnaker:embed]9"></o-embed>

## Istio

<o-embed src="https://speakerdeck.com/dangossk/a-deep-dive-into-service-mesh-and-istio-cndt-2019"></o-embed>

# その他
サイバーエージェントさんより、エンジニアにとってとても嬉しいアイテムを頂きました。

<o-embed src="https://twitter.com/ca_adtechstudio/status/1152080444445167616" height="400px"></o-embed>

さっそく、キーボードにとりつけてみました。最高です！
<figure title="ergodox with k8s keycap (cyberAgent)">
<img alt="ergodox with k8s keycap (cyberAgent)" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429692/silver-birder.github.io/blog/ergodox_with_k8s_keycap.jpg">
<figcaption>ergodox with k8s keycap (cyberAgent)</figcaption>
</figure>

こちらのサービスから作られたそうで、私も自前で何か作ってみようかなと思いました。

[https://www.wasdkeyboards.com/](https://www.wasdkeyboards.com/)

# 最後に
CloudNativeにどっぷり浸かった2日間でした。  
どの企業でもCloudNativeを導入したことによる「つらみ」や「価値」を共有して頂いたおかげで、これから導入する人たち（私を含む）にとっては、有意義な時間でした。  
全てのセッションを吸収できたわけではないですが、ここで記載したスライドだけでも理解を深めたいなと思います。

<ogp-me src="https://cloudnativedays.jp/cndk2019/"></ogp-me>

今度は大阪で開催されるそうです。これも絶対参加したいなと思います！

# 蛇足（参加するまでの経緯）
筆者はWebが大好きなエンジニアで、Kubernetesについては理解が浅い人間です。主にフロントエンドに注力しています。  
ただ、昨年のDeveloperBoost2018で、サイバーエージェントの青山さんのセッションをうけてKubernetesに興味を持ち始めました。

<ogp-me src="https://codezine.jp/article/detail/11291"></ogp-me>

青山さんはKubernetesにとても詳しい方で、世代が近いせいか、私もこれぐらい夢中になれるものを見つけたいと感じるようになりました。  
私はWebに関わるものなら何でも好きで、Kubernetesも含まれます。そこで、青山さん著作の[Kubernetes完全ガイド](http://www.wasdkeyboards.com/index.php/products/printed-keycap-singles/custom-art-cherry-mx-keycaps.html)を全て実践することにしてみました。もちろん<b>お家Kubernetes</b>でです。
実際に触ってみると、スケールする簡単さに驚きました。ほぼコマンド一発でPodが複製されて、「え！？」とびっくりです。  
そこから、段々とハマっていき今回のイベントに参加することになりました。  
