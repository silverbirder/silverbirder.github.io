<!-- 
title: 一足遅れて Kubernetes を学び始める - 06. workloads その2 -
date: 2019-05-05T00:00:00+09:00
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
[一足遅れて Kubernetes を学び始める - 05. workloads その1 -](BASE_URL/blog/contents/start_the_learning_kubernetes_05)では、Pod,ReplicaSet,Deploymentの３つを学習しました。今回はDaemonSet,StatefulSet(一部)を学びます。

# DaemonSet
ReplicaSetとほぼ同じ機能のリソース。
ReplicaSetとの違いは、各ノードに1つずつ配置するのがDaemonSet,バラバラなのがReplicaSet。
用途として、モニタリングツールやログ収集のPodに使うそうです。

さっそく、試してみます。

```yaml
# sample-ds.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: sample-ds
spec:
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
pi@raspi001:~/tmp $ k apply -f . --all --prune
daemonset.apps/sample-ds created
pi@raspi001:~/tmp $ k get all -o=wide
NAME                  READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
pod/sample-ds-wxzbw   1/1     Running   0          60s   10.244.2.24   raspi003   <none>           <none>
pod/sample-ds-xjjtp   1/1     Running   0          60s   10.244.1.37   raspi002   <none>           <none>

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d1h   <none>

NAME                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE   CONTAINERS        IMAGES       SELECTOR
daemonset.apps/sample-ds   2         2         2       2            2           <none>          60s   nginx-container   nginx:1.12   app=sample-app
```
ReplicaSetと大きく違いはありません。
また、各ノードに対してpodが作られていることがわかります。

Deploymentと似ているアップデート戦略があり、OnDeleteとRollingUpdate(デフォルト)があります。前者は、podを明示的に削除した(`k delete`)際に更新する戦略です。DaemonSetは、死活監視やログ収集に使うので、手動でのタイミングが効くOnDeleteが好まれます。後者は、Deploymentと同じ動きで、即時更新していく戦略です。

ReplicaSetと似ているようで、機能的にはDeploymentに近い感じですね。ReplicaSetはpodが削除されたら複製されますけど、アップデートされません。DaemonSetはpodが削除されたら複製するし、アップデートもされます。試してみます。

```yaml
# sample-ds.yaml
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: sample-ds
spec:
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

nginxのバージョンを1.12から1.13に変更しました。

```shell
pi@raspi001:~/tmp $ k apply -f . --all --prune
daemonset.apps/sample-ds configured
pi@raspi001:~/tmp $ k get all -o=wide
NAME                  READY   STATUS              RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
pod/sample-ds-sx4mv   0/1     ContainerCreating   0          5s    <none>        raspi003   <none>           <none>
pod/sample-ds-xjjtp   1/1     Running             0          12m   10.244.1.37   raspi002   <none>           <none>

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d2h   <none>

NAME                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE   CONTAINERS        IMAGES       SELECTOR
daemonset.apps/sample-ds   2         2         1       1            1           <none>          12m   nginx-container   nginx:1.13   app=sample-app
```

applyしてみると、一台ずつupdateされています(containerCreating)。Deploymentと違うのは、最大pod数が１のために、一時的にpodが機能しなくなるタイミングが生まれます(超過分の設定不可)。

```shell
pi@raspi001:~/tmp $ k delete pod sample-ds-sx4mv
pod "sample-ds-sx4mv" deleted
pi@raspi001:~/tmp $ k get all -o=wide
NAME                  READY   STATUS              RESTARTS   AGE     IP            NODE       NOMINATED NODE   READINESS GATES
pod/sample-ds-hgvtv   0/1     ContainerCreating   0          6s      <none>        raspi003   <none>           <none>
pod/sample-ds-k8cfx   1/1     Running             0          4m38s   10.244.1.38   raspi002   <none>           <none>

NAME                 TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE    SELECTOR
service/kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   6d2h   <none>

NAME                       DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE   CONTAINERS        IMAGES       SELECTOR
daemonset.apps/sample-ds   2         2         1       2            1           <none>          17m   nginx-container   nginx:1.13   app=sample-app
```

podを削除しても、セルフヒーリングで復活します。

# StatefulSet
ステートレスなpodではなく、DBのようなステートフルなpod向けのリソース。
podを削除しても、データを永続的に保存する仕組みが存在。
動作自体は、replicaSetと似ています。

さっそく、試してみます。

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
      - ReadWriteOnce
      resources:
        requests:
          storage: 1G
```

mountPathで指定したマウントしたいパスを、volumeClaimTemplatesでマウントしてくれます。 どこに？ 
Storageに関しては別で学習することにします。
ひとまず、applyします。

```shell
pi@raspi001:~/tmp $ k apply -f . --all --prune
daemonset.apps/sample-ds unchanged
statefulset.apps/sample-statefulset created
pi@raspi001:~/tmp $ k get pod
NAME                   READY   STATUS    RESTARTS   AGE
sample-ds-hgvtv        1/1     Running   0          54m
sample-ds-k8cfx        1/1     Running   0          58m
sample-statefulset-0   0/1     Pending   0          5m19s
pi@raspi001:~/tmp $ k describe pod sample-statefulset-0
...
Events:
  Type     Reason            Age                  From               Message
  ----     ------            ----                 ----               -------
  Warning  FailedScheduling  70s (x3 over 2m28s)  default-scheduler  pod has unbound immediate PersistentVolumeClaims (repeated 2 times)
```

おや、Pendingになってしまいました。 `pod has unbound immediate PersistentVolumeClaims`   

## PersistentVolumeとPersistentVolumeClaims
PersistentVolume(永続的ボリューム)は、名前の通りで、データを永続的に保存しておく場所のリソースです。
マネージドサービスを利用すると、デフォルトでPresistentVolumeが用意されているそうです。
私の環境は、マネージドサービスではなく、自作環境であるので、PresistentVolumeを用意する必要があります。

PersistentVolumeClaims(永続的ボリューム要求)は、これも名前の通りで、「PresistentVolumeを使わせて」というリソースです。
このリソースで、PresistentVolumeのnameを指定し、applyすることで、初めてマウントができます。
例えば、PodからPersistentVolumeClaimsの名前を指定してあげると、そのPodはClaimしたPersistentVolumeをマウントすることができます。
volumeClaimTemplatesというのは、「わざわざPersistentVolumeClaimsを定義しなくてもテンプレートに沿って書けばClaimsできるよ」というものです。

## で、何が問題だったの？

`pod has unbound immediate PersistentVolumeClaims`のとおりで、「PersistentVolumeの要求をしたけど、Volume割当できなかったよ」とのことです。

PersistentVolume(pv)があるのか確認してみます。

```shell
pi@raspi001:~/tmp $ k get pv
No resources found.
```

たしかにないです。PersistentVolumeを用意しないといけないのですが、どうしましょう。
解決手段として考えたのは3点です。

1. GCPやAWS,Azureのサービスを使う
1. LocalVolumeを使う
1. NFSを使う

※ [types-of-persistent-volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/#types-of-persistent-volumes)

1は、書いておいてなんですが、却下です。理由は、せっかくraspberryPiで構築したのでクラウドサービスを利用したくないからです。

2は、[Kubernetes: Local Volumeの検証](https://qiita.com/ysakashita/items/67a452e76260b1211920)の参考にして**試した**のですが、 記事にも書いてあるとおり「Local Volumeは他のPodから共有で利用することができない」ため、statefulsetが`replica:1`でなければ動きません。それはそれで動くので学習になり良いのですが、せっかくならreplicaの制限なしにしたいです(ReadWriteManyにしたい)。

3は、もう一台raspberryPiを用意して、それをNFSと見立ててPersistentVolumeにしてみる方法です。

3を進めようと思います。

## NFS導入
### サーバ設定
NFS用の新たなraspberryPiを用意します。設定手順は[こちら](BASE_URL/blog/contents/start_the_learning_kubernetes_03)を参考にしました。
その後の続きは下記です。

NFSのホスト名は`nfspi`とします。

```shell
~ $ slogin pi@nfspi.local
pi@nfspi:~ $ sudo apt-get install nfs-kernel-server
pi@nfspi:~ $ sudo vim /etc/exports
```

```/etc/exports
/home/data/ 192.168.3.0/255.255.255.0(rw,sync,no_subtree_check,fsid=0)
```

意味としては、「指定範囲のIPアドレスからのマウントを許可する」。オプションは、[こちら](https://linuxjm.osdn.jp/html/nfs-utils/man5/exports.5.html)を参照。

|host|ip|
|---|---|
|iMac|192.168.3.3|
|raspi001(master)|192.168.3.32|
|raspi002(worker)|192.168.3.33|
|raspi003(worker)|192.168.3.34|
|nfspi(NFS)|192.168.3.35|

```shell
pi@nfspi:~ $ sudo mkdir -p /home/data
pi@nfspi:~ $ sudo chmod 755 /home/data
pi@nfspi:~ $ sudo chown pi:pi /home/data
pi@nfspi:~ $ sudo /etc/init.d/nfs-kernel-server restart
pi@nfspi:~ $ service rpcbind status
pi@nfspi:~ $ systemctl status nfs-server.service
```

正しく設定されたか、iMacから確認してみます。

```shell
~ $ mkdir share
~ $ sudo mount_nfs -P nfspi.local:/home/data ./share/
~ $ sudo umount share
```

OK

### クライアント設定

各ノードに対して下記を実行します。

```shell
pi@raspi001:~ $ sudo apt-get install nfs-common
```

## nfs-client導入

raspberryPi環境では、真っ白な状態なので、一からPersistentVolumeを用意する必要があります。それにはVolumeとなるStorageの型を用意する必要もあるのですが、[Storage Classes](https://kubernetes.io/docs/concepts/storage/storage-classes/#provisioner)を見る限り、NFS用の型は標準で存在しません。そこで、[nfs-client](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)を使ってNFS用のStorageClassを作成します。

```shell
pi@raspi001:~ $ git clone https://github.com/kubernetes-incubator/external-storage.git && cd cd external-storage/nfs-client/
pi@raspi001:~/external-storage/nfs-client $ NS=$(kubectl config get-contexts|grep -e "^\*" |awk '{print $5}')
pi@raspi001:~/external-storage/nfs-client $ NAMESPACE=${NS:-default}
pi@raspi001:~/external-storage/nfs-client $ sed -i'' "s/namespace:.*/namespace: $NAMESPACE/g" ./deploy/rbac.yaml
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/rbac.yaml
```

rbac.yamlにあるnamespaceを現在動かしている環境のnamespaceに置換して、applyしています。

```shell
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/deployment-arm.yaml
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/class.yaml
```

deployment-arm.yamlでは、NFSサーバのIPアドレス(192.168.3.35)とマウントパス(/home/data)を設定しました。
class.yamlが、今回欲していたNFSのstorageClass(managed-nfs-storage)になります。

※ raspberryPiのイメージはRaspbianを使っているので、arm用のdeployment-arm.yamlを使います。[Wiki](https://ja.wikipedia.org/wiki/Raspbian)
これに随分とハマってしまいました... 

```shell
pi@raspi001:~/external-storage/nfs-client $ k apply -f deploy/test-claim.yaml -f deploy/test-pod.yaml
```

試しにマウント先にファイルが作成できているのかテストしています。確認します。

nfspiに移動

```shell
pi@nfspi:~ $ ls /home/data
```

あれば成功です。あれば、下記で片付けます。

```shell
pi@raspi001:~/external-storage/nfs-client $ k delete -f deploy/test-pod.yaml -f deploy/test-claim.yaml
```

## statefulsetをリトライ

以上で、StorageClassを用意できました。よって後は、PersistentVolume作って、PersistentVolumeClaim作って...となる予定でした。
しかし、[nfs-client](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)には、**dynamic provisioning**という機能が備わっており、PersistentVolumeを作らなくても、PersistentVolumeClaimするだけで良くなります。この件については、storageを学習する際に書きます。

raspi001に移動して、sample-statefulset.yamlをもう一度applyします。
(storageClassName: managed-nfs-storageを追加, ReadWriteOnce→ReadWriteManyに変更)

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

```shell
pi@raspi001:~/tmp $ k apply -f sample-statefulset.yaml
```

nfapiに移動して、あるか確認。

```shell
pi@nfspi:~ $ ls -la /home/data
total 20
drwxrwxrwx 5 pi     pi      4096 May  5 17:18 .
drwxr-xr-x 4 root   root    4096 May  4 15:50 ..
drwxrwxrwx 2 nobody nogroup 4096 May  5 17:17 default-www-sample-statefulset-0-pvc-5911505b-6f51-11e9-bb47-b827eb8ccd80
drwxrwxrwx 2 nobody nogroup 4096 May  5 17:18 default-www-sample-statefulset-1-pvc-5f2fd68e-6f51-11e9-bb47-b827eb8ccd80
drwxrwxrwx 2 nobody nogroup 4096 May  5 17:18 default-www-sample-statefulset-2-pvc-69bee568-6f51-11e9-bb47-b827eb8ccd80
```
ありました！ マウントできています！

# お片付け

`--prune`でも良いのですが、下記のほうが使いやすかったです。

```shell
pi@raspi001:~/tmp $　k delete -f sample-ds.yaml -f sample-statefulset.yaml
pi@raspi001:~/tmp $　k delete pvc www-sample-statefulset-{0,1,2}
```

※ `k get pv`と`k get pvc`を試して頂き、今回作ったリソースがありましたら削除お願いします。

# おわりに
StatefulSetを使える状態にするまでに記事が大きくなってしまいました。次回に詳しく学んでいこうと思います。笑
あと、[nfs-client](https://github.com/kubernetes-incubator/external-storage/tree/master/nfs-client)を見て思ったのが、kubernetesのパッケージマネージャであるhelmを導入した方が、遥かに便利だと思いつつ、手動設定しました。。。
次回は、[こちら](BASE_URL/blog/contents/start_the_learning_kubernetes_07)です。
