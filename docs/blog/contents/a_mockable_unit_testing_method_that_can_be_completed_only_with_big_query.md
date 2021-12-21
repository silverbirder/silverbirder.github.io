---
title: BigQueryだけで完結するモック可能なユニットテスト手法
published: true
date: 2021-11-26
description: BigQuery、皆さん使っていますか？ 私は、業務でBigQueryを使ったデータ構築をしています。品質担保のため、BigQueryのSQLに対してテストをしたいと考えています。本記事では、BigQueryだけで完結し、かつ、Mockデータを差し替え可能なユニットテスト手法について、紹介します。
tags: ["HTML", "BigQuery", "Mock", "Unit Test", "Testing"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

BigQuery、皆さん使っていますか？ 
私は、業務でBigQueryを使ったデータ構築をしています。
品質担保のため、BigQueryのSQLに対してテストをしたいと考えています。
本記事では、BigQueryだけで完結し、かつ、Mockデータを差し替え可能なユニットテスト手法について、紹介します。

## 動機
端的に言うと、BigQueryのSQL改修時にデグレが発生していないか確認したいです。

業務でBigQueryのSQLを書いているのですが、それに対するユニットテストがありません。

PythonやJavascriptのような言語でアプリケーション開発する場合、XUnit等のユニットテストフレームワークでユニットテストを書くのは、よくあると思います。
しかし、SQLに対するユニットテストというのは、(私の観測範囲上) あまり聞いたことがありません。

dbt(Data Build Tool)というツールを使えば、SQLへユニットテストをかけるようですが、私はそれの良さ・悪さを知りません。(興味本位で、試してみたい)

それよりも、新しいライブラリ・ツールを覚えるのではなく、その言語の**標準的な技術**を用いて、SQLのユニットテストが書けないかと悩みました。

そこで、私なりにBigQueryのSQLに対するユニットテスト方法を考えてみました。

## xUnit

xUnitは、ユニットテストのためのフレームワークです。

> xUnit is the collective name for several unit testing frameworks that derive their structure and functionality from Smalltalk's SUnit.

※ https://en.wikipedia.org/wiki/XUnit

xUnitは、各プログラミング言語に影響を与えました。
JavaならJUnit、Pythonならunittest(厳密にはJUnitから触発)のユニットテストができます。

## xUnit x Python
BigQueryの前に、まずPythonを使ったユニットテストを紹介します。

『100円未満の果物を取得する』関数、`get_less_than`があったとします。

```python
# fruits.py
class Fruits(object):
    def _get_fruits(self):
        return [
            {"price": 130, "name": "apple"},
            {"price": 120, "name": "banana"},
            {"price": 110, "name": "grape"},
            {"price": 100, "name": "lemon"},
            {"price": 90, "name": "orange"},
        ]

    def get_less_than(self, price):
        fruits = self._get_fruits()
        return list(filter(lambda x: x["price"] < price, fruits))
```

`_get_fruits`関数は、簡易的なモノで、実際には実データを参照する箇所になります。

`get_less_than`関数に対してユニットテストを書くとすれば、次のコードになります。

```python
# test_fruits.py
import unittest
from unittest.mock import patch

from fruits import Fruits


class TestFruits(unittest.TestCase):
    @patch("fruits.Fruits._get_fruits")
    def test_get_less_than(self, mock_get_fruits):
        # Arrange
        mock_get_fruits.return_value = [
            {"price": 110, "name": "apple"},
            {"price": 100, "name": "banana"},
            {"price": 90, "name": "orange"},
        ]
        fruits = Fruits()

        # Act
        actual = fruits.get_less_than(price=100)

        # Assert
        assert len(actual) == 1
```

[単体テストを記述するためのベストプラクティス#テストの配置](https://docs.microsoft.com/ja-jp/dotnet/core/testing/unit-testing-best-practices#arranging-your-tests)にあるように、ユニットテストは、次の3段階で分けて書くと、分かりやすいです。

1. Arrange: 配置, 準備
1. Act: 実行
1. Assert: 検証

ユニットテストは、次のコマンドで実行できます。

```shell
$ python -m unittest test_fruits
.
----------------------------------------------------------------------
Ran 1 test in 0.001s

OK
```

テストは成功しました。今度は、失敗させてみましょう。
fruits.pyのコードにある `get_less_than`のロジックを誤ったものに変更します。
コードは、次のとおりです。

```python
# fruits.py
class Fruits(object):
    ...
    def get_less_than(self, price):
        fruits = self._get_fruits()
        # return list(filter(lambda x: x["price"] < price, fruits))
        return list(filter(lambda x: x["price"] <= price, fruits))
```

この状態で、さきほどのユニットテストを実施してみます。

```shell
$ python3 -m unittest test_fruits
F
======================================================================
FAIL: test_get_less_than (test_fruits.TestFruits)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "/Library/Frameworks/Python.framework/Versions/3.8/lib/python3.8/unittest/mock.py", line 1348, in patched
    return func(*newargs, **newkeywargs)
  File "test_fruits.py", line 22, in test_get_less_than
    assert len(actual) == 1
AssertionError

----------------------------------------------------------------------
Ran 1 test in 0.005s

FAILED (failures=1)
```

期待通り、失敗しました。
**ロジックを誤る**というのは、保守を続けていくと、**ほぼ間違いなく発生**します。
その際、**ロジックが誤っている** と気付ける、つまりデグレを気づける事が大切です。
ユニットテストを書くメリットの1つは、この **デグレを検知できるところ** だと思っています。

## xUnit x BigQuery

BigQueryの場合、どのようにテストすればよいのでしょうか。
まず、BigQueryのSQLを書くために元データを用意します。

```sql
-- fruits_ct.sql
-- destination: 
--   dataset: shop
--   table: fruits
CREATE OR REPLACE TABLE
  shop.fruits AS
SELECT
  price,
  name
FROM (
  SELECT
    130 AS price,
    "apple" AS name
  UNION ALL
  SELECT
    120 AS price,
    "banana" AS name
  UNION ALL
  SELECT
    110 AS price,
    "grape" AS name
  UNION ALL
  SELECT
    100 AS price,
    "lemon" AS name
  UNION ALL
  SELECT
    90 AS price,
    "orange" AS name )
```

shop.fruitsテーブルから、先程のPythonコードにあった`get_less_than`関数相当のSQLを用意します。

```sql
-- fruits_less_than_100.sql
-- destination
--   dataset: shop
--   table: fruits_less_than_100
SELECT
  price,
  name
FROM
  shop.fruits
WHERE
  price < 100
```

出力された`fruits_less_than_100`テーブルに対して、ユニットテストを書いてみます。

```sql
-- test_fruits_less_than_100.sql
ASSERT
  (
  SELECT
    COUNT(name) = 1
  FROM
    shop.fruits_less_than_100) AS "There's one fruit less than 100."
```

このテストにより `fruits_less_than_100`テーブルに対して、次のことを保証できました。

* priceが100未満のfruitは1つ

ただし、これは実データ(shop.fruitsテーブル)を参照して生成されたデータです。
そのため、次の問題があります。

* 実データを参照しているため、テストが不安定になる
  * 実データに`orange`がなくなると、テストが失敗する
* フィードバックサイクルが長い
  * 実データが多くなると、テスト実行時間が長くなる

そこで、テーブル関数というものを活用し、実データをモックデータに差し替えるようにします。

## テーブル関数とは

BigQueryの公式ページより、テーブル関数について、次のことが書かれています。

> テーブル関数（テーブル値関数、TVF とも呼ばれます）は、テーブルを返すユーザー定義関数です。テーブル関数は、テーブルを使用できる場所であればどこでも使用できます。テーブル関数はビューと似ていますが、テーブル関数ではパラメータを取得できます。

※ [テーブル関数|BigQuery|Google Cloud](https://cloud.google.com/bigquery/docs/reference/standard-sql/table-functions)

テーブル関数の定義は、次のようなサンプルコードがあります。

```sql
-- names_by_year.tvf.sql
CREATE OR REPLACE TABLE
  FUNCTION mydataset.names_by_year(y INT64) AS
SELECT
  year,
  name,
  SUM(number) AS total
FROM
  `bigquery-public-data.usa_names.usa_1910_current`
WHERE
  year = y
GROUP BY
  year,
  name
```

特徴は、`CREATE OR REPLACE TABLE FUNCTION` です。関数を定義し、テーブル情報を返り値とします。今回のケースでは、`year, name, total` のフィールドを持つテーブルです。

定義したテーブル関数は、次のように使います。

```sql
-- names_by_year.sql
SELECT
  *
FROM
  mydataset.names_by_year(1950)
ORDER BY
  total DESC
LIMIT
  5
```

テーブル関数は、`FROM句`に使えます。私は、ここに着目しました。
FROM句で関数呼び出しする際、モックデータを返却できるようにできないかと考えました。

そこで、次の章にある手段を発見しました。

## xUnit x BigQuery (Mock)

どのように差し替えるかというと、次の2つの順番にテーブル関数化していきます。

1. 元データをMock差し替えできるように、テーブル関数化
1. ロジックを含んだSQLのFROM句を、①のテーブル関数に差し替えて、テーブル関数化

順を追って説明します。

---

①番目は、`元データをMock差し替えできるように、テーブル関数化` です。

元データは、今回`shop.fruits`テーブルですので、Mockで差し替えられるようにテーブル関数化します。
次のコードが、Mock差し替え可能なテーブル関数です。

```sql
-- fruits_tvf.sql
--   function:
--    - shop.fruits_inject()
--    - shop.fruits(is_test BOOL)
CREATE OR REPLACE TABLE
  FUNCTION shop.fruits_inject() AS
SELECT
  *
FROM (
  SELECT
    130 AS price,
    "apple" AS name )
WHERE
  1 <> 1;
CREATE OR REPLACE TABLE
  FUNCTION shop.fruits(is_test BOOL) AS
SELECT
  name,
  price
FROM
  shop.fruits
WHERE
  NOT is_test
UNION ALL
SELECT
  name,
  price
FROM
  shop.fruits_inject()
WHERE
  is_test
```

このSQLには、2つのステートメントがあります。

1. テーブル関数 shop.fruits_injectの定義
1. テーブル関数 shop.fruitsの定義

1つ目は、後でMock差し替え(上書き)するための関数です。

2つ目は、`is_test BOOL` という値を引数とした関数で、次の条件分岐があります。

* is_testがTrueの場合
  * モックデータ(shop.fruits_inject)を返却
* is_testがFalseの場合
  * 実データ(shop.fruits)を返却

プロダクションコード時は、is_testをFalseとし、テストコード時は、is_testをTrueとして使う想定です。

---

②番目は、`ロジックを含んだSQLのFROM句を、①のテーブル関数に差し替えて、テーブル関数化` です。

ロジックを含んだSQL、今回は、`fruits_less_than_100`テーブルを関数化します。
次のコードが、①のテーブル関数で差し替えたテーブル関数です。

```sql
-- fruits_less_than_tvf.sql
--  function: 
--    - shop.fruits_less_than(is_test BOOL, p INT)
CREATE OR REPLACE TABLE
  FUNCTION shop.fruits_less_than(is_test BOOL,
    p INT) AS
SELECT
  price,
  name
FROM
  shop.fruits(is_test)
WHERE
  price < p
```

FROM句に、先程①番で定義したshop.fruitsテーブル関数を呼び出します。
shop.fruitsテーブル関数の引数は、shop.fruits_less_than関数から渡ってくる`is_test BOOL`をそのままセットします。
また、shop.fruits_less_than関数には、`p INT`という引数も持ち、less_thanのpriceを柔軟に対応できるようにします。

--- 

これにて、テーブル関数化を終えました。次は、プロダクトコードとテストコードを紹介します。

では、まずプロダクションコードを書きます。

```sql
-- fruits_less_than_100.sql
-- destination
--   dataset: shop
--   table: fruits_less_than_100
SELECT
  price,
  name,
FROM
  shop.fruits_less_than(False, 100)
```

取り上げて重要なことは、ありません。プロダクションコードは、is_testをFalseとします。

次が、本記事のメインである、**BigQueryのSQLに対するユニットテストコード**です。

```sql
-- test_fruits_less_than_100.sql
-- arrange
CREATE OR REPLACE TABLE
  FUNCTION shop.fruits_inject() AS
SELECT
  110 AS price,
  "grape" AS name
UNION ALL
SELECT
  100 AS price,
  "lemon" AS name
UNION ALL
SELECT
  90 AS price,
  "orange" AS name;
-- act
  CREATE TEMP TABLE fruits_less_than_100 AS
SELECT
  price,
  name,
FROM
  shop.fruits_less_than(True,
    100);
-- assert
ASSERT
  (
  SELECT
    COUNT(name) = 1
  FROM
    fruits_less_than_100) AS "There's one fruit less than 100."
```

このSQLは、3つのステートメントがあります。

1. shop.fruits_inject関数の上書き(**モックの差し込み**)
1. shop.fruits_less_than関数で、is_test=Trueとして生成し、一時テーブルで保存
1. ②の一時テーブルに対してアサーション

重要なのが、①番です。shop.fruits_inject関数を上書きします。
そうすると、shop.fruits関数で参照するshop.fruits_inject関数結果が、上書きされたものに切り替わります。

後は、②番でshop.fruits_less_than関数を呼んで一時テーブル保存し、③番でアサーションします。

では、テストを失敗させてみましょう。ロジックを含んでいるshop.fruits_less_than関数を、次のように書き換えます。

```sql
-- fruits_less_than_tvf.sql
--  function: 
--    - shop.fruits_less_than(is_test BOOL, p INT)
CREATE OR REPLACE TABLE
  FUNCTION shop.fruits_less_than(is_test BOOL,
    p INT) AS
SELECT
  price,
  name
FROM
  shop.fruits(is_test)
WHERE
  -- price < p
  price <= p
```

WHERE句のpriceが100未満ではなく、100以下になっているので、`orange`と`lemon`の2つが抽出されます。

この関数を再度定義し、もう一度テストを実行してみましょう。
そうすると、次のようなメッセージが出力されます。

```
Query error: There's one fruit less than 100. at [25:1]
```

期待通り、テストは失敗しました！🎉

---

BigQueryのユニットテストができるようになれば、次はCIに組み込みたいと思うはずです。
BigQueryは、GCPのサービスなので、GCPのCIサービスとして有名なCloud Buildを活用しようと思います。
Cloud Buildの定義ファイルを、次に示します。

```yaml
-- cloudbuild.yaml
steps:
  # If you want to receive notifications from Slack, uncomment it. 
  # Then follow the README.md at the following URL to set it up.
  # https://github.com/GoogleCloudPlatform/cloud-builders-community/tree/master/slackbot
  # - name: "gcr.io/$PROJECT_ID/slackbot"
  #   id: "WATCH"
  #   args: [
  #     "--build", "$BUILD_ID",
  #     "--webhook", "$_SLACK_WEB_HOOK"
  #   ]
  - name: gcr.io/cloud-builders/gcloud-slim
    id: fruits_ct
    entrypoint: 'bash'
    args: ['run_query.sh', 'fruits_ct.sql']
  - name: gcr.io/cloud-builders/gcloud-slim
    id: fruits_tvf
    entrypoint: 'bash'
    args: ['run_query.sh', 'fruits_tvf.sql']
    waitFor:
      - fruits_ct
  - name: gcr.io/cloud-builders/gcloud-slim
    id: fruits_less_than_tvf
    entrypoint: 'bash'
    args: ['run_query.sh', 'fruits_less_than_tvf.sql']
    waitFor:
      - fruits_tvf
  - name: gcr.io/cloud-builders/gcloud-slim
    id: test_fruits_less_than_100
    entrypoint: 'bash'
    args: ['run_query.sh', 'test_fruits_less_than_100.sql']
    waitFor:
      - fruits_less_than_tvf
```

```shell
#!/bin/bash
# run_query.sh
if [ $# -eq 0 ]; then
  echo "No arguments supplied"
fi
bq query --use_legacy_sql=false < $1
```

Cloud BuildをGithub等のGitプラットフォームと連携すれば、Gitのイベント毎(Push,Merge,etc)にユニットテストを動かすことができます。

※ サンプルのcloudbuild.yamlにある、`id:fruits_ct`や`id:fruits_tvf`、`id:fruits_less_than_tvf`は何度も実行するものではないのですが、
記事をわかりやすくするために書いています。

## xUnit x BigQuery メリット・デメリット

BigQueryのMockを差し替え可能なユニットテストについて、メリット・デメリットを列挙します。

* メリット
  * BigQueryだけ学習すればよい
    * BigQueryの標準機能だけで、完結しているため
  * フィードバックサイクルが短い
    * 実データを参照するのではなく、モックデータを参照しているため
  * テストが安定する
    * 実データを参照するのではなく、モックデータを参照しているため
* デメリット
  * BigQueryのSQL実行順序を制御する必要あり
    * 今回でいうと、次の順番でクエリ実行する必要がある
      * 1. fruits_tvf.sql
      * 2. fruits_less_than_tvf.sql
      * 3. test_fruits_less_than_100.sql
    * 回避案
      * BigQueryのScriptingを利用
      * Cloud Buildの`waitFor`を利用
  * 並列実行すると、予期せぬ動作になる
    * テーブル関数は、`CREATE OR REPLACE TABLE FUNCTION`で定義
      * shop.fruits_inject関数が、何度も再定義されている
    * `CREATE TEMP TABLE FUNCTION` は未サポート
    * 回避案
      * BigQueryのトランザクションを利用
        * テーブル関数は未サポート
  * 汎用性がない
    * 他のデータベースエンジン(MySQL,PostgreSQL,etc)に、同じ手法(テーブル関数)は使えない
      * 回避案
        * dbtの利用(多分)

## 終わりに

今回、この手法を使うことで、BigQueryのSQLに対してユニットテストを書けることがわかりました。
これにより、データに対する品質を一定担保しながら、安全に開発できるようになります。

他にも、次のようなテスト手法についても検討して良いかもしれません。

* dbtによるデータモデルテスト
* Open Policy Agent(OPA)によるポリシーテスト
  * SQLをAST分解→JSON化し、OPAでテスト
* BigQueryのクライアントライブラリを使った、ユニットテスト

## P.S.

dbtを試したいと思っています。
