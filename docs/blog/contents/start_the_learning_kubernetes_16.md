---
title: 一足遅れて Kubernetes を学び始める - 16. コンポーネント -
published: true
date: 2019-06-10
description: 前回 一足遅れて Kubernetes を学び始める - 15. セキュリティ -では、RBACによる権限について学習しました。今回は最後にKubernetesのコンポーネントについて学習します。
tags: ["Kubernetes", "Story", "Beginner"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1639816831/silver-birder.github.io/blog/kubernetes_master.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1639816831/silver-birder.github.io/blog/kubernetes_master.png
---

<!--  TODO: TOC -->

# ストーリー
1. [一足遅れて Kubernetes を学び始める - 01. 環境選択編 -](./start_the_learning_kubernetes_01.md)
1. [一足遅れて Kubernetes を学び始める - 02. Docker For Mac -](./start_the_learning_kubernetes_02.md)
1. [一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -](./start_the_learning_kubernetes_03.md)
1. [一足遅れて Kubernetes を学び始める - 04. kubectl -](./start_the_learning_kubernetes_04.md)
1. [一足遅れて Kubernetes を学び始める - 05. workloads その1 -](./start_the_learning_kubernetes_05.md)
1. [一足遅れて Kubernetes を学び始める - 06. workloads その2 -](./start_the_learning_kubernetes_06.md)
1. [一足遅れて Kubernetes を学び始める - 07. workloads その3 -](./start_the_learning_kubernetes_07.md)
1. [一足遅れて Kubernetes を学び始める - 08. discovery&LB その1 -](./start_the_learning_kubernetes_08.md)
1. [一足遅れて Kubernetes を学び始める - 09. discovery&LB その2 -](./start_the_learning_kubernetes_09.md)
1. [一足遅れて Kubernetes を学び始める - 10. config&storage その1 -](./start_the_learning_kubernetes_10.md)
1. [一足遅れて Kubernetes を学び始める - 11. config&storage その2 -](./start_the_learning_kubernetes_11.md)
1. [一足遅れて Kubernetes を学び始める - 12. リソース制限 -](./start_the_learning_kubernetes_12.md)
1. [一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -](./start_the_learning_kubernetes_13.md)
1. [一足遅れて Kubernetes を学び始める - 14. スケジューリング -](./start_the_learning_kubernetes_14.md)
1. [一足遅れて Kubernetes を学び始める - 15. セキュリティ -](./start_the_learning_kubernetes_15.md)
1. [一足遅れて Kubernetes を学び始める - 16. コンポーネント -](./start_the_learning_kubernetes_16.md)

# 前回
[一足遅れて Kubernetes を学び始める - 15. セキュリティ -](./start_the_learning_kubernetes_15.md)では、RBACによる権限について学習しました。今回は最後にKubernetesのコンポーネントについて学習します。

# コンポーネント
Kubernetesでは、下記のような構成になっています。

![kubernetes_master.png](https://res.cloudinary.com/silverbirder/image/upload/v1639816831/silver-birder.github.io/blog/kubernetes_master.png)

※ [https://kubernetes.io/docs/concepts/architecture/cloud-controller/](https://kubernetes.io/docs/concepts/architecture/cloud-controller/)

それぞれのコンポーネントについて学習します。

# 現状確認

```shell
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   42d   v1.14.1
raspi002   Ready    worker   42d   v1.14.1
raspi003   Ready    worker   42d   v1.14.1
pi@raspi001:~/tmp $ k get pods -n kube-system -o=wide
NAME                               READY   STATUS    RESTARTS   AGE   IP             NODE       NOMINATED NODE   READINESS GATES
coredns-fb8b8dccf-mtzvd            1/1     Running   34         37d   10.244.0.26    raspi001   <none>           <none>
coredns-fb8b8dccf-nv6dj            1/1     Running   81         37d   10.244.2.151   raspi003   <none>           <none>
etcd-raspi001                      1/1     Running   31         42d   192.168.3.32   raspi001   <none>           <none>
kube-apiserver-raspi001            1/1     Running   95         42d   192.168.3.32   raspi001   <none>           <none>
kube-controller-manager-raspi001   1/1     Running   89         42d   192.168.3.32   raspi001   <none>           <none>
kube-flannel-ds-arm-4s22p          1/1     Running   73         38d   192.168.3.34   raspi003   <none>           <none>
kube-flannel-ds-arm-7nnbj          1/1     Running   88         38d   192.168.3.33   raspi002   <none>           <none>
kube-flannel-ds-arm-ckwq5          1/1     Running   86         38d   192.168.3.32   raspi001   <none>           <none>
kube-proxy-6fwl5                   1/1     Running   31         42d   192.168.3.32   raspi001   <none>           <none>
kube-proxy-wgjdq                   1/1     Running   28         42d   192.168.3.33   raspi002   <none>           <none>
kube-proxy-zvmqf                   1/1     Running   28         42d   192.168.3.34   raspi003   <none>           <none>
kube-scheduler-raspi001            1/1     Running   87         42d   192.168.3.32   raspi001   <none>           <none>
```

下記は、MasterNodeで動いています。

* etcd-raspi001
* kube-apiserver-raspi001
* kube-controller-manager-raspi001
* kube-scheduler-raspi001

下記は、全Nodeで動いています。

* kube-flannel-ds
* kube-proxy

corednsは、Master1台とWorker1台で動いています。 

※ [このとき](./start_the_learning_kubernetes_03.md)に設定しました。

# etcd
MasterNodeに存在するコンポーネントです。
分散Key-ValueStoreであるetcdは、Kubernetesのクラスタにある全情報が保存されています。そのため、単一障害にならないようクラスタを組むことが推奨されているみたいです。ここのデータにアクセスするのはkube-apiserverから経由しなければなりません。
直接確認したい場合は、etcdctlを使ってみると良いです。

# kube-apiserver
MasterNodeに存在するコンポーネントです。
KubernetesAPIを提供するコンポーネントです。kube-schedulerやkube-controller-manager,kubeletから呼ばれます。
etcdに対してリソースを管理するだけで、Podの起動はしません。

# kube-scheduler
MasterNodeに存在するコンポーネントです。
Node情報が未割り当てのPodを検知して、そのPodにNodeを割り当てるリクエストをkube-apiserverに送ります。
割り当てるだけであって、Podを起動させません。Nodeを割り当てる際、NodeAffinityやTaintsなどを考慮に入れます。

# kubelet
各Node上で動作するコンポーネントです。未割り当てだったNodeが割り当てられたことを検知し、
実際にPodを起動します。

# kube-controller-manager
MasterNodeに存在するコンポーネントです。
様々なコントローラを実行するコンポーネントです。DeploymentやControllerReplicaSetControllerでは、
状態を監視し、期待するPod数と現在のPod数を見ます。kube-apiserverに対して、過不足分のPodを調整するよう要求します。
その後は、さきほどのkube-scheduler,kubeletの一連の流れになります。

# kube-proxy
各Node上で動作するコンポーネントです。NodePortやClusterIP宛のトラフィックを転送します。

# kube-dns
kubernetesクラスタ内の名前解決やサービスディスカバリに利用されるDNSサーバです。
私の環境では、CoreDNSを使っていました。

# そのほか
## CustomResourceDefinition(CRD)とOperator
CRDは独自のリソースを定義できるリソースです。このような拡張性をもたせることで、様々な開発が進められます。
CRDは、単なるKubernetesオブジェクトなだけなので、Operatorというカスタムコントローラをセットで作る必要があります。
Operator Frameworkと呼ばれるもので簡単に作成できるそうです。

# 最後に
ようやくKubernetes完全ガイドの内容を読み切ることができました。
当初は、ここまで記事にアウトプットし続けるつもりはなかったです。
実際にkubernetesをraspberryPi上で動かしてみると、
いろいろな発見があってのめり込んでしまいました。

ただ、[一足遅れて Kubernetes を学び始める - 12. リソース制限 -](./start_the_learning_kubernetes_12.md)ぐらいから、いろいろとあって、
書籍の内容を、ほぼそのまま使わさせてもらいました。（笑)

これからは、実際にGKEを使ってアプリケーション開発をしてみようと思います。
