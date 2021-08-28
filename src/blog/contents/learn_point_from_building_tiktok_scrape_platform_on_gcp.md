<!-- 
title: TikTokスクレイプ基盤をGCP上で構築してハマったこと
date: 2021-08-28T16:52:00+09:00
draft: true
description: 
image: 
icon: 😞
-->

# まえがき

私的利用として構築。
スクレイプは、サーバへ負荷を与えないようスクレイプタイミングの間隔を空ける、直列で動かすなど配慮しましょう。

# 構築した図


# 書きたいこと

* workflow と pubsub

元々、バックエンドのコンテナは、Cloud Workflow で結合しようとしていた。
制限が強すぎて、Workflowsで制御できなかった。
結局、pubsubでつなげることになった。

* firestore と cloud sql

GCPでデータストレージで、無料枠があるfiresoteを当初使っていた。
ページcursorや、RDBの設計に慣れている頭で、ドキュメントのデータ構造設計がいまいちできず、
Cloud SQLに切り替え。
色々、見積もったけど、月数百円ぐらいになった。

* eventac

cloud storageにscrapeしたデータをおいて、そのイベントをeventacで後段処理につなげようとした。
が、イベントはcloud storageにものをおいた、または、特定のファイルのみのイベントしか出せず、
特定フォルダ以下のイベントのような伝搬ができなかった。

* cloud run と pubsub

cloud runで500系になると、pubsubが再実行となる。
割と何回もリクエストが再送されるので、保持時間を短くするか、
なにか対策する必要がある。(ずっと動いているとお金が掛かる)

* cloud scheduler ? (googleapis)

cloud schedulerでworkflowsをkickした。
workflowsは、バックエンドの一番頭をキックするだけ。

# 終わりに
