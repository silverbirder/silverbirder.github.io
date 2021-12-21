---
title: 一足遅れて Kubernetes を学び始める - 04. kubectl -
published: true
date: 2019-05-02
description: 前回 一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -では、RaspberryPiの環境にKubernetesを導入しました。無事、動作確認ができたので、さっそく学習していきたいです。
tags: ["Kubernetes", "Story", "Beginner"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
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
[一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -](./start_the_learning_kubernetes_03.md)では、RaspberryPiの環境にKubernetesを導入しました。無事、動作確認ができたので、さっそく学習していきたいです。

# 参考
「[Kubernetes完全ガイド](https://www.amazon.co.jp/Kubernetes%E5%AE%8C%E5%85%A8%E3%82%AC%E3%82%A4%E3%83%89-impress-top-gear-%E9%9D%92%E5%B1%B1/dp/4295004804/)」を読んで進めてみます。ソースコードは[こちら](https://github.com/MasayaAoyama/kubernetes-perfect-guide)。

以前の投稿では、[入門 Kubernetes](https://www.amazon.co.jp/%E5%85%A5%E9%96%80-Kubernetes-Kelsey-Hightower/dp/4873118409/)を参考にしていましたが、Kubernetes完全ガイドの方が網羅的に学べて良かったで、そちらを使いました。

# kubectl

> Kubectl is a command line interface for running commands against Kubernetes clusters

※ https://kubernetes.io/docs/reference/kubectl/overview/

kubernetesを操作するためのCLIです。

よく使うものを私なりに整理し、入門時に最小限覚えておけば良いものをまとめました。

## 1. apply

```shell
pi@raspi001:~ $ cat << EOF > sample-pod.yaml
apiVersion: v1
kind: Pod
metadata:
 name: sample-pod
spec:
 containers:
   - name: nginx-container
     image: nginx:1.12
EOF
pi@raspi001:~ $ kubectl apply -f sample-pod.yaml
pod/sample-pod created
```

Kubernetesでは、基本的にはマニフェストファイルを作成し、`apply`で適用するのが一般的のようです。それは、新規作成だけでなく、更新や削除も同様です。`create`や`replace`,`delete`といったCLIもありますが、`apply`でも同様の操作ができるため、使い分ける必要はあまりありません。`apply`で登録したマニュフェストファイルは履歴として保存されています。

※ [Kubernetes: kubectl apply の動作](https://qiita.com/tkusumi/items/0bf5417c865ef716b221)

## 2. set, get

```shell
pi@raspi001:~ $ kubectl set image pod sample-pod nginx-container=nginx:1.13
pod/sample-pod image updated
pi@raspi001:~ $ kubectl get pod sample-pod
NAME         READY   STATUS    RESTARTS   AGE
sample-pod   1/1     Running   1          13m
```

kubectlでは、どのリソース種類（`pod`,`service`,etc）で、どのリソース名なのかを教えてあげる必要があります。
また、フィルタリングする機能として`label`があります。

```yaml
# sample-pod-label.yaml
apiVersion: v1
kind: Pod
metadata:
 name: sample-pod
  labels:
   env: prod
   app: sample
spec:
 containers:
   - name: nginx-container
     image: nginx:1.12
```

```shell
pi@raspi001:~ $ kubectl get pod -l env=prod
No resources found.
pi@raspi001:~ $ kubectl apply -f sample-pod-label.yaml
pod/sample-pod configured
pi@raspi001:~ $ kubectl get pod -l env=prod
NAME         READY   STATUS    RESTARTS   AGE
sample-pod   1/1     Running   0          7m23s
```

更に詳細の情報が必要な場合は、`describe`を使います。

```shell
pi@raspi001:~ $ kubectl describe pod sample-pod
Name:               sample-pod
...
```

※ `edit`という直接編集する方法もありますが、一時的な対応のみに利用するべきとのことです。
せっかくの宣言的ファイルが意味ないですよね。

余談ですが、`service`を`svc`という風に省略できたりします。
※ [（備忘）kubectl コマンドでの短縮リソース名](https://qiita.com/nagase/items/3b8f905f432abba15b5a)

## 3. debug

```shell
pi@raspi001:~ $ kubectl exec -it sample-pod /bin/sh
# exit
pi@raspi001:~ $ kubectl logs sample-pod
pi@raspi001:~ $ kubectl cp sample-pod.yaml sample-pod:/var/sample-pod.yaml
pi@raspi001:~ $ kubectl port-forward sample-pod 8888:80
Forwarding from 127.0.0.1:8888 -> 80
Forwarding from [::1]:8888 -> 80
```

どれも`pod`に対する操作なためリソース種類の指定はありません。どれも開発時に必要が迫られれば使う感じですね。

## 99. top
こちら、どうしても動作できませんでした... 😥😥
今はそこまで必要としないので、一旦見送ります。
`calico`だか`flannel`とかが関係しているっぽいのですが、理解が浅いため未解決です。

# お片付け

```shell
pi@raspi001:~ $ kubectl delete pod sample-pod
pod "sample-pod" deleted
```

複数のpodを扱っているなら、`delete`よりも`apply --prune`の方が良いですが、今回は単体podなので、直接`delete`しました。

# おわりに
入門当初は、どれほど覚えなくてはいけないのかと不安になっていたのですが、
蓋を開けてみると、そこまで多くはありませんでした。（まだ知らないものは多いと思いますが）
規則性として、 リソース種類とリソース名を指定する習慣にも徐々に慣れてきました。
面倒なときは、`kubectl get all`で全部出すという荒業も覚えました。（笑）

次回は[こちら](./start_the_learning_kubernetes_05.md)です。
