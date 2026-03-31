---
title: '一足遅れて Kubernetes を学び始める  - 01. 環境選択編 -'
publishedAt: '2019-04-18'
summary: '経緯 Kubernetesを使えるようになりたいな〜（定義不明） けど、他にやりたいこと（アプリ開発）あるから後回しにしちゃえ〜！！と、今までずっと、ちゃんと学ばなかったKubernetesを、本腰入れて使ってみようと思います。'
tags: ["クラウドインフラ"]
keywords: ['Kubernetes', '環境選択']
---

## ストーリー

1. [一足遅れて Kubernetes を学び始める - 01. 環境選択編 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_01/)
1. [一足遅れて Kubernetes を学び始める - 02. Docker For Mac -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_02/)
1. [一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_03/)
1. [一足遅れて Kubernetes を学び始める - 04. kubectl -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_04/)
1. [一足遅れて Kubernetes を学び始める - 05. workloads その 1 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_05/)
1. [一足遅れて Kubernetes を学び始める - 06. workloads その 2 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_06/)
1. [一足遅れて Kubernetes を学び始める - 07. workloads その 3 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_07/)
1. [一足遅れて Kubernetes を学び始める - 08. discovery&LB その 1 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_08/)
1. [一足遅れて Kubernetes を学び始める - 09. discovery&LB その 2 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_09/)
1. [一足遅れて Kubernetes を学び始める - 10. config&storage その 1 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_10/)
1. [一足遅れて Kubernetes を学び始める - 11. config&storage その 2 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_11/)
1. [一足遅れて Kubernetes を学び始める - 12. リソース制限 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_12/)
1. [一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_13/)
1. [一足遅れて Kubernetes を学び始める - 14. スケジューリング -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_14/)
1. [一足遅れて Kubernetes を学び始める - 15. セキュリティ -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_15/)
1. [一足遅れて Kubernetes を学び始める - 16. コンポーネント -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_16/)

## 経緯

Kubernetes を使えるようになりたいな〜（定義不明）
けど、他にやりたいこと（アプリ開発）あるから後回しにしちゃえ〜！！
と、今までずっと、ちゃんと学ばなかった Kubernetes を、本腰入れて使ってみようと思います。✨

## 環境

```text
iMac (21.5-inch, 2017)
```

私の知識レベルは、
「Kubernetes はコンテナオーケストレーションしてくれるやつでしょ」というざっくり認識で、関連用語は耳にしたことがあるだけで、よく理解できていません。

## 最初、何から始めよう

マネージドサービスの GKE 使ったほうが、最初は楽で簡単だから、そっちを使ったほうが良いみたいです。 😍

## GKE SetUp

![GKE 標準クラスタ テンプレート 1](https://res.cloudinary.com/silverbirder/image/upload/v1639816542/silver-birder.github.io/blog/GKE_template_1.png?ar=465%3A779)

ノードってのは、ポッド（コンテナ）を入れるマシンなんだっけな。 ([Pod と Node](https://nownabe.github.io/kubernetes-doc/tutorials/kubernetes_basics/3_explore_your_app.html))

![GKE 標準クラスタ テンプレート 2](https://res.cloudinary.com/silverbirder/image/upload/v1639816542/silver-birder.github.io/blog/GKE_template_2.png?ar=454%3A731)

まあ、デフォルトで良いよね 🤔

![GKE 標準クラスタ テンプレート 3](https://res.cloudinary.com/silverbirder/image/upload/v1639816542/silver-birder.github.io/blog/GKE_template_3.png?ar=457%3A720)

単語がどれも分からなさすぎる...(Istio?自動プロビジョニング?垂直ポッド自動スケーリング？) 🤔🤔🤔

## Mac で Kubernetes 試せるから、そっちで学んでいこう

ちょっと意味がわからない状態で、GKE 動かしたらお金がかかる上に、何してるのか分からないから、もったいない。
Docker For Mac に Kubernetes 使えるみたいだから、まずはそっちを使って学んでいこうかな。。。 💪

次回は[こちら](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_02/)です。
