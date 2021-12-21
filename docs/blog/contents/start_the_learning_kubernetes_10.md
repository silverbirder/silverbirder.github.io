---
title: 一足遅れて Kubernetes を学び始める - 10. config&storage その1 -
published: true
date: 2019-05-23
description: 前回 一足遅れて Kubernetes を学び始める - 09. discovery&LB その2 -では、様々なserviceを学習しました。今回は、config&storageのconfigを学びます。
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
[一足遅れて Kubernetes を学び始める - 09. discovery&LB その2 -](./start_the_learning_kubernetes_09.md)では、様々なserviceを学習しました。
今回は、config&storageのconfigを学びます。

# config&storage

Kubernetesには、下記のようにリソースの種類が存在します。

| リソースの分類 | 内容 |
|:--|:--|
| Workloadsリソース | コンテナの実行に関するリソース |
| Discovery＆LBリソース | コンテナを外部公開するようなエンドポイントを提供するリソース |
| Config＆Storageリソース | 設定・機密情報・永続化ボリュームなどに関するリソース |
| Clusterリソース | セキュリティやクォータなどに関するリソース |
| Metadataリソース | リソースを操作する系統のリソース |
※ [KubernetesのWorkloadsリソース（その1）](https://thinkit.co.jp/article/13610)

# 環境変数

静的設定や、Podやコンテナの情報を設定、シークレットでの設定があるみたいです。

```yaml
# sample-env.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-env
  labels:
    app: sample-app
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
      env:
        - name: MAX_CONNECTION
          value: "100"
        - name: POD_IP
          valueFrom:
           fieldRef:
            fieldPath: status.podIP
        - name: LIMITS_CPU
          valueFrom:
            resourceFieldRef:
             containerName: nginx-container
             resource: limits.cpu
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-env.yaml
pi@raspi001:~/tmp $ k exec -it sample-env env
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
...
MAX_CONNECTION=100
POD_IP=10.244.1.97
LIMITS_CPU=4
...
```

MAX_CONNECTIONは、静的に設定できています。
Podやコンテナの設定は、POD_IP,KIMITS_CPUで設定できています。
Podやコンテナの情報は、`k get pods sample-env -o yaml`で得ることができます。ふむふむ。

# Secret
パスワードなどの機密情報をSecretで暗号化してくれます。
手段の種類が下記のようにいくつかあります。

* Generic
* TLS
* Docker Repository
* Service Account

Genericの場合は、スキーマレスなため、汎用性の高い指定が可能になります。それを使ってみようと思います。(TLSの場合は、tls.crt,tls.keyが必要）

使い方して、ファイル参照、envfile参照、直接指定、マニュフェスト指定の４パターンです。それぞれ試してみます。

## ファイル参照
```shell
pi@raspi001:~/tmp $ echo -n "root" > ./username
pi@raspi001:~/tmp $ echo -n "rootpassword" > ./password
pi@raspi001:~/tmp $ k create secret generic --save-config sample-db-auth --from-file=./username --from-file=./password
pi@raspi001:~/tmp $ sudo apt-get install jq
pi@raspi001:~/tmp $ k get secrets sample-db-auth -o json | jq .data
{
  "password": "cm9vdHBhc3N3b3Jk",
  "username": "cm9vdA=="
}
```

## envfile参照

```
# env-secret.txt
username=root
password=rootpassword
```

```shell
pi@raspi001:~/tmp $ k create secret generic --save-config sample-db-auth2 --from-env-file ./env-secret.txt
pi@raspi001:~/tmp $ k get secrets sample-db-auth2 -o json | jq .data
{
  "password": "cm9vdHBhc3N3b3Jk",
  "username": "cm9vdA=="
}
```

## 直接指定

```shell
pi@raspi001:~/tmp $ k create secret generic --save-config sample-db-auth3 --from-literal=username=root --from-literal=password=rootpassword
pi@raspi001:~/tmp $ k get secrets sample-db-auth3 -o json | jq .data
{
  "password": "cm9vdHBhc3N3b3Jk",
  "username": "cm9vdA=="
}
```

## マニュフェスト指定

```yaml
# sample-db-auth.yaml
apiVersion: v1
kind: Secret
metadata:
  name: sample-db-auth4
type: Opaque
data:
  username: cm9vdA== # root
  password: cm9vdHBhc3N3b3Jk # rootpassword
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-db-auth.yaml
pi@raspi001:~/tmp $ k get secrets sample-db-auth4 -o json | jq .data
{
  "password": "cm9vdHBhc3N3b3Jk",
  "username": "cm9vdA=="
}
```

どれも、正しく動きましたね。プロダクトとしては使わないと思いますが、お試しで確認するには
Genericは扱いやすくて良いですね。

では、設定した値を使ってみましょう。

# Secretの利用
手段として、環境変数かVolumeかの2つです。

## 環境変数からSecretを使う

```yaml
# sample-secret-single-env.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-secret-single-env
spec:
  containers:
    - name: secret-container
      image: nginx:1.12
      env:
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: sample-db-auth
              key: username
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-secret-single-env.yaml
pi@raspi001:~/tmp $ k exec -it sample-secret-single-env env | grep DB_USERNAME
DB_USERNAME=root
```

環境変数から使う場合、値が固定されてしまいます。（静的）

## VolumeからSecretを使う

```yaml
# sample-secret-single-volume.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-secret-single-volume
spec:
  containers:
    - name: secret-container
      image: nginx:1.12
      volumeMounts:
      - name: config-volume
        mountPath: /config
  volumes:
    - name: config-volume
      secret:
        secretName: sample-db-auth
        items:
        - key: username
          path: username.txt
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-secret-single-volume.yaml
pi@raspi001:~/tmp $ k exec -it sample-secret-single-volume cat /config/username.txt
root
```

こちらは、動的に書き換えることができるそうです。逐次Volumeを見ているんでしょうね。（環境変数の場合、コンテン起動した時点で固定される）

```shell
pi@raspi001:~/tmp $ cat << EOF | k apply -f -
> apiVersion: v1
> kind: Secret
> metadata:
>   name: sample-db-auth
> type: Opaque
> data:
>  username: YMRtaW4=
>  # root > admin
> EOF
pi@raspi001:~/tmp $ k exec -it sample-secret-single-volume cat /config/username.txt
amin
```

動的に書き換わっていますね。OK!

※ adminのaが文字化けしていた...

# ConfigMap
設定情報をKey-Value形式で登録することができます。
こちらも手段としては、ファイル参照、直接参照、マニフェスト参照があります。
さっきと同じなので、ファイル参照のみ試してみます。

```
# sample.txt
hogehoge
fugafuga
```

```shell
pi@raspi001:~/tmp $ k create configmap --save-config sample-configmap --from-file=./sample.txt
pi@raspi001:~/tmp $ k get configmaps sample-configmap -o json | jq .data
{
  "sample.txt": "hogehoge\nfugafuga\n"
}
```

secretと同じ感じですね。これって、どんなファイルでも(1MBまで)保存できちゃうそうです。
secretと同様で、設定したデータは環境変数、Volumeの２つから参照可能です。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-env.yaml -f sample-db-auth.yaml -f sample-secret-single-env.yaml -f sample-secret-single-volume.yaml
pi@raspi001:~/tmp $ k delete secret sample-db-auth sample-db-auth2 sample-db-auth3 
pi@raspi001:~/tmp $ k delete configmap sample-configmap
```

# 最後に
環境変数の設定方法について、学びました。
個人開発で、外部サービスをアプリケーションに組み込む際、
API_KEYを環境変数として登録して開発しています。
今回は、GenericでSecretを保存しましたが、プロダクトでは、
service_accountを使うのが一般的なのでしょうか？

次回は、Storageについて学習します。
[こちら](./start_the_learning_kubernetes_11.md)です。
