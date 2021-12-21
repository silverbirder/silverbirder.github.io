---
title: 一足遅れて Kubernetes を学び始める - 08. discovery&LB その1 -
published: true
date: 2019-05-07
description: 前回 一足遅れて Kubernetes を学び始める - 07. workloads その3 -でようやくworkloadsが終了しました。今回は、discovery&LBを進めようと思います。
tags: ["Kubernetes", "Story", "Beginner"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1639816788/silver-birder.github.io/blog/pod_ip_adress_kubernetes.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1639816788/silver-birder.github.io/blog/pod_ip_adress_kubernetes.png
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
[一足遅れて Kubernetes を学び始める - 07. workloads その3 -](./start_the_learning_kubernetes_07.md)でようやくworkloadsが終了しました。今回は、discovery&LBを進めようと思います。

# discovery&LB

Kubernetesには、下記のようにリソースの種類が存在します。
今回は、discovery&LBを学習します。

| リソースの分類 | 内容 |
|:--|:--|
| Workloadsリソース | コンテナの実行に関するリソース |
| Discovery＆LBリソース | コンテナを外部公開するようなエンドポイントを提供するリソース |
| Config＆Storageリソース | 設定・機密情報・永続化ボリュームなどに関するリソース |
| Clusterリソース | セキュリティやクォータなどに関するリソース |
| Metadataリソース | リソースを操作する系統のリソース |
※ [KubernetesのWorkloadsリソース（その1）](https://thinkit.co.jp/article/13610)

discovery&LBをには、下記8つの種類があります。

* Service
  * ClusterIP
  * ExternalIP
  * NodePort
  * LoadBalancer
  * Headless (None)
  * ExternalName
  * None-Selector
* Ingress

Serviceの概要について学びます。

# Kubernetesとネットワーク
Kubernetesでは、Pod毎にIPアドレスが割り振られています。
そのため、異なるPod間で通信する際は、PodのIPアドレスが必要になります。逆に同一のPod内ならlocalhostで通信できます。

説明するために、準備します。


```yaml
# sample-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sample-app
  template:
    metadata:
      labels:
        app: sample-app
    spec:
      containers:
        - name: nginx-container
          image: nginx:1.12
          ports:
            - containerPort: 80
        - name: redis-container
          image: redis:3.2
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-deployment.yaml
pi@raspi001:~/tmp $ k get pods -l app=sample-app -o custom-columns="NAME:{metadata.name}, IP:{status.podIP},NODE:{spec.nodeName}"
NAME                                 IP           NODE
sample-deployment-9dc487867-h7lww   10.244.1.72   raspi002
sample-deployment-9dc487867-n8x5w   10.244.2.66   raspi003
sample-deployment-9dc487867-nxbxc   10.244.2.67   raspi003
```

![pod ip adress](https://res.cloudinary.com/silverbirder/image/upload/v1639816788/silver-birder.github.io/blog/pod_ip_adress_kubernetes.png)

このような状況下で、`sample-deployment-9dc487867-n8x5w:redis`を中心に見ていきます。

※ nginxは80ポートで開放されています。


## 前準備

```shell
pi@raspi001:~/tmp $ k exec -it sample-deployment-9dc487867-n8x5w -c redis-container /bin/bash
root@sample-deployment-9dc487867-n8x5w:/data# apt-get update && apt-get install curl -y
root@sample-deployment-9dc487867-n8x5w:/data# exit
```

curlがないのでインストールします。

## 同一Node,同一Pod内のコンテナへ通信

```shell
pi@raspi001:~/tmp $ k exec -it sample-deployment-9dc487867-n8x5w -c redis-container /bin/bash
root@sample-deployment-9dc487867-n8x5w:/data# curl localhost:80
<!DOCTYPE html>
...
```

OK

## 同一Node,異なるPodのコンテナへ通信

```shell
pi@raspi001:~/tmp $ k exec -it sample-deployment-9dc487867-n8x5w -c redis-container /bin/bash
root@sample-deployment-9dc487867-n8x5w:/data# curl 10.244.2.66:80
<!DOCTYPE html>
...
root@sample-deployment-9dc487867-n8x5w:/data# curl 10.244.2.67:80
<!DOCTYPE html>
...
```

OK

## 異なるNode,異なるPodのコンテナへ通信

```shell
pi@raspi001:~/tmp $ k exec -it sample-deployment-9dc487867-n8x5w -c redis-container /bin/bash
root@sample-deployment-9dc487867-n8x5w:/data# curl 10.244.1.72:80
<!DOCTYPE html>
...
```

OK

## MasterNodeから各Podへ通信

```shell
pi@raspi001:~/tmp $ curl 10.244.1.72:80
<!DOCTYPE html>
...
pi@raspi001:~/tmp $ curl 10.244.2.66:80
<!DOCTYPE html>
...
pi@raspi001:~/tmp $ curl 10.244.2.67:80
<!DOCTYPE html>
...
```

OK

ここから分かるように、Pod内部の通信、Pod間の通信、さらにNode間の通信までも、Kubernetesによってネットワークが構築されています。

# Service
Serviceは、下記の２つの大きな機能が存在します。

* pod宛トラフィックのロードバランシング
* サービスディスカバリとクラスタ内DNS

## pod宛トラフィックのロードバランシング
先程の例で、Pod間を通信することは可能です。しかし、podを作り直すたびにIPアドレスが変わってしまうため、
自作すると、少し大変です。そこで、Serviceの出番です。
サービスは、複数存在するPodに対して**自動的にロードバランスしてくれる**のと、合わせて**外向けのIPアドレス**(ExternalIP)や、**内向けのIPアドレス**(ClusterIP)も提供してくれます。

さっそく、試してみます。


```yaml
# sample-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-clusterip
spec:
  type: ClusterIP
  ports:
    - name: "http-port"
      protocol: "TCP"
      port: 8080
      targetPort: 80
  selector:
    app: sample-app
```

これは、`app=sample-app`にマッチするPodに対してロードバランスしてくれます。外から8080ポートで待ち受けて、80ポートでコンテナへ通信します。
spec.typeがClusterIPなので、内向けのIPアドレスが提供されています。

```shell
pi@raspi001:~/tmp $ k apply -f sample-clusterip.yaml
pi@raspi001:~/tmp $ k get service sample-clusterip
NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
sample-clusterip   ClusterIP   10.111.197.69   <none>        8080/TCP   30s
pi@raspi001:~/tmp $ k describe service sample-clusterip
Name:              sample-clusterip
...
Selector:          app=sample-app
Type:              ClusterIP
IP:                10.111.197.69
Port:              http-port  8080/TCP
TargetPort:        80/TCP
Endpoints:         10.244.1.72:80,10.244.2.66:80,10.244.2.67:80
...
```

内向けに10.111.197.69のIPアドレスが振られました。また、ロードバランスする対象Podは、先にあげたPodのIPアドレスです。
Endpintsに`:80`とあるように、port毎にサービス(clusterIP)を作ることもできます。(serviceのspec.portsは配列指定）

アクセスできるのか、試します。
せっかくなので、pod毎にindex.htmlの内容を変化させましょう。

```shell
pi@raspi001:~/tmp $ for PODNAME in `k get pods -l app=sample-app -o jsonpath='{.items[*].metadata.name}'`; do
> k exec -it ${PODNAME} -- cp /etc/hostname /usr/share/nginx/html/index.html;
> done
pi@raspi001:~/tmp $ curl 10.111.197.69:8080
sample-deployment-9dc487867-nxbxc
pi@raspi001:~/tmp $ curl 10.111.197.69:8080
sample-deployment-9dc487867-n8x5w
pi@raspi001:~/tmp $ curl 10.111.197.69:8080
sample-deployment-9dc487867-h7lww
```

確かに、ロードバランシングによってpodに適度なランダム具合でアクセスできています。
もちろん、外からはアクセスできません。

iMacへ移動

```shell
~ $ curl 10.111.197.69:8080
# 返答なし
```

## サービスディスカバリとクラスタ内DNS
サービスディスカバリとは、「問題においての解決策」を指しています。
Kubernetesにおける問題とは、動的にサービスが生成され続けていることによるサービスを特定することが難しくなる問題です。
そのサービスディスカバリが、Serviceにあります。
その方法について下記があります。

* 環境変数を利用したサービスディスカバリ
  * PodにIPアドレスやport,protocolが設定されている。 
* DNS Aレコードを利用したサービスディスカバリ
  * Kubernetes内のクラスタ内DNSによって、ドメイン名によるアクセスができる。(ドメイン名の命名規則に従う)
* DNS SRVレコードを利用したサービスディスカバリ
  * IPアドレスからドメイン名を取得する逆引きもできる。

dnsPolicyによる明示的な設定がない限り、Pod生成時にクラスタ内DNSへレコード追加されます。
クラスタ内DNSで名前解決できなかった場合は、クラスタ外DNSに問い合わせします。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-deployment.yaml -f sample-clusterip.yaml
```

# 最後に
今回は、Serviceについての概要を学びました。Kubernetesの世界では、自動的にネットワーク構築されているため、特段意識することはありませんでした。
もう少し理解が進めれば、ネットワークがどのように構築されているのか、クラスタ内DNSがどのように動いているのか知りたいと思います。
次回は、[こちら](./start_the_learning_kubernetes_09.md)です。

※ お絵かきしてアウトプットすると、理解が深まるのでおすすめです。
