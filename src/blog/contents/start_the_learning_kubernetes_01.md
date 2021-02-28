<!-- 
title: 一足遅れて Kubernetes を学び始める  - 01. 環境選択編 -
date: 2019-04-18T00:00:00+09:00
draft: false
description: 
image: 
icon: 😎
-->

[:contents]

# ストーリー
1. [一足遅れて Kubernetes を学び始める - 01. 環境選択編 -](BASE_URL/blog/contents/start_the_learning_kubernetes_01)
1. [一足遅れて Kubernetes を学び始める - 02. Docker For Mac -](BASE_URL/blog/contents/start_the_learning_kubernetes_02)
1. [一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -](BASE_URL/blog/contents/start_the_learning_kubernetes_03)
1. [一足遅れて Kubernetes を学び始める - 04. kubectl -](BASE_URL/blog/contents/start_the_learning_kubernetes_04)
1. [一足遅れて Kubernetes を学び始める - 05. workloads その1 -](BASE_URL/blog/contents/start_the_learning_kubernetes_05)
1. [一足遅れて Kubernetes を学び始める - 06. workloads その2 -](BASE_URL/blog/contents/start_the_learning_kubernetes_06)
1. [一足遅れて Kubernetes を学び始める - 07. workloads その3 -](BASE_URL/blog/contents/start_the_learning_kubernetes_07)
1. [一足遅れて Kubernetes を学び始める - 08. discovery&LB その1 -](BASE_URL/blog/contents/start_the_learning_kubernetes_08)
1. [一足遅れて Kubernetes を学び始める - 09. discovery&LB その2 -](BASE_URL/blog/contents/start_the_learning_kubernetes_09)
1. [一足遅れて Kubernetes を学び始める - 10. config&storage その1 -](BASE_URL/blog/contents/start_the_learning_kubernetes_10)
1. [一足遅れて Kubernetes を学び始める - 11. config&storage その2 -](BASE_URL/blog/contents/start_the_learning_kubernetes_11)
1. [一足遅れて Kubernetes を学び始める - 12. リソース制限 -](BASE_URL/blog/contents/start_the_learning_kubernetes_12)
1. [一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -](BASE_URL/blog/contents/start_the_learning_kubernetes_13)
1. [一足遅れて Kubernetes を学び始める - 14. スケジューリング -](BASE_URL/blog/contents/start_the_learning_kubernetes_14)
1. [一足遅れて Kubernetes を学び始める - 15. セキュリティ -](BASE_URL/blog/contents/start_the_learning_kubernetes_15)
1. [一足遅れて Kubernetes を学び始める - 16. コンポーネント -](BASE_URL/blog/contents/start_the_learning_kubernetes_16)

# 経緯
Kubernetesを使えるようになりたいな〜（定義不明）
けど、他にやりたいこと（アプリ開発）あるから後回しにしちゃえ〜！！
と、今までずっと、ちゃんと学ばなかったKubernetesを、本腰入れて使ってみようと思います。✨ 

# 環境
```text:machine
iMac (21.5-inch, 2017)
```
私の知識レベルは、
「Kubernetesはコンテナオーケストレーションしてくれるやつでしょ」というざっくり認識で、関連用語は耳にしたことがあるだけで、よく理解できていません。

# 最初、何から始めよう？
マネージドサービスのGKE使ったほうが、最初は楽で簡単だから、そっちを使ったほうが良いみたいです。 😍

## GKE SetUp

![GKE 標準クラスタ テンプレート 1](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/143813/ad09881d-d3b7-1e03-48e4-a41466fb857d.png)

ノードってのは、ポッド（コンテナ）を入れるマシンなんだっけな。 ([PodとNode](https://nownabe.github.io/kubernetes-doc/tutorials/kubernetes_basics/3_explore_your_app.html))

![GKE 標準クラスタ テンプレート 2](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/143813/680b83b8-d59a-e4f7-4497-5b4d542fc796.png)

まあ、デフォルトで良いよね 🤔 

![GKE 標準クラスタ テンプレート 3](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/143813/b5f2b248-28a2-77a5-649e-4d9e85d58ace.png)

単語がどれも分からなさすぎる...(Istio?自動プロビジョニング?垂直ポッド自動スケーリング？) 🤔🤔🤔 

# MacでKubernetes試せるから、そっちで学んでいこう...
ちょっと意味がわからない状態で、GKE動かしたらお金がかかる上に、何してるのか分からないから、もったいない。
Docker For MacにKubernetes使えるみたいだから、まずはそっちを使って学んでいこうかな。。。 💪 

次回は[こちら](BASE_URL/blog/contents/start_the_learning_kubernetes_02)です。
