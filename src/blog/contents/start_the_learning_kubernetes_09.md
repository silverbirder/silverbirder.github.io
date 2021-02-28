<!-- 
title: 一足遅れて Kubernetes を学び始める - 09. discovery&LB その2 -
date: 2019-05-15T00:00:00+09:00
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
[一足遅れて Kubernetes を学び始める - 08. discovery&LB その1 -](BASE_URL/blog/contents/start_the_learning_kubernetes_08)でServiceについての概要を学びました。今回は下記を一気に学びます。

* ExternalIP
* NodePort
* LocadBalancer
* Headless
* ExternalName
* None-Selector
* Ingress

※ ClusterIPを飛ばしたのは、前回使った内容で十分だと思ったため。

# ExternalIP
こちらは、外向けのIPアドレスを割り振ります。

```yaml
# sample-externalip.yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-externalip
spec:
  type: ClusterIP
  externalIPs:
    - 192.168.3.33
  ports:
    - name: "http-port"
      protocol: "TCP"
      port: 8080
      targetPort: 80
  selector:
    app: sample-app
```

私のNode情報では、下記の状態です。

| host | ip |
|:--|:--|
| raspi001(master) | 192.168.3.32 |
| raspi002(worker) | 192.168.3.33 |
| raspi003(worker) | 192.168.3.34 |
| nfspi(NFS) | 192.168.3.35 |

ここで、spec. externalIPsに、公開したいIPアドレスを上記NodeのIPアドレスより設定します。
今回は、１つだけ(raspi002:193.168.3.33)にしました。

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

前回同様のファイルを用意します。

```shell
pi@raspi001:~/tmp $ k apply -f sample-deployment.yaml -f sample-externalip.yaml
pi@raspi001:~/tmp $ k get pod -o=wide
NAME                                      READY   STATUS    RESTARTS   AGE   IP            NODE       NOMINATED NODE   READINESS GATES
sample-deployment-9dc487867-7n2sz         2/2     Running   0          16m   10.244.1.73   raspi002   <none>           <none>
sample-deployment-9dc487867-nnnqm         2/2     Running   0          16m   10.244.1.74   raspi002   <none>           <none>
sample-deployment-9dc487867-qfdhw         2/2     Running   0          16m   10.244.2.68   raspi003   <none>           <none>
pi@raspi001:~/tmp $ k get service
NAME                TYPE        CLUSTER-IP       EXTERNAL-IP    PORT(S)    AGE
sample-externalip   ClusterIP   10.104.170.220   192.168.3.33   8080/TCP   15m
```

externalIPが設定されました。

```shell
pi@raspi001:~/tmp $ for PODNAME in `k get pods -l app=sample-app -o jsonpath='{.items[*].metadata.name}'`; do k exec -it ${PODNAME} -- cp /etc/hostname /usr/share/nginx/html/index.html; done
```

どこのpodかどうかわかりやすいくするため、index.htmlを書き換えます。
では、ブラウザからアクセスしてみます。

![スクリーンショット 2019-05-07 23.07.01.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/143813/65d909e2-dc53-9342-4f68-d8ba934a05f2.png)
![スクリーンショット 2019-05-07 23.07.22.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/143813/da6cba61-8bd8-a094-0c38-bb332eb3002b.png)

raspi002を公開したので、そのNodeに存在するPodがランダムに出力されている、つまりロードバランサが動作していることがわかります。

# NodePort
ExternalIPのような特定Nodeを公開するのと違って、NodePortは、**全て**のNodeを公開します。

試してみます。

```yaml
# sample-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-nodeport
spec:
  type: NodePort
  ports:
    - name: "http-port"
      protocol: "TCP"
      port: 8080
      targetPort: 80
      nodePort: 30080
  selector:
    app: sample-app
```

```shell
pi@raspi001:~/tmp $ k delete -f sample-externalip.yaml #しなくても良い
pi@raspi001:~/tmp $ k apply -f sample-nodeport.yaml
pi@raspi001:~/tmp $ k get service
NAME              TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
sample-nodeport   NodePort    10.96.173.243   <none>        8080:30080/TCP   66s
```

内向けには、10.96.173.243:8080でアクセスでき、外向けには、各NodeのIPアドレス:30080にアクセスします。
どちらも正常にアクセスできています。もちろん、アクセス先のPodは、ロードバランシングされます。ロードバランシングさせるのが嫌な場合にも対応できます。アクセスされたNodeの先は、そのNode内にあるPodのみにアクセスさせる「spec.externalTrafficPolicy：Local」に設定すれば大丈夫です。
注意点として、nodePortは、30000~32767の範囲と決まっています。

# LoadBalancer
ExternalIPやNodePortの場合、ロードバランシングするのはクラスタ内のNodeになります。そのため、アクセスが集中することで、Node単一障害が発生しやすいそうです。そこで、LoadBalancerを使うことで、**クラスタ外**にロードバランサを作成します。

ただ、クラスタ外にロードバランサを作成する際は、プラットフォームによって対応しているか確認が必要です。私のようなraspberryPi環境では、もちろんそういった機能がないため、準備する必要があります。

master(raspi001)に移動

```shell
pi@raspi001:~/tmp $ k apply -f https://raw.githubusercontent.com/google/metallb/v0.7.3/manifests/metallb.yaml
```

metallbと呼ばれるロードバランサを適用します。

https://metallb.universe.tf
> MetalLB is a load-balancer implementation for bare metal Kubernetes clusters, using standard routing protocols.

```yaml
# l2-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: metallb-system
  name: config
data:
 config: |
  address-pools:
  - name: default
    protocol: layer2
    addresses:
    - 192.168.3.100-192.168.3.200
```

```shell
pi@raspi001:~/tmp $ k apply -f l2-config.yaml
```

これで、raspberryPi環境でもloadBalancerが使えます。さっそくつかってみましょう。

```yaml
# sample-lb.yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-lb
spec:
  type: LoadBalancer
  loadBalancerIP: 192.168.3.100
  ports:
    - name: "http-port"
      protocol: "TCP"
      port: 8080
      targetPort: 80
      nodePort: 30082
  selector:
    app: sample-app
  loadBalancerSourceRanges:
  - 192.168.3.0/8
```


```shell
pi@raspi001:~/tmp $ k apply -f sample-deployment.yaml
pi@raspi001:~/tmp $ k apply -f sample-lb.yaml
pi@raspi001:~/tmp $ k get services
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
kubernetes   ClusterIP      10.96.0.1       <none>          443/TCP          16d
sample-lb    LoadBalancer   10.106.253.65   192.168.3.100   8080:30082/TCP   8m4s
```

お、192.168.3.100:8080にアクセス可能みたいです。

iMacに移動

```shell
~ $ curl -s http://192.168.3.100:8080
<!DOCTYPE html>
...
```

OK

# Headless

今までのロードバランスと違い、公開するIPアドレスは提供されません。
DNS ラウンドロビンによる転送先のPodのIPアドレスを取得できます。
つまり、Headlessのサービスへ問い合わせすると、spec.selectorで登録したPodのIPアドレスが手に入ります。
PodのIPアドレスがほしいときには便利です。（Envoyとか?）

```yaml
# sample-statefulset-headless.yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: sample-statefulset-headless
spec:
  serviceName: sample-headless
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
```

```yaml
# sample-headless.yaml
apiVersion: v1
kind: Service
metadata:
  name: sample-headless
spec:
  type: ClusterIP
  clusterIP: None
  ports:
    - name: "http-port"
      protocol: "TCP"
      port: 80
      targetPort: 80
  selector:
    app: sample-app
```

spec.typeがClusterIPであり、spec.clusterIPがNone、そして、metadata.nameがstatefulsetのspec.serviceNameと同じことで、Headless Serviceと呼ぶそうです。

```shell
pi@raspi001:~/tmp $ k apply -f sample-statefulset-headless.yaml
pi@raspi001:~/tmp $ k run --image=centos:7 --restart=Never --rm -i testpod  -- dig sample-headless.default.svc.cluster.local
...
;; ANSWER SECTION:
sample-headless.default.svc.cluster.local. 5 IN	A 10.244.1.75
sample-headless.default.svc.cluster.local. 5 IN	A 10.244.2.72
sample-headless.default.svc.cluster.local. 5 IN	A 10.244.2.73
sample-headless.default.svc.cluster.local. 5 IN	A 10.244.1.78
sample-headless.default.svc.cluster.local. 5 IN	A 10.244.1.76
sample-headless.default.svc.cluster.local. 5 IN	A 10.244.2.70
```

たしかに、headlessのサービスに問い合わせると、IPアドレスが返ってきました。

# ExternalName
外部のドメイン宛のCNAMEを返すサービスです。
例えば、Podから外部の[example.com](http://example.com/)へアクセスする場合、下記のように設定します。

```yaml
# sample-externalname.yaml
kind: Service
apiVersion: v1
metadata:
  name: sample-externalname
  namespace: default
spec:
  type: ExternalName
  externalName: example.com
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-externalname.yaml
pi@raspi001:~/tmp $ k run --image=centos:7 --restart=Never --rm -i testpod  -- dig sample-externalname.default.svc.cluster.local
...
;; ANSWER SECTION:
sample-externalname.default.svc.cluster.local. 5 IN CNAME example.com.
example.com.		5	IN	A	93.184.216.34
```

確かに、`sample-externalname.default.svc.cluster.local`と問い合わせすることで、外部の[example.com](http://example.com/)へのCNAMEを取得できます。また、外部のサイトを切り替えたいときは、問い合わせ先は**変わらず**に、sample-externalname.yamlのspec.externalNameを変更するだけで済みます。これは切り替えが楽ですね。

# None-Selector
外部のサービスに対してロードバランシングします。

```yaml
# sample-none-selector.yaml
---
kind: Service
apiVersion: v1
metadata:
  name: sample-none-selector
spec:
  type: ClusterIP
  ports:
  - protocol: TCP
    port: 8080
    targetPort: 80
---
kind: Endpoints
apiVersion: v1
metadata:
  name: sample-none-selector
subsets:
  - addresses:
    - ip: 172.217.31.164
    - ip: 172.217.31.165
    ports:
      - protocol: TCP
        port: 80
```

172.217.31.164と172.217.31.165は、どちらも[www.google.com](https://www.google.com/)を指します。


```shell
pi@raspi001:~/tmp $ k apply -f sample-none-selector.yaml
pi@raspi001:~/tmp $ k get service
NAME                   TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)          AGE
sample-none-selector   ClusterIP      10.102.225.99   <none>          8080/TCP         88s
pi@raspi001:~/tmp $ k describe svc sample-none-selector
Name:              sample-none-selector
...
Type:              ClusterIP
IP:                10.102.225.99
Port:              <unset>  8080/TCP
TargetPort:        80/TCP
Endpoints:         172.217.31.164:80,172.217.31.165:80
...
```

ClusterIPなので、内部で公開されていますね。

```shell
pi@raspi001:~/tmp $ curl 10.102.225.99:8080
<HTML><HEAD><meta http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>301 Moved</TITLE></HEAD><BODY>
<H1>301 Moved</H1>
The document has moved
<A HREF="http://www.google.com:8080/">here</A>.
</BODY></HTML>
...
```

少し結果が不自然だったのですが、確かにgoogle.comへアクセスしました。
外部サービスへのロードバランシングも容易に実現できます。

※ [172.217.31.164](http://172.217.31.164)へアクセスすると、リダイレクトがかかります。`Status Code:  301`

# Ingress
今までのロードバランサは、l4レイヤーのロードバランサです。(IPアドレスとポート番号による負荷分散)
Ingressでは、l7レイヤーのロードバランサを提供します。(URLやHTTPヘッダーで負荷分散が可能)

Ingressを置く場所は、クラスタ内、外の２つあります。
クラスタ外の場合は、使うプラットフォームによります。
クラスタ内の場合は、Nginx Ingressを使うことができます。

raspberryPi環境では、Ingress-Nginx-Controllerを使うことで、Ingressを使えるそうです。
[NGINX Ingress Controller - Installation Guide](https://kubernetes.github.io/ingress-nginx/deploy/#bare-metal)
を参考にして進めたのですが、arm64環境では動きませんでした。

そこで、下記のyamlを発見し、試してみると動作します。ぜひ、お試しあれ。
[hectcastro/mandatory.yaml](https://gist.github.com/hectcastro/097ba8e9759689b6b29dd164cd116eeb)


※ namespaceを削除できない場合は、[こちら](https://www.ibm.com/support/knowledgecenter/en/SSBS6K_3.1.1/troubleshoot/ns_terminating.html)を参考下さい。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-externalip.yaml -f sample-deployment.yaml -f sample-nodeport.yaml -f sample-lb.yaml -f sample-statefulset-headless.yaml -f sample-headless.yaml -f sample-none-selector.yaml -f sample-externalname.yaml
```

# 最後に
Serviceについて学びました。
様々な用途に応じて、エンドポイントを公開する手段を学びました。
手を動かして確認してみると、理解が深まりました。
本番でk8sを使った経験はありませんが、今後必要に迫られた際に、こちらの記事を思い返そうと思います。

次回は[こちら](BASE_URL/blog/contents/start_the_learning_kubernetes_10)です。
