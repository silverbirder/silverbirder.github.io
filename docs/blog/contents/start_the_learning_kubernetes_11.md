---
title: 一足遅れて Kubernetes を学び始める - 11. config&storage その2 -
published: true
date: 2019-05-27
description: 前回 一足遅れて Kubernetes を学び始める - 10. config&storage その1 -では、configについて学習しました。今回は、storageを学びます。
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
[一足遅れて Kubernetes を学び始める - 10. config&storage その1 -](./start_the_learning_kubernetes_10.md)では、configについて学習しました。
今回は、storageを学びます。

# VolumeとPresistentVolume
Volumeは、あらかじめ決められた利用可能なボリュームを指します。こちらは、ボリュームの削除や新規作成ができません。
PresistentVolumeは、外部にある永続ボリュームを指します。こちらは、ボリュームの削除や新規作成ができます。
DBのようなステートフルなものはPresistentVolumeを使います。
一時的なものなら、Volumeを使うのですかね？ 

※ PresistentVolumeClaimは、PresistentVolumeをアサインするためのリソース。

# Volumeの種類
書籍（kubernetes完全ガイド）で紹介されていたVolumeの種類は、下記のとおりです。

* emptyDir
    * 一時的なディスク領域を利用
    * pod削除されると、emptyDirも削除
    * マウント先を指定できない
* hostPath
    * emptyDirのマウント先を指定できる版
* downwardAPI
    * Podの情報をファイルとして配置したファイルをマウント
* projected
    * secret/configMap/downwardAPI/serviceAccountTokenを１つにまとめたディレクトを作成し、マウント

※ [types-of-volumes](https://kubernetes.io/docs/concepts/storage/volumes/#types-of-volumes)

Volumeを残すことができないので、Podを削除する際は気をつけないとダメですね。
ログをファイルとして保存するなら、一時的にVolumeが良いのですかね。
ただ、定期的に外部ストレージに移さないといけないですので、手間です。
（そもそも、ログはストリームにして外部サービスに流すのがベスト）

プロダクトとしては、あんまり使い道ない...? 

# PresistentVolumeの種類

外部の永続ボリュームを利用します。例えば、下記の種類があります。

* GCE Persistent Disk
* AWS Elastic Block Store
* NFS
* iSCSI
* Ceph
* OpenStack Cinder
* GlusterFS

[一足遅れて Kubernetes を学び始める - 06. workloads その2 -](./start_the_learning_kubernetes_06.md)では、NFSを使いましたね。
PersistentVolumeの作成方法は、外部の永続ボリュームによって違うのですが、共通して言えるところもあるみたいなので、
そこを書いてみます。

* ラベル
    * PersistentVolumeをラベリングすることで、指定しやすくする
* 容量
    * Volumeで要求する容量。最も小さい容量からアサインされる。
* アクセスモード
    * ReadWriteOnce
        * 単一ノードからRead/Writeが可能
    * ReadOnlyMany
        * 複数ノードからReadが可能
    * ReadWriteMany
        * 複数ノードからRead/Writeが可能
* Reclaim Policy
    * Volumeを使い終わったあと、破棄するか再利用するかのポリシー
        * Delete
            * PersistentVolumeの実体を削除
        * Retain
            * PersistentVolumeの実体を残さず保持
            * 再度マウントされない
        * Recycle
            * PersistentVolumeのデータを削除し、再利用可能にする
            * 再度マウントされる
            * （廃止予定で、DynamicProvisioningを利用すること)
* StorageClass
    * 各プロバイザーが提供するストレージの型
        * 基本的に自動作成されている 

# PersistentVolumeClaim
実際に、PresistentVolumeを使うためには、PresistentVolumeClaimで要求を出す必要があります。
必要な項目は、下記です。

* ラベルセレクタ
    * ラベルでフィルタリング
* 容量
    * 求めている容量
* アクセスモード
    * PresistentVolumeのアクセスモードを参照
* StorageClass
    * PresistentVolumeのStorageClassを参照

要求を満たしたVolumeがRetainPolicyだった場合、Claimを削除した時点で「Released」になります。

# 最後に
今回は、書籍をそのまま書いた感じになりました。
実際に試したのは、[一足遅れて Kubernetes を学び始める - 06. workloads その2 -](./start_the_learning_kubernetes_06.md)です。
まあ、あんまり深くはハマらない方が良いのではと思いました。
次回は、[こちら](./start_the_learning_kubernetes_12.md)です。
