---
title: 一足遅れて Kubernetes を学び始める - 05. workloads その1 -
published: true
date: 2019-05-03
description: 前回 一足遅れて Kubernetes を学び始める - 04. kubectl -では、kubenetesのCLIツールkubectlを学習しました。今回は、目玉機能であるworkloadsについて学習します。
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
[一足遅れて Kubernetes を学び始める - 04. kubectl -](./start_the_learning_kubernetes_04.md)では、kubenetesのCLIツールkubectlを学習しました。
今回は、目玉機能であるworkloadsについて学習します。

# workloads

Kubernetesには、下記のようにリソースの種類が存在します。
今回は、Workloadsを学習します。

| リソースの分類 | 内容 |
|:--|:--|
| Workloadsリソース | コンテナの実行に関するリソース |
| Discovery＆LBリソース | コンテナを外部公開するようなエンドポイントを提供するリソース |
| Config＆Storageリソース | 設定・機密情報・永続化ボリュームなどに関するリソース |
| Clusterリソース | セキュリティやクォータなどに関するリソース |
| Metadataリソース | リソースを操作する系統のリソース |
※ [KubernetesのWorkloadsリソース（その1）](https://thinkit.co.jp/article/13610)

Workloadsには、下記8つの種類があります。

* Pod
* ReplicationController
* ReplicaSet
* Deployment
* DaemonSet
* StatefulSet
* Job
* CronJob

Pod,ReplicationController,ReplicaSet,Deploymentまでを見ていきます。

# Pod

コンテナを1つ以上含めた最小単位のリソース。
Pod毎にIPアドレスが振られる。ボリュームは共有。
基本的に、Podにコンテナを詰め込めるのではなく、「分離できるなら、分離する」方針がマイクロサービスとして良いそうです。
さっそく、動かしてみます。

※ `alias k=kubectl`

```yaml
# sample-2pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-2pod
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
    - name: redis-container
      image: redis:3.2
```

```shell
pi@raspi001:~/tmp $ k apply -f . --prune --all
pod/sample-2pod created
pi@raspi001:~/tmp $ k get pod sample-2pod
NAME          READY   STATUS    RESTARTS   AGE
sample-2pod   2/2     Running   0          101s
```

期待通り複数のコンテナが動いていますね。(READY 2/2)
execで中に入る場合、どうなるのでしょうか。

```shell
pi@raspi001:~/tmp $ k exec -it sample-2pod /bin/sh
Defaulting container name to nginx-container.
Use 'kubectl describe pod/sample-2pod -n default' to see all of the containers in this pod.
#
```

なるほど、デフォルトのコンテナ（spec.containersの先頭)に入るみたいです。
redis-containerに入る場合は、

```shell
pi@raspi001:~/tmp $ k exec -it sample-2pod -c redis-container /bin/sh
# redis-cli
127.0.0.1:6379> exit
#
```

`-c`でコンテナを指定するだけみたいです。
他にも説明したいことがありますが、長くなりそうなので切り上げます。

# ReplicaSet, ReplicationController

レプリカという名前だけあって、Podを複製するリソース。
過去の経緯からReplicationControllerからReplicaSetへ名前変更があったため、ReplicaSetを使うことが推奨

さっそく、動かしてみます。

```yaml
# sample-rs.yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: sample-rs
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
      - name: redis-container
        image: redis:3.2
```

```shell
pi@raspi001:~/tmp $ k apply -f . --prune --all
replicaset.apps/sample-rs created
pod/sample-2pod unchanged
pi@raspi001:~/tmp $ k get pods
NAME              READY   STATUS              RESTARTS   AGE
sample-2pod       2/2     Running             0          20m
sample-rs-ghkcc   2/2     Running             0          103s
sample-rs-nsc5b   0/2     ContainerCreating   0          103s
sample-rs-wk7vl   0/2     ContainerCreating   0          103s
```

確かに、replica3つ(sample-rs)で、それぞれコンテナが２つ(READY 2/2)作れていますね。
書いて気になるのは、 podのapiVersionは、`v1`に対して、replicaSetのapiVersionは、 `apps/v1`というのが気になりましたので、調べてみたところ、[Kubernetesの apiVersion に何を書けばいいか](https://qiita.com/soymsk/items/69aeaa7945fe1f875822)という記事を見つけました。
Coreとなる機能は、`v1`で良いみたいです。

Kubernetesの目玉機能であるオーケストレーションの機能であるセルフヒーリングを試してみます。

```shell
pi@raspi001:~/tmp $ k get pods
NAME              READY   STATUS    RESTARTS   AGE
sample-2pod       2/2     Running   0          29m
sample-rs-ghkcc   2/2     Running   0          11m
sample-rs-nsc5b   2/2     Running   0          11m
sample-rs-wk7vl   2/2     Running   0          11m
pi@raspi001:~/tmp $ k delete pod sample-rs-wk7vl
pod "sample-rs-wk7vl" deleted
pi@raspi001:~/tmp $ k get pods
NAME              READY   STATUS              RESTARTS   AGE
sample-2pod       2/2     Running             0          30m
sample-rs-ghkcc   2/2     Running             0          11m
sample-rs-gq2hs   0/2     ContainerCreating   0          13s
sample-rs-nsc5b   2/2     Running             0          11m
```

おー、ContainerCreatingされています。良いですね〜。 
ちなみに、気になったのはnode自体が故障してダウンした場合は、どうなるのでしょうか。試してみます。

```shell
pi@raspi001:~/tmp $ k get pods -o=wide
NAME              READY   STATUS    RESTARTS   AGE    IP            NODE       NOMINATED NODE   READINESS GATES
sample-2pod       2/2     Running   0          32m    10.244.1.25   raspi002   <none>           <none>
sample-rs-ghkcc   2/2     Running   0          13m    10.244.1.26   raspi002   <none>           <none>
sample-rs-gq2hs   2/2     Running   0          114s   10.244.1.27   raspi002   <none>           <none>
sample-rs-nsc5b   2/2     Running   0          13m    10.244.2.15   raspi003   <none>           <none>
```

raspi003の電源を落としてみます。

worker(raspi003)に移動

```shell
~ $ slogin pi@raspi003.local
pi@raspi003.local's password:
pi@raspi003:~ $ sudo shutdown now
sudo: unable to resolve host raspi003
Connection to raspi003.local closed by remote host.
Connection to raspi003.local closed.
~ $
```

master(raspi001)に移動

```shell
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS     ROLES    AGE     VERSION
raspi001   Ready      master   5d16h   v1.14.1
raspi002   Ready      worker   5d16h   v1.14.1
raspi003   NotReady   worker   4d21h   v1.14.1
pi@raspi001:~/tmp $ k get pods -o=wide
NAME              READY   STATUS    RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES
sample-2pod       2/2     Running   0          35m     10.244.1.25   raspi002   <none>           <none>
sample-rs-ghkcc   2/2     Running   0          17m     10.244.1.26   raspi002   <none>           <none>
sample-rs-gq2hs   2/2     Running   0          5m38s   10.244.1.27   raspi002   <none>           <none>
sample-rs-nsc5b   2/2     Running   0          17m     10.244.2.15   raspi003   <none>           <none>
```

ん？ raspi003で動いている？ 数十秒後... 

```shell
pi@raspi001:~/kubernetes-perfect-guide/samples/chapter05/tmp $ k get pods -o=wide
NAME              READY   STATUS        RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
sample-2pod       2/2     Running       0          40m   10.244.1.25   raspi002   <none>           <none>
sample-rs-ghkcc   2/2     Running       0          22m   10.244.1.26   raspi002   <none>           <none>
sample-rs-gq2hs   2/2     Running       0          10m   10.244.1.27   raspi002   <none>           <none>
sample-rs-nsc5b   2/2     Terminating   0          22m   10.244.2.15   raspi003   <none>           <none>
sample-rs-p2jsc   2/2     Running       0          53s   10.244.1.28   raspi002   <none>           <none>
```

おー、期待通り raspi003にあるpodが消えて、raspi002に作り直されました。sample-rs-nsc5bはnodeが落ちちゃっているので、消すこともできず残り続けます。

## 少し待ち時間が長いような？
[Kubernetesはクラスタで障害があったとき、どういう動きをするのか](http://dr-asa.hatenablog.com/entry/2018/04/02/174006)という記事によれば、kube-controller-managerが検知して、kube-schedulerが正しい数に揃えているみたいです。**数十秒待たされた**のは、検知の間隔のせいでしょうか。

[kube-controller-manager](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/)のオプションで、`--attach-detach-reconcile-sync-period duration Default: 1m0s`とあります。**1分間隔**なのですかね。

## Podを特定のNodeで動かさないようにしたい
みたいな要望を叶えれるのでしょうか。 

[Assigning Pods to Nodes](https://kubernetes.io/docs/concepts/configuration/assign-pod-node/)によると、nodeSelectorフィールドでアサインされるnodeを指定できるそうです。（除外ではなく、指定）
ただし、[Editing nodeSelector doesn't rearrange pods in ReplicaSet](https://stackoverflow.com/questions/48640806/editing-nodeselector-doesnt-rearrange-pods-in-replicaset)によると、それはreplicaSetではなく、deploymentで行うべきとのことです。replicaSetで動くかどうか、念の為試してみます。

まず、先程落としたraspi003を電源を入れ直して起動させます。
その後、master(raspi001)に移動。

```shell
pi@raspi001:~/tmp $ k label nodes raspi002 type=AWS
node/raspi002 labeled
pi@raspi001:~/tmp $ k label nodes raspi003 type=GCP
node/raspi003 labeled
pi@raspi001:~/tmp $ k get nodes -L type
NAME       STATUS   ROLES    AGE     VERSION   TYPE
raspi001   Ready    master   5d17h   v1.14.1
raspi002   Ready    worker   5d17h   v1.14.1   AWS
raspi003   Ready    worker   4d21h   v1.14.1   GCP
pi@raspi001:~/tmp $ k get pods -o=wide
NAME              READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
sample-2pod       2/2     Running   0          75m   10.244.1.25   raspi002   <none>           <none>
sample-rs-ghkcc   2/2     Running   0          56m   10.244.1.26   raspi002   <none>           <none>
sample-rs-gq2hs   2/2     Running   0          44m   10.244.1.27   raspi002   <none>           <none>
sample-rs-p2jsc   2/2     Running   0          35m   10.244.1.28   raspi002   <none>           <none>
```

nodeにラベルを貼って、nodeSelectorしやすいようにしました。
sample-rsは、全てraspi002で動いているので、下記を試してみます。

1. sample-rsはraspi002でのみ動くよう設定
2. raspi002をシャットダウン

その結果、「sample-rsはraspi002が動いていないので、セルフヒーリングしない」ことを期待します。


```yaml
# sample-rs.yaml
apiVersion: apps/v1
kind: ReplicaSet
metadata:
  name: sample-rs
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
      - name: redis-container
        image: redis:3.2
    nodeSelector:
        type: AWS
```

```shell
pi@raspi001:~/tmp $ k apply -f . --prune --all
replicaset.apps/sample-rs configured
pod/sample-2pod unchanged
```

nodeSelectorを追加しました。 
今回は単純な指定なのでこれで良いですが、より柔軟に指定したい場合はnodeAffinityを使うそうです。


worker(raspi002)に移動

```shell
~ $ slogin pi@raspi002.local
pi@raspi002.local's password:
pi@raspi002:~ $ sudo shutdown now
sudo: unable to resolve host raspi002
Connection to raspi002.local closed by remote host.
Connection to raspi002.local closed.
~ $
```

数十秒待つ...
結果は...!

master(raspi001)に移動

```shell
pi@raspi001:~/tmp $ k get nodes -L type
NAME       STATUS     ROLES    AGE     VERSION   TYPE
raspi001   Ready      master   5d17h   v1.14.1
raspi002   NotReady   worker   5d17h   v1.14.1   AWS
raspi003   Ready      worker   4d22h   v1.14.1   GCP
pi@raspi001:~/tmp $ k get pods -o=wide
NAME              READY   STATUS        RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
sample-2pod       2/2     Terminating   0          89m   10.244.1.25   raspi002   <none>           <none>
sample-rs-4srpp   0/2     Pending       0          36s   <none>        <none>     <none>           <none>
sample-rs-6mgcr   0/2     Pending       0          37s   <none>        <none>     <none>           <none>
sample-rs-ghkcc   2/2     Terminating   0          71m   10.244.1.26   raspi002   <none>           <none>
sample-rs-gq2hs   2/2     Terminating   0          59m   10.244.1.27   raspi002   <none>           <none>
sample-rs-lc225   0/2     Pending       0          36s   <none>        <none>     <none>           <none>
sample-rs-p2jsc   2/2     Terminating   0          49m   10.244.1.28   raspi002   <none>           <none>
```

期待通りでした。つまり、sample-rsはraspi002以外で作り直せないので、Pending,Terminating状態です。
また、単純なpodであるsample-2podはreplicaSetではないので、セルフヒーリングされずにTerminatingになっています。
面白いですね。これ。 

# Deployment
複数のReplicaSetを管理。
ReplicaSetにない「ローリングアップデート、ロールバック」機能が存在。
PodやReplicaSetではなく、Deploymentが最も推奨されるリソース種類。

ReplicaSetでは、指定したコンテナイメージを更新した場合(アップデート)、どうなるのでしょうか。すべて更新されるのか、一部だけなのでしょうか。試してみます。

sample-2pod-replica.yamlのnginxイメージを1.12から1.13に更新しました。

```shell
pi@raspi001:~/tmp $ k get all
NAME                  READY   STATUS    RESTARTS   AGE
pod/sample-rs-4srpp   2/2     Running   0          7h14m
pod/sample-rs-6mgcr   2/2     Running   0          7h14m
pod/sample-rs-lc225   2/2     Running   0          7h14m

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d

NAME                        DESIRED   CURRENT   READY   AGE
replicaset.apps/sample-rs   3         3         3       8h
pi@raspi001:~/tmp $ k apply -f . --prune --all
replicaset.apps/sample-rs configured
pod/sample-2pod created
pi@raspi001:~/tmp $ k describe replicaset sample-rs
Name:         sample-rs
...
  Containers:
   nginx-container:
    Image:        nginx:1.13
...
```

replicasetのマニュフェストは更新されました。

```shell
pi@raspi001:~/tmp $ k describe pod sample-rs-4srpp
Name:               sample-rs-4srpp
...
  nginx-container:
    Container ID:   docker://9160f550ee9d9bbcd1a5c990ca95389b2b39aff6688bcd933c99fe93b1968b99
    Image:          nginx:1.12
...
```

podは変化なしのようです。
では、Deploymentを使ってみます。

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
```

```shell
pi@raspi001:~/tmp $ k apply -f . --prune --all --record
replicaset.apps/sample-rs configured
pod/sample-2pod configured
deployment.apps/sample-deployment created
```

`--record`をつけることで、履歴を保持することができます。ロールバックに使います。

```shell
pi@raspi001:~/tmp $ k get all
NAME                                    READY   STATUS    RESTARTS   AGE
pod/sample-2pod                         2/2     Running   0          12m
pod/sample-deployment-6cd85bd5f-4whgn   1/1     Running   0          119s
pod/sample-deployment-6cd85bd5f-js2sw   1/1     Running   0          119s
pod/sample-deployment-6cd85bd5f-mjt77   1/1     Running   0          119s
pod/sample-rs-4srpp                     2/2     Running   0          7h28m
pod/sample-rs-6mgcr                     2/2     Running   0          7h28m
pod/sample-rs-lc225                     2/2     Running   0          7h28m

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d1h

NAME                                READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/sample-deployment   3/3     3            3           2m

NAME                                          DESIRED   CURRENT   READY   AGE
replicaset.apps/sample-deployment-6cd85bd5f   3         3         3       2m
replicaset.apps/sample-rs                     3         3         3       8h
```

sample-deploymentが、deployment,replicaset,podを作成しました。

では、sample-deploymentのnginxコンテナを1.12から1.13に更新してみます。

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
          image: nginx:1.13
          ports:
            - containerPort: 80
```

```shell
pi@raspi001:~/tmp $ k apply -f . --prune --all --record
replicaset.apps/sample-rs unchanged
pod/sample-2pod unchanged
deployment.apps/sample-deployment configured
pi@raspi001:~/tmp $ k get pod
NAME                                 READY   STATUS              RESTARTS   AGE
sample-2pod                          2/2     Running             0          15m
sample-deployment-6cd85bd5f-js2sw    1/1     Running             0          4m53s
sample-deployment-6cd85bd5f-mjt77    1/1     Running             0          4m53s
sample-deployment-7dfb996c6b-gh2cg   0/1     ContainerCreating   0          21s
sample-deployment-7dfb996c6b-m4wrd   1/1     Running             0          38s
sample-rs-4srpp                      2/2     Running             0          7h31m
sample-rs-6mgcr                      2/2     Running             0          7h31m
sample-rs-lc225                      2/2     Running             0          7h31m
```

おー、deploymentのpodが作り変わっていっています。これが**ローリングアップデート**です。
ローリングアップデートは、spec.template以下が更新されると変化したとみなすそうです。
また、ロールバックは、rolloutコマンドで実施できますし、revision指定で戻すこともできます。
しかし、基本的にはマニュフェストを戻してapplyすべきです。

アップデート戦略というものがあり、デフォルトはRollingUpdateです。過不足分のPod考慮した更新戦略になります。
アップデート中に許容される不足分と超過分を設定できます。(maxUnavailable, maxSurge)
他の戦略として、Recreate戦略があります。こちらは、全て同時に作り直しになります。ですので、一時的にアクセス不可になってしまいます。

１つ不安に感じたものとして、「フロントエンドのバージョンを１から２にアップデートしたら、バージョン1のコンテナにアクセスしたユーザがバージョン2のコンテナに遷移したら大丈夫なのかな」と思いました。しかし、これはローリングアップデートに限った話ではないので、それは考えないこととしました。ちゃんと設計すれば良い話ですね。

ちなみに、マニュフェストを書かずにdeploymentができます。`k run sample-deployment-cli --image nginx:1.12 --replicas 3 --port 80`です。お試しなら、便利ですね。

# お片付け

試しに、pruneで削除しています。

```shell
pi@raspi001:~/tmp $ ls
sample-2pod-replica.yaml  sample-2pod.yaml  sample-deployment.yaml
pi@raspi001:~/tmp $ mv sample-2pod-replica.yaml sample-2pod-replica.yaml.org
pi@raspi001:~/tmp $ mv sample-deployment.yaml sample-deployment.yaml.org
pi@raspi001:~/tmp $ k apply -f . --all --prune
pod/sample-2pod configured
deployment.apps/sample-deployment pruned
replicaset.apps/sample-rs pruned
pi@raspi001:~/tmp $ k get all
NAME              READY   STATUS    RESTARTS   AGE
pod/sample-2pod   2/2     Running   0          30m

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d1h
```
んー、こうすると消せるのですが、どうしても１ファイル残してしまいます...。
すべてorgにすると、`k apply -f .`が失敗しますし...。

```shell
pi@raspi001:~/tmp $ k delete pod sample-2pod
pod "sample-2pod" deleted
```

結局、こうしました...。

```shell
pi@raspi001:~/tmp $ k label node raspi002 type-
pi@raspi001:~/tmp $ k label node raspi003 type-
```

# おわりに
思った以上に、ReplicaSetにハマってしまいました。
次は、残りのworkloadsを試します。
次回は[こちら](./start_the_learning_kubernetes_06.md)です。
