<!-- 
title: 一足遅れて Kubernetes を学び始める - 07. workloads その3 -
date: 2019-05-06T00:00:00+09:00
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

# 前回
[一足遅れて Kubernetes を学び始める - 06. workloads その2 -](BASE_URL/blog/contents/start_the_learning_kubernetes_06)にて、DaemonSetとStatefulSet(一部）を学習しました。今回は、StatefulSetの続きとJob,CronJobを学習します。

# StatefulSet

```yaml
# sample-statefulset.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: sample-statefulset
spec:
  serviceName: sample-statefulset
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
          volumeMounts:
          - name: www
            mountPath: /usr/share/nginx/html
  volumeClaimTemplates:
  - metadata:
      name: www
    spec:
      accessModes:
      - ReadWriteMany
      storageClassName: managed-nfs-storage
      resources:
        requests:
          storage: 1Gi
```

永続的にデータが保存されるかどうか確認します。

```shell
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k exec -it sample-statefulset-0 -- df -h
Filesystem  Size  Used Avail Use% Mounted on
...
192.168.3.35:/home/data/default-www-sample-statefulset-0-pvc-*   15G  1.1G   13G   8% /usr/share/nginx/html
...
pi@raspi001:~/tmp $ k exec -it sample-statefulset-0 touch /usr/share/nginx/html/sample.html
```

sample.htmlというファイルを作りました。こちらが消えるかどうか確認します。

```shell
pi@raspi001:~/tmp $ k delete pod sample-statefulset-0
pi@raspi001:~/tmp $ k exec -it sample-statefulset-0 ls /usr/share/nginx/html/sample.html
/usr/share/nginx/html/sample.html
```

podを消してセルフヒーリングで復活した後、確認すると、sample.html残っています。

```shell
pi@raspi001:~/tmp $ k delete -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k exec -it sample-statefulset-0 ls /usr/share/nginx/html/sample.html
/usr/share/nginx/html/sample.html
```

こちらも残っていますね。OKです。

## スケーリング
StatefulSetでは、スケールアウトするときは、インデックスが小さいものから増えていきます。
逆にスケールインするときは、インデックスが大きいものから削除されていきます。
また、１つずつ増減します。そのため、一番始めに作られるPodは、一番最後に削除されることになります。
試してみます。

```shell
pi@raspi001:~ $ k get pod | grep sample-statefulset
sample-statefulset-0                      1/1     Running   1          10h
sample-statefulset-1                      1/1     Running   1          10h
sample-statefulset-2                      1/1     Running   1          10h
pi@raspi001:~/tmp $ vim sample-statefulset.yaml # replica:3→4
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k get pod | grep sample-statefulset
sample-statefulset-0                      1/1     Running             1          10h
sample-statefulset-1                      1/1     Running             1          10h
sample-statefulset-2                      1/1     Running             1          10h
sample-statefulset-3                      0/1     ContainerCreating   0          6s
pi@raspi001:~/tmp $ vim sample-statefulset.yaml # replica:4→2
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k get pod | grep sample-statefulset
sample-statefulset-0                      1/1     Running       1          10h
sample-statefulset-1                      1/1     Running       1          10h
sample-statefulset-2                      1/1     Running       1          10h
sample-statefulset-3                      0/1     Terminating   0          2m4s
pi@raspi001:~/tmp $ k get pod | grep sample-statefulset
sample-statefulset-0                      1/1     Running       1          10h
sample-statefulset-1                      1/1     Running       1          10h
sample-statefulset-2                      0/1     Terminating   0          10h
```

期待通りですね。１つずつではなく、並列して作成したい場合は、spec.podManagementPolicyをparallelにすれば実現できます。


## アップデート戦略
戦略は２通りあり、OnDeleteとRollingUpdateがあります。前者は、削除された（マニュフェスト更新ではなく、delete）タイミングに更新され、後者は、即時更新します。StatefulSetの更新では、アップデート中の過不足分の調整(maxUnavailable, maxSurge)は一切できません。また、partitionというフィールドのによって、どのインデックス以降を更新するかを調整することもできます。これは、ステートフルならではの機能です。
Deploymentでは試してませんでしたが、こちらで試してみようと思います。

デフォルトの戦略はRollingUpdateです。これは何度も動作して確認できているので、OnDeleteを試そうと思います。(partitionは置いとく）

```yaml
# sample-statefulset.yaml
...
spec:
  updateStrategy:
   type: OnDelete
...
  template:
    spec:
      containers:
        - name: nginx-container
          image: nginx:1.13
...
```

アップデート戦略をOnDeleteにし、nginxイメージを1.12から1.13に更新しました。

```shell
pi@raspi001:~/tmp $ k delete -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
pi@raspi001:~/tmp $ k describe pod sample-statefulset-0 | grep "Image:"
    Image:          nginx:1.12
pi@raspi001:~/tmp $ k delete pod sample-statefulset-0
pi@raspi001:~/tmp $ k get pod | grep sample-statefulset
sample-statefulset-0                      0/1     ContainerCreating   0          5s
sample-statefulset-1                      1/1     Running             0          2m59s
pi@raspi001:~/tmp $ k describe pod sample-statefulset-0 | grep "Image:"
    Image:          nginx:1.13
```

期待通りですね。明示的にpodを削除すればnginxが更新されました。

# Job
一度限りの処理を実行させるリソース。
replicaSetのように複製ができる。
バッチ処理に向いている。

10秒sleepするだけのjobを実行してみます。

```yaml
# sample-job.yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: sample-job
spec:
  completions: 1
  parallelism: 1
  backoffLimit: 10
  template:
    spec:
      containers:
      - name: sleep-container
        image: nginx:1.12
        command: ["sleep"]
        args: ["10"]
      restartPolicy: Never
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-job.yaml
pi@raspi001:~/tmp $ k get pod
NAME                                      READY   STATUS      RESTARTS   AGE
sample-job-d7465                          0/1     Completed   0          3m17s
pi@raspi001:~/tmp $ k get job
NAME         COMPLETIONS   DURATION   AGE
sample-job   1/1           27s        4m8s
```

jobの実行が終わると、podが消えていますね。そして、jobのCOMPLETIONSが1/1になっているので正常終了したみたいです。逆に正常終了しなかった場合、restartPolicyに沿って再実行することになります。種類としてNeverとOnFailureがあります。Neverは、新規にPodを作って再実行、OnFailureは、既存Podを使って再実行するそうです。ただし、データ自体は消失することになるので、ご注意下さい。

completionsは目標成功数で、parallelismは並列数、backoffLimitは失敗許容値です。
目的に合う設定にすれば良いですね。
また、completionsを未指定にするとjobを止めるまでずっと動き続けます。backoffLimitを未指定にすると6回までとなります。

んー、特に興味が惹かれることもなく、終わります。笑

# CronJob
Jobをスケジュールされた時間で実行するリソース。
DeploymentとReplicaSetの関係と似ていて、Cronjobがjobを管理する。

1分毎に50%の確率で成功するjobを用意して、試してみます。

```yaml
# sample-cronjob.yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: sample-cronjob
spec:
  schedule: "*/1 * * * *"
  concurrencyPolicy: Allow
  startingDeadlineSeconds: 30
  successfulJobsHistoryLimit: 5
  failedJobsHistoryLimit: 3
  suspend: false
  jobTemplate:
    spec:
      completions: 1
      parallelism: 1
      backoffLimit: 1
      template:
        spec:
          containers:
          - name: sleep-container
            image: nginx:1.12
            command:
            - "sh"
            - "-c"
            args:
            # 約50%の確率で成功するコマンド
            - "sleep 40; date +'%N' | cut -c 9 | egrep '[1|3|5|7|9]'"
          restartPolicy: Never
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-cronjob.yaml
pi@raspi001:~/tmp $ k get all
NAME                           SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/sample-cronjob   */1 * * * *   False     0        <none>          9s
```

時間がくるまで、job,podは作成されないようです。
数分待ってみました。

```shell
pi@raspi001:~/tmp $ k get all
NAME                                          READY   STATUS      RESTARTS   AGE
pod/sample-cronjob-1557115320-dsdvg           0/1     Error       0          2m18s
pod/sample-cronjob-1557115320-qkgtp           0/1     Completed   0          87s
pod/sample-cronjob-1557115380-r57sw           0/1     Completed   0          78s
pod/sample-cronjob-1557115440-2phzb           1/1     Running     0          17s

NAME                                  COMPLETIONS   DURATION   AGE
job.batch/sample-cronjob-1557115320   1/1           105s       2m18s
job.batch/sample-cronjob-1557115380   1/1           52s        78s
job.batch/sample-cronjob-1557115440   0/1           17s        17s

NAME                           SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
cronjob.batch/sample-cronjob   */1 * * * *   False     1        20s             3m12s
```

名前の命名ルールがあるので、どう関連しているのか一目瞭然ですね。
Podが残っているのは、failedJobsHistoryLimitとsuccessfulJobsHistoryLimitの値の影響ですね。
logで確認できるように残しておくそうですが、ログ収集基盤に集約した方が良いとも言われています。

途中で止めたいときは、spec.suspendをtrueにすることで実現可能になります。
同時実行する制限として、concurrencyPolicyがあり、Allow,Forbid,Replaceがあります。
Allowは、特に制限しない。
Forbidは、前のjobが終わらない限り実行しない。
Replaceは、前のjobを削除し、jobを実行する。

遅延がどのぐらい許容できるかは、startingDeadlineSecondsで指定します。

こちらも、特に何事もなく終わりました。笑

# お片付け
```shell
pi@raspi001:~/tmp $ k delete -f sample-statefulset.yaml -f sample-job.yaml -f sample-cronjob.yaml
pi@raspi001:~/tmp $ k delete pvc www-sample-statefulset-{0,1,2,3}
```

# 終わりに
ようやく、workloadsが終わりました。最後はざっくり進めてしまった感がありました。
次回は[こちら](BASE_URL/blog/contents/start_the_learning_kubernetes_08)です。
