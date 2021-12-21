---
title: 一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -
published: true
date: 2019-05-30
description: 前回 一足遅れて Kubernetes を学び始める - 12. リソース制限 -では、requestsやlimitなどのリソース制限について学習しました。今回は、ヘルスチェックとコンテナライフサイクルについて学習します。
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
[一足遅れて Kubernetes を学び始める - 12. リソース制限 -](./start_the_learning_kubernetes_12.md)では、requestsやlimitなどのリソース制限について学習しました。今回は、ヘルスチェックとコンテナライフサイクルについて学習します。

# ヘルスチェック
Kubernetesでは、Podの正常生判断のためのヘルスチェックが2種類用意されています。

* Liveness Probe
    * Podが正常か判断。異常だった場合、Podを再起動。
* Readiness Probe
    * Podがサービスインする準備ができているか判断。準備できていなかったら、トラフィックを流さない。

たとえば、Pod内でメモリリークが発生し応答しなくなった場合に有効です。
LoadBalancerのサービスは、ICMPによる簡易ヘルスチェックがデフォルトで用意されています。

また、Liveness、Readinessどちらにも３つの方式があります。

* exec
    * コマンドを実行し、終了コードが0でなければ失敗
* httpGet
    * HTTP GETリクエストを実行し、statusCodeが200~399でなければ失敗
* tcpSocket
    * TCPセッションが確立できなければ失敗

では、試してみましょう。

```yaml
# sample-healthcheck.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-healthcheck
  labels:
    app: sample-app
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
      ports:
      - containerPort: 80
      livenessProbe:
        httpGet:
          path: /index.html
          port: 80
          scheme: HTTP
        timeoutSeconds: 1
        successThreshold: 1
        failureThreshold: 2
        initialDelaySeconds: 5
        periodSeconds: 3
      readinessProbe:
        exec:
          command: ["ls", "/usr/share/nginx/html/50x.html"]
        timeoutSeconds: 1
        successThreshold: 2
        failureThreshold: 1
        initialDelaySeconds: 5
        periodSeconds: 3
```

* timeoutSeconds
    * タイムアウトまでの秒数
* successThreshold
    * 成功と判断するまでのチェック回数
* failureThreshold
    * 失敗と判断するまでのチェック回数
* initialDelaySeconds
    * 初回ヘルスチェック開始までの遅延
* periodSeconds
    * ヘルスチェックの間隔

```shell
pi@raspi001:~/tmp $ k apply -f sample-healthcheck.yaml
pi@raspi001:~/tmp $ k describe pod sample-healthcheck | egrep "Liveness|Readiness"
    Liveness:       http-get http://:80/index.html delay=5s timeout=1s period=3s #success=1 #failure=2
    Readiness:      exec [ls /usr/share/nginx/html/50x.html] delay=5s timeout=1s period=3s #success=2 #failure=1
```

設定どおりに動作していますね。では、失敗させましょう。

livenessを失敗させるにはindex.htmlを削除すれば良いですね。

```shell
pi@raspi001:~/tmp $ k exec -it sample-healthcheck rm /usr/share/nginx/html/index.html
pi@raspi001:~/tmp $ k get pods --watch
NAME                                      READY   STATUS    RESTARTS   AGE
sample-healthcheck                        1/1     Running   1          9m54s
sample-healthcheck                        0/1     Running   2          10m
sample-healthcheck                        1/1     Running   2          10m
```

一度削除されて、再起動しましたね。
今度は、readinessを失敗させましょう。こちらは50x.htmlを削除すれば良いですね。

```shell
pi@raspi001:~/tmp $ k exec -it sample-healthcheck rm /usr/share/nginx/html/50x.html
pi@raspi001:~/tmp $ k get pods --watch
NAME                                      READY   STATUS    RESTARTS   AGE
sample-healthcheck                        1/1     Running   2          16m
sample-healthcheck                        0/1     Running   2          16m
pi@raspi001:~/tmp $ k exec -it sample-healthcheck touch /usr/share/nginx/html/50x.html
pi@raspi001:~/tmp $ k get pods --watch
NAME                                      READY   STATUS    RESTARTS   AGE
sample-healthcheck                        0/1     Running   2          17m
sample-healthcheck                        1/1     Running   2          17m
```

期待通り、50x.htmlを削除すると、READYから外れて、追加するとREADYに戻りました。

# コンテナの再起動
コンテナのプロセスが停止、またはヘルスチェックの失敗によってコンテナを再起動するかどうかは、spec.restartPolicyによって決まります。
種類は下記３つです。

* Always
    * 常にPodを再起動させる
* OnFailure
    * 終了コード0以外の予期せぬ停止の場合、Podを再起動させる
* Never
    * 再起動させない

試してみましょう。

```yaml
# sample-restart-always.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-restart-always
spec:
  restartPolicy: Always
  containers:
    - name: nginx-container
      image: nginx:1.12
      command: ["sh", "-c", "exit 0"] # 成功の場合
#      command: ["sh", "-c", "exit 1"] # 失敗の場合
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-restart-always.yaml
# 成功の場合
pi@raspi001:~/tmp $ k get pods sample-restart-always --watch
NAME                    READY   STATUS              RESTARTS   AGE
sample-restart-always   0/1     ContainerCreating   0          13s
sample-restart-always   0/1     Completed           0          19s
sample-restart-always   0/1     Completed           1          27s
sample-restart-always   0/1     CrashLoopBackOff    1          28s
sample-restart-always   0/1     Completed           2          37s
# 失敗の場合
pi@raspi001:~/tmp $ k get pods sample-restart-always --watch
NAME                    READY   STATUS              RESTARTS   AGE
sample-restart-always   0/1     ContainerCreating   0          7s
sample-restart-always   0/1     Error               0          12s
sample-restart-always   0/1     Error               1          17s
sample-restart-always   0/1     CrashLoopBackOff    1          18s
sample-restart-always   0/1     Error               2          37s
```

成功、失敗どちらも再起動していることがわかります。

```yaml
# sample-restart-onfailure.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-restart-onfailure
spec:
  restartPolicy: OnFailure
  containers:
    - name: nginx-container
      image: nginx:1.12
      command: ["sh", "-c", "exit 0"] # 成功の場合
#      command: ["sh", "-c", "exit 1"] # 失敗の場合
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-restart-onfailure.yaml
# 成功の場合
pi@raspi001:~/tmp $ k get pods sample-restart-onfailure --watch
NAME                       READY   STATUS              RESTARTS   AGE
sample-restart-onfailure   0/1     ContainerCreating   0          3s
sample-restart-onfailure   0/1     Completed           0          15s
# 失敗の場合
pi@raspi001:~/tmp $ k get pods sample-restart-onfailure --watch
NAME                       READY   STATUS              RESTARTS   AGE
sample-restart-onfailure   0/1     ContainerCreating   0          4s
sample-restart-onfailure   0/1     Error               0          22s
sample-restart-onfailure   0/1     Error               1          28s
sample-restart-onfailure   0/1     CrashLoopBackOff    1          29s
sample-restart-onfailure   0/1     Error               2          50s
```

成功時は、Completedの終了していますね。CrashLoopBackOffしていません。失敗時は、Errorとなり、CrashLoopBackOffしています。
期待通りですね。

# initContainers
Podのメインとなるコンテナを起動する前に別のコンテナを起動させるための機能です。
spec.containersがもともとありますが、こちらは同時並列で起動するので、順序が必要な場合には向いていません。
initContainersは、spec.initContainersで設定でき、複数指定できます。複数の場合は上から順に起動します。

試してみましょう。

```yaml
# sample-initcontainer.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-initcontainer
spec:
  initContainers:
    - name: output-1
      image: nginx:1.12
      command: ['sh', '-c', 'sleep 20; echo 1st > /usr/share/nginx/html/index.html']
      volumeMounts:
      - name: html-volume
        mountPath: /usr/share/nginx/html/
    - name: output-2
      image: nginx:1.12
      command: ['sh', '-c', 'sleep 10; echo 2nd >> /usr/share/nginx/html/index.html']
      volumeMounts:
      - name: html-volume
        mountPath: /usr/share/nginx/html/
  containers:
    - name: nginx-container
      image: nginx:1.12
      volumeMounts:
      - name: html-volume
        mountPath: /usr/share/nginx/html/
  volumes:
  - name: html-volume
    emptyDir: {}
```

```shell
pi@raspi001:~/tmp $ k get pod sample-initcontainer --watch
NAME                   READY   STATUS     RESTARTS   AGE
sample-initcontainer   0/1     Init:0/2   0          3s
sample-initcontainer   0/1     Init:0/2   0          9s
sample-initcontainer   0/1     Init:1/2   0          30s
sample-initcontainer   0/1     Init:1/2   0          38s
sample-initcontainer   0/1     PodInitializing   0          51s
sample-initcontainer   1/1     Running           0          59s
pi@raspi001:~/tmp $ k exec -it sample-initcontainer cat /usr/share/nginx/html/index.html
1st
2nd
```

確かに、initContainersが順序通り起動できています。ふむふむ。

# 起動時と終了時のコマンド実行(postStart,preStop)
コンテナ起動後に実行するコマンドをpostStart,
コンテナ終了前に実行するコマンドをpreStopという機能で実現できます。

```yaml
# sample-lifecycle.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-lifecycle
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
      command: ["/bin/sh", "-c", "touch /tmp/started; sleep 3600"]
      lifecycle:
        postStart:
          exec:
            command: ["/bin/sh", "-c", "sleep 20; touch /tmp/poststart"]
        preStop:
          exec:
            command: ["/bin/sh", "-c", "touch /tmp/prestop; sleep 20"]
```

```shell
pi@raspi001:~/tmp $  k apply -f sample-lifecycle.yaml
pi@raspi001:~/tmp $  k exec -it sample-lifecycle ls /tmp
started
# 数秒後
pi@raspi001:~/tmp $  $ k exec -it sample-lifecycle ls /tmp
poststart  started
pi@raspi001:~/tmp $ k delete -f sample-lifecycle.yaml
# すぐ!
pi@raspi001:~/tmp $ k exec -it sample-lifecycle ls /tmp
poststart  prestop  started
```

たしかに、postStart, preStopが動いています。
注意しないといけないのが、postStartは、spec.containers[].commandの実行とほぼ同じだそうです。（非同期)

# Podの安全な停止とタイミング
terminationGracePeriodSecondsに指定した秒数は、podが削除開始時からの猶予です。
デフォルトで30秒となっています。30秒の間にpreStop+SIGTERMの処理が終わらなければ、
強制的にSIGKILLされて停止されます。ただし、preStopが終わっていなくて30秒たった場合、
SIGTERM処理を2秒だけ実施できます。
terminationGracePeriodSecondsの値は、prePostを必ず終える秒数に設定しましょう。

# Nodeをスケジューリング対象から外す
Nodeをkubernetesのスケジューリング対象から外すcordonというコマンドがあります。
Nodeの状態には、SchedulingEnabledとSchedulingDisabledがあり、後者の状態になると、
kubernetesからのスケジューリング対象外となり、たとえばReplicaSetの更新などが機能しなくなります。

cordonコマンドを使うと、指定するNodeがSchedulingDisabledになります。(uncordonは逆)
ただし、現在動作しているPodはスケジューリング対象になったままで、新たに追加するものが
スケジューリング対象外になります。現在動作しているものも対象にしたい場合は、drainコマンド
を使います。
実際に試してみます。

```shell
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   33d   v1.14.1
raspi002   Ready    worker   33d   v1.14.1
raspi003   Ready    worker   32d   v1.14.1
pi@raspi001:~/tmp $ k cordon raspi002
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS                     ROLES    AGE   VERSION
raspi001   Ready                      master   33d   v1.14.1
raspi002   Ready,SchedulingDisabled   worker   33d   v1.14.1
raspi003   Ready                      worker   32d   v1.14.1
pi@raspi001:~/tmp $ k uncordon raspi002
pi@raspi001:~/tmp $ k get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   33d   v1.14.1
raspi002   Ready    worker   33d   v1.14.1
raspi003   Ready    worker   32d   v1.14.1
pi@raspi001:~/tmp $ k drain raspi002
node/raspi002 cordoned
error: unable to drain node "raspi002", aborting command...

There are pending nodes to be drained:
 raspi002
error: cannot delete DaemonSet-managed Pods (use --ignore-daemonsets to ignore): kube-system/kube-flannel-ds-arm-7nnbj, kube-system/kube-proxy-wgjdq, metallb-system/speaker-tsxdk
```

drainすると、ReplicaSetのように管理したPodであれば、別Nodeに作成されるので良いのですが、
単体Podなど管理されていないものは、削除されてしまいます。上記の警告は、DaemonSetで管理されているPodは、
削除するしかないけど、良いですか？というものです。
そのため、drainをすると、いくつか警告されます。警告内容に従って適宜操作する必要があります。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-healthcheck.yaml -f sample-restart-always.yaml -f sample-restart-onfailure.yaml -f sample-initcontainer.yaml -f sample-lifecycle.yaml
```

# 最後に
今回は、ヘルスチェックの動作と、コンテナを停止するまでのステップを学習しました。
わざわざヘルスチェックの処理をアプリケーションに用意せずとも、kubernetesに機能として
存在することに、驚きました。次回は、[こちら](./start_the_learning_kubernetes_14.md)です。
