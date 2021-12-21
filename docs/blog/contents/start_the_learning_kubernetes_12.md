---
title: 一足遅れて Kubernetes を学び始める - 12. リソース制限 -
published: true
date: 2019-05-29
description: 前回 一足遅れて Kubernetes を学び始める - 11. config&storage その2 -では、storageについて学習しました。今回は、リソース制限について学習します。
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
[一足遅れて Kubernetes を学び始める - 11. config&storage その2 -](./start_the_learning_kubernetes_11.md)では、storageについて学習しました。
今回は、リソース制限について学習します。

※ リソースの種類から、次は「Metadata」だったのですが、kubernetes完全ガイドによると直接説明するのではなく、内容ベースで説明されていましたので、それに準拠します。

# リソース制限
kubernetesで管理するコンテナに対して、リソース制限をかけることができます。主にCPUやメモリに対して制限をかけることができますが、Device Pluginsを使うことでGPUにも制限をかけることもできます。

※ CPUの指定方法は、1vCPUを1000millicores(m)とする単位となります。

# requestsとlimits

requestは、使用するリソースの下限値です。
limitsは、使用するリソースの上限値です。

requestは、空きノードに指定するリソースがなければスケジューリングされませんが、limitsは、関係なくスケジューリングされます。

とにもかくにも、試してみましょう。

まず、現状確認です。

```shell
pi@raspi001:~/tmp $ k get node
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   31d   v1.14.1
raspi002   Ready    worker   31d   v1.14.1
raspi003   Ready    worker   30d   v1.14.1
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.allocatable.memory}'
847048Ki 847048Ki
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.allocatable.cpu}'
4 4
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.capacity.memory}'
949448Ki 949448Ki
pi@raspi001:~/tmp $ k get nodes -o jsonpath='{.items[?(@.metadata.name!="raspi001")].status.capacity.cpu}'
4 4

```
jsonpathの使い方は、[こちら](https://kubernetes.io/docs/reference/kubectl/jsonpath/)にあります。

allocatableがPodに配置できるリソース量で、capacityはNode全体での配置できるリソース量です。
これだけだと、現在使っているリソース量が不明なので個別に調べます。

```shell
pi@raspi001:~/tmp $ k describe node raspi002
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                200m (5%)    200m (5%)
  memory             150Mi (18%)  150Mi (18%)
  ephemeral-storage  0 (0%)       0 (0%)
...
pi@raspi001:~/tmp $ k describe node raspi003
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                400m (10%)   300m (7%)
  memory             320Mi (38%)  420Mi (50%)
  ephemeral-storage  0 (0%)       0 (0%)
...
```

現状のリソース状況を表にすると下記のとおりです。

|node|allocatable<br>(memory/cpu)|capacity<br>(memory/cpu)|used<br>(memory/cpu)|remain<br>(memory/cpu)|
|---|---|---|---|---|
|raspi002|847,048Ki/4000m|949,448Ki/4000m|150,000Ki/200m|697,048Ki/3800m|
|raspi003|847,048Ki/4000m|949,448Ki/4000m|320,000Ki/400m|527,048Ki/3600m|

では、リソース制限を試してみましょう。

```yaml
# sample-resource.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-resource
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
          resources:
            requests:
              memory: "128Mi"
              cpu: "300m"
            limits:
              memory: "256Mi"
              cpu: "600m"
```

applyするpodで要求するmemoryの下限合計は384Mi(128Mi×3),cpuは900m(300m×3)です。
これだと、podがrunするはずです。

```shell
pi@raspi001:~/tmp $ k apply -f sample-resource.yaml
pi@raspi001:~/tmp $ k get pods
NAME                                      READY   STATUS    RESTARTS   AGE
sample-resource-785cd54844-7n89t          1/1     Running   0          108s
sample-resource-785cd54844-9b5f9          1/1     Running   0          108s
sample-resource-785cd54844-whj7x          1/1     Running   0          108s
```

期待通りですね。
今度はリソース制限になる状態を試してみます。

全WorkerNodeのmemory下限合計は1,224Mi(697,048Ki+527,048Ki)です。
これを超えるように先程のマニフェストを更新します。
replica数を3にしましたが、10にすれば良いですね（1,280Mi)

期待動作として、9個(128Mi*9=1,152Mi)はRunningで、1個(128Mi)はPendingになるはずです。

sample-resource.yamlのreplicaを10に変更したあと↓

```shell
pi@raspi001:~/tmp $ k apply -f sample-resource.yaml
pi@raspi001:~/tmp $ k get pods
NAME                                      READY   STATUS    RESTARTS   AGE
sample-resource-785cd54844-7n89t          1/1     Running   0          6m19s
sample-resource-785cd54844-9b5f9          1/1     Running   0          6m19s
sample-resource-785cd54844-dffsd          1/1     Running   0          61s
sample-resource-785cd54844-jmkv6          1/1     Running   0          61s
sample-resource-785cd54844-k9vcb          1/1     Running   0          61s
sample-resource-785cd54844-l4smf          0/1     Pending   0          60s
sample-resource-785cd54844-n4hl7          1/1     Running   0          60s
sample-resource-785cd54844-th4bp          0/1     Pending   0          60s
sample-resource-785cd54844-whj7x          1/1     Running   0          6m19s
sample-resource-785cd54844-xclsk          1/1     Running   0          60s
```

あれ、2つPendingになっていますね。もしかして、Nodeの空きリソースが中途半端にないからですかね。
確認してみましょう。

```shell
pi@raspi001:~/tmp $ k describe node raspi002
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1700m (42%)  3200m (80%)
  memory             790Mi (95%)  1430Mi (172%)
  ephemeral-storage  0 (0%)       0 (0%)
...
pi@raspi001:~/tmp $ k describe node raspi003
...
Allocated resources:
  (Total limits may be over 100 percent, i.e., overcommitted.)
  Resource           Requests     Limits
  --------           --------     ------
  cpu                1300m (32%)  2100m (52%)
  memory             704Mi (85%)  1188Mi (143%)
  ephemeral-storage  0 (0%)       0 (0%)
...
```

raspi002は、847Mi中790Mi使っています。１つのPodを追加するためのリソース（128Mi）はないですね。
raspi003は、847Mi中704Mi使っています。こちらは空いている気がするのですが、なぜでしょうか。

ここで、memoryの`704Mi (85%) `というところに着目すると、100%だった場合は828Miということになります。
確かに、それだと704Mi+128Mi=832Miでオーバーしています。

では、allocatableで表示されていた847Miとの違いは何でしょうか。
allocatableというのは、全てのnamespaceにあるpodも込みのリソース配置可能量だからです。
defaultだけでなく、kube-systemなど他のnamespaceにあるpodも、もちろんリソースを消費しています。
828Miというのは、defaultで使えるリソース配置可能量ではないでしょうか。（現在のnamespaceはdefault)

ちなみに、Limitsは、100%を超えていますね...。ひぇ〜...。

# Cluster Autoscaler
需要に応じてKubernetes Nodeを自動的に追加されていく機能です。
これが動作するタイミングは、PodがPendingになったときに動作します。
つまり、先程の例であったように、requestsの下限によってスケールします。

そのため、requestsが高すぎるために、実際はロードアベレージが低くてもスケールしてしまったり、
requestsが低すぎるために、実際は高負荷でもスケールしなくなったりします。
requestsは、パフォーマンステストをしつつ最適化していきましょう。

# LimitRange
さっきの例でもあったように、それぞれに対してrequests,limitを設定しても良いのですが、
もっと便利なものがあります。それがLimitRangeです。
これは、Namespaceに対してCPUやメモリのリソースの最小値や最大値を設定できます。
設定可能な制限項目として、下記があります。

* default
    * デフォルトのLimits
* defaultRequest
    * デフォルトのRequests
* max
    * 最大リソース
* min
    * 最小リソース
* maxLimitRequestRatio
    * Limits/Requestsの割合

また、制限する対象は、Container,Pod,PersistentVolumeClaimがあります。
実運用する際は、きちんと定義しておきましょう。（プロバイダーによってはデフォルトで設定されているものもあるそうです）

# ResourceQuota
ResourceQuotaを使うことで、Namespaceごとに「作成可能なリソース数の制限」と「リソース使用量の制限」ができます。
「作成可能なリソース数の制限」を試そうと思います。

```yaml
# sample-resourcequota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: sample-resourcequota
  namespace: default
spec:
  hard:
    # 作成可能なリソースの数
    count/pods: 5
```

```shell
pi@raspi001:~/tmp $ k delete -f sample-resource.yaml
pi@raspi001:~/tmp $ k apply -f sample-resourcequota.yaml
pi@raspi001:~/tmp $ k apply -f sample-resource.yaml
pi@raspi001:~/tmp $ k get pods
NAME                                      READY   STATUS    RESTARTS   AGE
sample-resource-785cd54844-dll8t          1/1     Running   0          38s
sample-resource-785cd54844-ljr7q          1/1     Running   0          39s
sample-resource-785cd54844-r6txh          1/1     Running   0          38s
sample-resource-785cd54844-sb6sq          1/1     Running   0          38s
sample-resource-785cd54844-3ffeg          1/1     Running   0          38s
```

こうすると、podsが5個までしか作成できないので、sample-resource.yamlを適用しても5個までしか作成されません。
replicaのような場合は、特に警告がなく単純に作られませんでした。
configmapを5個までに制限して、1つずつconfigmapをapplyすると、警告がでるそうです。

# HorizontalPodAutoscaler(HPA)
HPAは、Deployment,ReplicaSetで管理するPodのCPU負荷などに応じて自動的にスケールするリソースです。
30秒に１回の頻度でスケールするかチェックしています。

必要なレプリカ数は、下記の数式で表します。

* 必要なレプリカ数 = ceil(sum(Podの現在のCPU使用率)/targetAverageUtilization)

[KubernetesのPodとNodeのAuto Scalingについて](https://qiita.com/sheepland/items/37ea0b77df9a4b4c9d80)で、
> auto scalingはtarget valueに近づくようにpod数が調整されるということ。

という文がわかりやすかったです。つまり、targetAverageUtilizationが50なら、全体のCPU使用率が50%になるよう調整されます。
今回、試そうと考えたのですが、metrics-serverをinstallしていないため、動作確認できませんでした。
また今度installして試してみようと思います。

# VerticalPodAutoscaler(VPA)
VPAは、コンテナに割り当てるCPUやメモリのリソース割当をスケールさせるリソースです。
これは、HPAのスケールアウトではなく、Podのスケールアップを行うものです。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-resource.yaml -f sample-resourcequota.yaml
```

# 最後に
今回は、RequestsやLimitsを操作してリソース制限をしてみました。
どれがいくらリソースを消費しているのか確認する術を学び、
ついでにjsonpathの使い方も知りました。
次回は、[こちら](./start_the_learning_kubernetes_13.md)です。
