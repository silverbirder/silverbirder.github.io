<!-- 
title: 一足遅れて Kubernetes を学び始める - 15. セキュリティ -
date: 2019-06-07T00:00:00+09:00
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
[一足遅れて Kubernetes を学び始める - 14. スケジューリング -](BASE_URL/blog/contents/start_the_learning_kubernetes_14)では、AffinityなどでPodのスケジューリングについて学習しました。今回は、セキュリティについて学習します。

# サービスアカウント
Podで実行するためのプロセスを制御するために割り振られるアカウントのことをサービスアカウントというそうです。

```yaml
# sample-serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: sample-serviceaccount
  namespace: default
imagePullSecrets:
  - name: hogehoge
```

これをapplyしてみます。

```shell
pi@raspi001:~/tmp $ k apply -f sample-serviceaccount.yaml
pi@raspi001:~/tmp $ k get serviceaccounts sample-serviceaccount -o yaml
...
secrets:
- name: sample-serviceaccount-token-4xhgm
```

サービスアカウントが作成されました。また、imagePullSecretsの内容がsecretsに登録されました。(sample-serviceaccount-token-4xhgm)
imagePullSecretsはprivateなdockerレジストリに使います。

```shell
pi@raspi001:~/tmp $ k get secrets sample-serviceaccount-token-4xhgm -o yaml
apiVersion: v1
data:
  ca.crt: ...
  namespace: ZGVmYXVsdA==
  token: ...
kind: Secret
metadata:
  annotations:
    kubernetes.io/service-account.name: sample-serviceaccount
    kubernetes.io/service-account.uid: 4bd076da-8854-11e9-af26-b827eb8ccd80
  creationTimestamp: "2019-06-06T12:12:04Z"
  name: sample-serviceaccount-token-4xhgm
  namespace: default
  resourceVersion: "584634"
  selfLink: /api/v1/namespaces/default/secrets/sample-serviceaccount-token-4xhgm
  uid: 4bfbe8bb-8854-11e9-af26-b827eb8ccd80
type: kubernetes.io/service-account-token
```

認証に必要なtokenが登録されていますね。

# RBAC (Role Based Access Control)
RBACは、さきほど作成したサービスアカウントと、どういった操作を許可するのかを定めたRoleを紐付け(RoleBinding)して、権限管理をします。1つのRoleに対して複数のサービスアカウントをRoleBindingできます。

RBACは、２つのレベルがあり、１つはNamespaceレベルで、もう一つはクラスタレベルがあります。
設定範囲がクラスタの方が大きい感じです。(namespace横断して設定する場合はクラスタレベルにする)

* RoleとClusterRole
* RoleBindingとClusterRoleBinding

操作の種類ですが、どのDeploymentやDaemonSetのようなリソースに対して下記のものがあります。


| * | 全ての処理 |
|:--|:--|
| create | 作成 |
| delete | 削除 |
| get | 取得 |
| list | 一覧取得 |
| update | 更新 |
| patch | 一部変更 |
| watch | 変更の追従 |

※ [KubernetesのRBACについて](https://qiita.com/sheepland/items/67a5bb9b19d8686f389d)


今回は[Kubernetes道場 20日目 - Role / RoleBinding / ClusterRole / ClusterRoleBindingについて](https://cstoku.dev/posts/2018/k8sdojo-20/)を参考に進めます。

新しく作ったサービスアカウントでコンテキストを作成し、そのアカウントからPod情報を取得できるか試してみます。
そのためには、サービスアカウントの認証情報を通しておく必要があります。

※ RoleとClusterRoleに大きな違いはないため、Roleを試します。

```shell
pi@raspi001:~/tmp $ TOKEN=$(k get secret/sample-serviceaccount-token-jd279 -o json | jq -r .data.token)
pi@raspi001:~/tmp $ DECODE_TOKEN=$(echo -n $TOKEN | base64 -d)
pi@raspi001:~/tmp $ k config set-credentials sample-serviceaccount --token $DECODE_TOKEN
```

では、コンテキスト(sample-sa-context)を作成して、それを使用します。

```shell
pi@raspi001:~/tmp $ k config set-context sample-sa-context --user sample-serviceaccount --cluster kubernetes
pi@raspi001:~/tmp $ k config use-context sample-sa-context
pi@raspi001:~/tmp $ k config get-contexts
CURRENT   NAME                          CLUSTER      AUTHINFO                NAMESPACE
          kubernetes-admin@kubernetes   kubernetes   kubernetes-admin
*         sample-sa-context             kubernetes   sample-serviceaccount
```

新たに作成したサービスアカウントでPodの情報が取得できるか試してみます。

```shell
pi@raspi001:~/tmp $ k get po
Error from server (Forbidden): pods is forbidden: User "system:serviceaccount:default:sample-serviceaccount" cannot list resource "pods" in API group "" in the namespace "default"
```

Errorになりました。sample-serviceaccountは何もRoleをバインドしていないからですね。
では、RoleBindingしていきます。

元に戻ります。

```shell
pi@raspi001:~/tmp $ k config use-context kubernetes-admin@kubernetes
```

```yaml
# sample-role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: sample-role
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

```yaml
# sample-rolebinding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: sample-rolebinding
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: sample-role
subjects:
- kind: ServiceAccount
  name: sample-serviceaccount
  namespace: default
```

```shell
pi@raspi001:~/tmp $ k apply -f sample-role.yaml
pi@raspi001:~/tmp $ k apply -f sample-rolebinding.yaml
```

では、もう一度試してみます。

```shell
pi@raspi001:~/tmp $ k config use-context sample-sa-context
pi@raspi001:~/tmp $ k get po
NAME                                      READY   STATUS    RESTARTS   AGE
...
```

おお、取得できました！
もとに戻しておきます。

```shell
pi@raspi001:~/tmp $ k config use-context kubernetes-admin@kubernetes
```

# SecurityContext
コンテナに対してセキュリティ設定をすることができます。
例えば、Capabilitiesの追加・削除、実行するユーザ、グループの変更、ファイルのReadOnly化などができるそうです。

```yaml
# sample-capabilities.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-capabilities
spec:
  containers:
    - name: nginx-container
      image: nginx:1.12
      securityContext:
        capabilities:
          add: ["SYS_ADMIN"]
          drop: ["AUDIT_WRITE"]
```

applyし、中身を確認してみます。

```shell
pi@raspi001:~/tmp $ k apply -f sample-capabilities.yaml
pi@raspi001:~/tmp $ k exec -it sample-capabilities /bin/bash
root@sample-capabilities:/# apt update && apt install libcap2-bin
root@sample-capabilities:/# capsh --print | grep Current
Current: = cap_chown,cap_dac_override,cap_fowner,cap_fsetid,cap_kill,cap_setgid,cap_setuid,cap_setpcap,cap_net_bind_service,cap_net_raw,cap_sys_chroot,cap_sys_admin,cap_mknod,cap_setfcap+eip
root@sample-capabilities:/# exit
```

cap_sys_adminが増えてますね。audit_writeは見つかりません。
そもそも、どんな種類があるのか分からなかったので、[こちら](https://qiita.com/muddydixon/items/d2982ab0846002bf3ea8)を参考にしました。

# PodSecurityContext
Pod(全てのコンテナ)に対してセキュリティ設定をすることができます。
例えば、実行するユーザやグループの制御、root実行を拒否したり、カーネルパラメータを上書きすることもできます。

```yaml
# sample-runuser.yaml
apiVersion: v1
kind: Pod
metadata:
  name: sample-runuser
spec:
  securityContext:
    runAsUser: 99
    # runAsGroup: 99
    supplementalGroups:
    - 1001
    - 1002
  containers:
    - name: centos-container
      image: centos:7
      command: ["/bin/sleep", "3600"]
```

では、applyしています。

```shell
pi@raspi001:~/tmp $ k apply -f sample-runuser.yaml
pi@raspi001:~/tmp $ k exec -it sample-runuser -- id
uid=99(nobody) gid=99(nobody) groups=99(nobody),1001,1002
pi@raspi001:~/tmp $ k exec -it sample-runuser -- ps aux | grep sleep
nobody       1  0.0  0.0   2032   372 ?        Ss   14:02   0:00 /bin/sleep 3600
```

実行したユーザがnobody(99)に変更されていますね。また、supplementalGroupsで、プライマリGIDに指定のGIDを追加することができます。

# そのほか
PodSecurityPolicyや、NetworkPolicy、そして認証、認可のAdmissionControlというものもあるそうです。

# お片付け

```shell
pi@raspi001:~/tmp $ k delete -f sample-serviceaccount.yaml -f sample-role.yaml -f sample-rolebinding.yaml -f sample-capabilities.yaml -f sample-runuser.yaml
pi@raspi001:~/tmp $ k config delete-context sample-sa-context
```

# 最後に
主にRBACについて学習しました。
複数人で開発する際は、コンテキストを分けて開発を進めるのが良いみたいですね。
今回で取り組んだように、誰がどの権限を持っているかをRBACで管理できるので、
必要以上の権限を与えられて事故るようなことは少なくなりますね。
（といっても、まだ個人でしか使ってないので分かりませんが...）
次回は、最後で[こちら](BASE_URL/blog/contents/start_the_learning_kubernetes_16)です。
