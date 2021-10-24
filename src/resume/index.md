<!-- 
title: resume
date: 2021-07-05T20:18:58+09:00
draft: false
description: This is the resume page of silverbirder's portfolio.
image: 
icon: 🧑‍💻
-->
# 🧑‍💻 職務経歴書

### 🏢 職歴

|期間|会社|担当業務内容|環境|役割|規模|テクニカルスキル<br>技術スタック|実績|所感|
|--|--|--|--|--|--|--|--|--|
|2016/04 ~ 2016/07|関西SIer会社|ノーコード Webアプリケーション 運用・保守<br>(OJT)|AWS|Webアプリケーション フロントエンドエンジニア<br>(開発, 検証)|10名|EC2, jQuery, SVN|機能拡張したプログラム|新卒時の初業務|
|2016/08 ~ 2017/04|関西SIer会社|レンタルサーバ向け 業務Webアプリケーション 新規開発|AWS|Webアプリケーションエンジニア<br>(画面設計, 開発, 検証, 納品)|20名|EC2, jQuery, CakePHP, MySQL, Apache, SVN|納品|炎上プロジェクト. プロジェクト初期メンバー. 15名のテスター管理を兼務|
|2017/05 ~ 2017/07|関西SIer会社|子供向け学習教材 Webアプリケーション 新規開発|AWS|Webアプリケーション フロントエンドエンジニア<br>(開発, 検証, 展開)|20名|EC2, Vue.js, GitBucket, Redmine|学習教材コンポーネント リリース|初めてのUIコンポーネント開発|
|2017/08 ~ 2018/07|関西SIer会社|(関西自社サービス会社 客先常駐) EC Webアプリケーション 運用・保守|AWS| Webアプリケーションエンジニア<br>(設計, 開発, 検証, 展開)|60名|EC2, S3, Aurora, Django, Flask, jQuery, Apache, Nginx, Varnish, Fluentd, Solr, Jenkins, PyUnit, Robot Framework, Swagger, Docker, Bitbucket, Sentry, Datadog, JIRA, Google App Scripts|機能拡張 リリース|技術スタックの大変化|
|2018/08 ~ 2018/12|関西自社サービス会社|EC Webアプリケーション 運用・保守|AWS|Webアプリケーションエンジニア<br>(設計, 開発, 検証, 展開)|60名|同上|機能拡張 リリース, トラブル対応|客先へ転職|
|2018/08 ~ 2020/04|関西自社サービス会社|テストコード拡充|AWS|QAエンジニア|10名|PyUnit, Robot Framework, Jenkins|テスト文化が根付く|テストの魅力に気づく|
|2019/01 ~ 2020/04|関西自社サービス会社|(Python2 EOL対応に伴う)Webアプリケーション リアーキテクティング|AWS|Webアプリケーションエンジニア<br>(要件定義, リリース戦略, 設計, PoC, 開発, 検証, 展開)|20名|Atomic Design, Clean Arhcitecture, 脱独自FW, ストラングラーパターンリリース, PoC, ログベーステスト, TDD, アウトソーシング|担当ページのPython3完了|大規模なアプリケーション刷新に初チャレンジ|
|2019/10 ~ 2020/04|関西自社サービス会社|X年先を見据えたフロントエンド モダナイゼーション|AWS, GCP|Webアプリケーション フロントエンドエンジニア<br>(PoC)|5名|Nestjs検証, Micro Frontends検討, 方式設計議論|Nestjsの検証. チーム移動で離脱|大規模Webアプリケーションフロントエンドにおけるアジリティ向上を目指す|
|2020/05 ~ 2020/08|関西自社サービス会社|ドメインロジックの集約と提供<br>(バッチ&API)|GCP|データエンジニア, インフラエンジニア<br>(開発, 検証, 展開)|5名|Kotlin, Docker, Cloud Dataflow, Cloud Scheduler, Cloud Build, PubSub, GCE, Terraform, BigQuery.|仕組み化のPoC完了. バッチリリース|フロントエンドが活用するデータへの理解|
|2020/09 ~|関西自社サービス会社|X年先を見据えた 基盤開発 バッチ群担当|GCP|データエンジニア, インフラエンジニア<br>(要件定義, 設計, リリース戦略, PoC, 開発, 検証, 展開, 運用)|30名|Digdag, Cloud Dataflow, BigQuery, Cloud Build, Cloud Monitoring, Logging, Cloud Scheduler, PubSub, GCE, Docker, Ansible, Terraform, Fluentd|[技術選定](https://tech-blog.monotaro.com/entry/2021/06/03/090000), 一部データ提供済み|データのスケーラビリティに対応したリアルタイムデータ構築に挑戦|

### 🏠 テクニカルスキル

<amp-list width="auto"
              height="1500"
              layout="fixed-height"
              class="resume-tech-items"
              src="BASE_URL/resume/index.json">
        <template type="amp-mustache">
            {{#results}}
                <div class="col-sm-12 col-md-3">
                    <div class="card">
                        {{#image}}
                            {{#width}}
                                <amp-img class="card-img-top" src="{{image}}" width="{{width}}" height="{{height}}" layout="responsive"></amp-img>
                            {{/width}}
                            {{^width}}
                                <amp-img class="card-img-top" src="{{image}}" width="120" height="60" layout="responsive"></amp-img>
                            {{/width}}
                        {{/image}}
                        {{#icon}}
                        <i class="{{icon}}"></i>
                        {{/icon}}
                        <div class="card-body">
                            <p class="lead"><strong>{{name}}</strong></p>
                            <p><span class="badge badge-success">経験内容</span><br/><span>{{results}}</span></p>
                            <p><span class="badge badge-primary">経験年数</span><br/><span>{{actual_years}}</span></p>
                            <p><span class="badge badge-secondary">利用場面</span><br/>
                                [
                                {{#usage_scenarios}}
                                <span>{{.}}</span>,
                                {{/usage_scenarios}}
                                ]
                            </p>
                            <p><span class="badge badge-info">技術種類</span><br/>
                                [
                                {{#tech_types}}
                                <span>{{.}}</span>,
                                {{/tech_types}}
                                ]
                            </p>
                            <p>
                                {{#github_url}}
                                <a href="{{github_url}}"><i class="fab fa-github"></i></a>
                                {{/github_url}}
                                {{#official_url}}
                                <a href="{{official_url}}"><i class="fas fa-home"></i></a>
                                {{/official_url}}
                                {{#wiki_url}}
                                <a href="{{wiki_url}}"><i class="fab fa-wikipedia-w"></i></a>
                                {{/wiki_url}}
                            </p>
                        </div>
                    </div>
                </div>
            {{/results}}
        </template>
</amp-list>
<!-- template engine is https://github.com/janl/mustache.js/ -->
<!-- cat index.json | jq '.items | sort_by(.name) | { items: .}' > index.sort.json -->