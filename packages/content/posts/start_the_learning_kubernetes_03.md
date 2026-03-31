---
title: '一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -'
publishedAt: '2019-04-28'
summary: '前回 一足遅れて Kubernetes を学び始める - 02. Docker For Mac -では、MacでKubernetesを軽く動かしてみました。DockerForMacでは、NodeがMasterのみだったため、Kubernetesを学習するには、ものたりない感がありました。そこで、RaspberryPiを使っておうちKubernetesを構築することになりました。'
tags: ["クラウドインフラ"]
keywords: ['Kubernetes', 'Raspberry Pi']
---

## ストーリー

1. [一足遅れて Kubernetes を学び始める - 01. 環境選択編 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_01/)
1. [一足遅れて Kubernetes を学び始める - 02. Docker For Mac -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_02/)
1. [一足遅れて Kubernetes を学び始める - 03. Raspberry Pi -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_03/)
1. [一足遅れて Kubernetes を学び始める - 04. kubectl -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_04/)
1. [一足遅れて Kubernetes を学び始める - 05. workloads その 1 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_05/)
1. [一足遅れて Kubernetes を学び始める - 06. workloads その 2 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_06/)
1. [一足遅れて Kubernetes を学び始める - 07. workloads その 3 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_07/)
1. [一足遅れて Kubernetes を学び始める - 08. discovery&LB その 1 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_08/)
1. [一足遅れて Kubernetes を学び始める - 09. discovery&LB その 2 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_09/)
1. [一足遅れて Kubernetes を学び始める - 10. config&storage その 1 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_10/)
1. [一足遅れて Kubernetes を学び始める - 11. config&storage その 2 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_11/)
1. [一足遅れて Kubernetes を学び始める - 12. リソース制限 -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_12/)
1. [一足遅れて Kubernetes を学び始める - 13. ヘルスチェックとコンテナライフサイクル -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_13/)
1. [一足遅れて Kubernetes を学び始める - 14. スケジューリング -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_14/)
1. [一足遅れて Kubernetes を学び始める - 15. セキュリティ -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_15/)
1. [一足遅れて Kubernetes を学び始める - 16. コンポーネント -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_16/)

## 前回

[一足遅れて Kubernetes を学び始める - 02. Docker For Mac -](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_02/)では、Mac で Kubernetes を軽く動かしてみました。DockerForMac では、Node が Master のみだったため、Kubernetes を学習するには、ものたりない感がありました。そこで、RaspberryPi を使っておうち Kubernetes を構築することになりました。

参考サイト

- [ラズパイで Kubernetes クラスタを構築する](https://qiita.com/sotoiwa/items/e350579d4c81c4a65260)
- [おうち Kubernetes 構築でハマったところ - ニッチ編 -](https://qiita.com/shnmorimoto/items/7ce3c3ef8e962f8e5c59)
- [おうち kubernetes でデータを永続化する](https://qiita.com/inajob/items/7b61904586d0816dfe5f)
- [kubernetes のラズパイ包みが美味しそうだったので、kubeadm を使って作ってみた](https://qiita.com/shirot61/items/2321b70cd9c93f8f5cf0)
- [Raspberry PI と kubeadm で自宅 Kubernetes クラスタを構築する](https://qiita.com/hatotaka/items/48a88ecb190e1f5e03c3)
- [3 日間クッキング【Kubernetes のラズペリーパイ包み “サイバーエージェント風”】](https://developers.cyberagent.co.jp/blog/archives/14721/)
- [33 時間クッキング【Kubernetes のラズベリーパイ包み〜ウエパ風〜】](https://engineers.weddingpark.co.jp/?p=1993)

## レシピ

| 商品名                                                                                                     | 個数 | 用途                                   |
| ---------------------------------------------------------------------------------------------------------- | ---- | -------------------------------------- |
| [Raspberry Pi 3 Model B](https://www.amazon.co.jp/gp/product/B01NAHBSUD/)                                  | 3 つ | MasterNode1 台 / WorkerNode2 台     |
| [microSDHC カード 16GB](https://www.amazon.co.jp/gp/product/B079H6PDCK/)                                   | 3 枚 | RaspberryPi の image 書き込み先        |
| [LAN ケーブル](https://www.amazon.co.jp/gp/product/B00JEUSAR2)                                             | 1 本 | RaspberryPi とネットワーク接続         |
| [USB 充電器](https://www.amazon.co.jp/gp/product/B01AVSNEFS/)                                              | 1 台 | RaspberryPi の電源                     |
| [Micro USB ケーブル](https://www.amazon.co.jp/gp/product/B07K3WGLV7/)                                      | 4 本 | RaspberryPi と USB 充電器をつなげる    |
| [for Raspberry Pi ケース 専用 4 段](https://www.amazon.co.jp/gp/product/B01JONA3U0/)  /  ヒートシンク付 | 1 台 | 4 段 / (3:RaspberryPi,1:USB 充電器) |

RaspberryPi は世代 3 の ModelB なら WiFi 接続できるので、自宅の WiFi につなげることにしました。自宅では SoftbankAir を使っています。
（ただし、初回のみ LAN ケーブルでネットワーク接続します)

また、私の環境は下記のとおりです。

```text
iMac (21.5-inch, 2017)
```

## 構築（物理）

[Raspberry Pi でおうち Kubernetes 構築【物理編】](https://qiita.com/go_vargo/items/d1271ab60f2bba375dcc)で十分な情報があります。こちらを参考にして組み立てします。
できたものがこちらです。

![kubernetes_raspberrypi.png](https://res.cloudinary.com/silverbirder/image/upload/v1639816691/silver-birder.github.io/blog/kubernetes_raspberrypi.png?ar=500%3A514)

WiFi を使うために、LAN ケーブルや WiFi 親機などがなくなり、スッキリしました。
電源を確保できるところであれば、家の中なら、どこでも持ち運びできます。 ✨

## 構築（論理）

[Raspbian Stretch Lite](https://www.raspberrypi.org/downloads/raspbian/)をダウンロードしておきます。

Step の 1 から 3 までの手順を **RaspberryPi 一台ずつ** 、下記の手続きを踏んでいきます。

## 1. 初期設定

microSD カードを Mac につなげた後に、下記を実施します。

```shell
diskutil list
sudo diskutil umount /dev/disk3s1
sudo dd bs=1m if=2019-04-08-raspbian-stretch-lite.img of=/dev/rdisk3 conv=sync
cd /Volumes/boot
touch ssh
vim cmdline.txt
## 下記を末尾に追記
cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1
```

イメージを書き込み際、 **r** をつける (rdisk3)と、高速になるそうです。

## 2. RaspberryPi に接続

MicroSD カードを RaspbeeryPi に挿入し、電源をつけたら、下記を実施します。
LAN ケーブルは、自宅の WiFi に直接つなげます。(私の場合は SoftBankAir)

hostname は、お好みの名前にします。（私は、`Master:raspi001, Worker:raspi002,raspi003`としました。)

```shell
slogin pi@raspberrypi.local
## 初回password「raspberry」
pi@raspbeerypi:~ $ sudo passwd pi
pi@raspbeerypi:~ $ sudo apt-get update && sudo apt-get -y upgrade && sudo apt-get install -y vim
pi@raspbeerypi:~ $ sudo vim /etc/hostname
pi@raspbeerypi:~ $ sudo sh -c 'wpa_passphrase <SSID> <PASSWORD> >> /etc/wpa_supplicant/wpa_supplicant.conf'
pi@raspbeerypi:~ $ sudo shutdown -r now
```

※ 2 回目以降は、`ssh-keygen -R raspberrypi.local`をしましょう。

電源を落として、LAN ケーブルを外します。再度電源をつけて数分待ってから、下記を実施します。

```shell
slogin pi@raspi001.local
pi@raspi001:~ $
```

接続できたら成功です。

## 3. 各種インストール

おまじないをします。

```shell
pi@raspi001:~ $ sudo dphys-swapfile swapoff && sudo dphys-swapfile uninstall && sudo update-rc.d dphys-swapfile remove
```

Docker をインストールします。

```shell
pi@raspi001:~ $ sudo apt-get install apt-transport-https ca-certificates curl software-properties-common -y
pi@raspi001:~ $ curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -
pi@raspi001:~ $ echo "deb [arch=armhf] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
     $(lsb_release -cs) stable" | \
    sudo tee /etc/apt/sources.list.d/docker.list
pi@raspi001:~ $ sudo apt-get update -y
pi@raspi001:~ $ sudo apt-get install docker-ce -y
```

Kubernetes をインストールします。

```shell
pi@raspi001:~ $ curl -fsSL https://packages.cloud.google.com/apt/doc/apt-key.gpg|sudo apt-key add -
pi@raspi001:~ $ echo "deb http://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee /etc/apt/sources.list.d/kube.list
pi@raspi001:~ $ sudo apt-get update -y && sudo apt-get install kubelet kubeadm kubectl -y
```

## 4. MasterNode の設定

MasterNode にする RaspberryPi に対して下記を実施します。

```shell
pi@raspi001:~ $ sudo kubeadm init --pod-network-cidr=10.244.0.0/16
pi@raspi001:~ $ mkdir -p $HOME/.kube
pi@raspi001:~ $ sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
pi@raspi001:~ $ sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

出力される join メッセージをメモしておき、WorkerNode の構築時に使います。

[こちら](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/#pod-network)に従い下記を実行します。

```shell
pi@raspi001:~ $ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/a70459be0084506e4ec919aa1c114638878db11b/Documentation/kube-flannel.yml
pi@raspi001:~ $ kubectl get pods --all-namespaces
NAMESPACE     NAME                               READY   STATUS              RESTARTS   AGE
kube-system   coredns-fb8b8dccf-lglcr            0/1     ContainerCreating   0          4d16h
kube-system   coredns-fb8b8dccf-snt7d            0/1     ContainerCreating   0          4d16h
...
```

## 5. WorkerNode の設定

MasterNode から出力された join コマンドを実施します。

```shell
pi@raspi002 $ kubeadm join 192.168.3.32:6443 --token X \
    --discovery-token-ca-cert-hash sha256:X
```

## 6. MasterNode から確認

Node が増えているか確認します。

```shell
pi@raspi001:~ $ kubectl get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   65m   v1.14.1
raspi002   Ready    <none>   18m   v1.14.1
raspi002   Ready    <none>   18m   v1.14.1
pi@raspi001:~ $ kubectl label node raspi002 node-role.kubernetes.io/worker=worker
pi@raspi001:~ $ kubectl label node raspi003 node-role.kubernetes.io/worker=worker
pi@raspi001:~ $ kubectl get nodes
NAME       STATUS   ROLES    AGE   VERSION
raspi001   Ready    master   65m   v1.14.1
raspi002   Ready    worker   37m   v1.14.1
raspi003   Ready    worker   37m   v1.14.1
```

## 7. ブラウザから確認

試しにデプロイ → サービス公開 → ブラウザ確認までを、さっと通してみます。

```shell
pi@raspi001:~ $ kubectl run nginx --image=nginx --replicas=1 --port=80
pi@raspi001:~ $ kubectl expose deployment nginx --port 80 --target-port 80 --type NodePort
pi@raspi001:~ $ kubectl get svc nginx
NAME    TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
nginx   NodePort   10.99.227.194   <none>        80:30783/TCP   17m
```

サービス公開までしたので、アクセスしてみます。

内部

```shell
pi@raspi001:~ $ curl http://10.99.227.194:80
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
<style>
    body {
        width: 35em;
        margin: 0 auto;
        font-family: Tahoma, Verdana, Arial, sans-serif;
    }
</style>
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>

<p>For online documentation and support please refer to
<a href="http://nginx.org/">nginx.org</a>.<br/>
Commercial support is available at
<a href="http://nginx.com/">nginx.com</a>.</p>

<p><em>Thank you for using nginx.</em></p>
</body>
```

外部

```shell
pi@raspi001:~ $ ifconfig
...
wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.3.32  netmask 255.255.255.0  broadcast 192.168.3.255
```

`http://192.168.3.32:30783`にアクセス

![nginx](https://res.cloudinary.com/silverbirder/image/upload/v1639816718/silver-birder.github.io/blog/kubernetes_nginx.png?ar=554%3A210)

OK!

## お片付け

```shell
pi@raspi001:~ $ kubectl delete deployments nginx
deployment.extensions "nginx" deleted
pi@raspi001:~ $ kubectl  delete service nginx
service "nginx" deleted
```

## 完成

すんなりと構築することができました。これは先人たちの記事がたくさんあるので、
サクサクと進めることができました。これで、Kubernetes を使いまくります!! 💪💪
次回は[こちら](https://silverbirder.github.io/blog/contents/start_the_learning_kubernetes_04/)です。
