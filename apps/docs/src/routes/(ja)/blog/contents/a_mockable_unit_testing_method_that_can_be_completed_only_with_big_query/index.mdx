---
title: BigQueryだけで完結するモック可能なユニットテスト手法
published: true
date: 2021-11-26
description: BigQuery、皆さん使っていますか？ 私は、業務でBigQueryを使ったデータ構築をしています。品質担保のため、BigQueryのSQLに対してテストをしたいと考えています。本記事では、BigQueryだけで完結し、かつ、Mockデータを差し替え可能なユニットテスト手法について、紹介します。
tags: ["HTML", "BigQuery", "Mock", "Unit Test", "Testing"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1611128736/silver-birder.github.io/assets/logo.png
---

BigQuery、皆さん使っていますか？
私は、業務で BigQuery を使ったデータ構築をしています。
品質担保のため、BigQuery の SQL に対してテストをしたいと考えています。
本記事では、BigQuery だけで完結し、かつ、Mock データを差し替え可能なユニットテスト手法について、紹介します。

## 動機

端的に言うと、BigQuery の SQL 改修時にデグレが発生していないか確認したいです。

業務で BigQuery の SQL を書いているのですが、それに対するユニットテストがありません。

Python や Javascript のような言語でアプリケーション開発する場合、XUnit 等のユニットテストフレームワークでユニットテストを書くのは、よくあると思います。
しかし、SQL に対するユニットテストというのは、(私の観測範囲上) あまり聞いたことがありません。

dbt(Data Build Tool)というツールを使えば、SQL へユニットテストをかけるようですが、私はそれの良さ・悪さを知りません。(興味本位で、試してみたい)

それよりも、新しいライブラリ・ツールを覚えるのではなく、その言語の**標準的な技術**を用いて、SQL のユニットテストが書けないかと悩みました。

そこで、私なりに BigQuery の SQL に対するユニットテスト方法を考えてみました。

## xUnit

xUnit は、ユニットテストのためのフレームワークです。

> xUnit is the collective name for several unit testing frameworks that derive their structure and functionality from Smalltalk's SUnit.

※ https://en.wikipedia.org/wiki/XUnit

xUnit は、各プログラミング言語に影響を与えました。
Java なら JUnit、Python なら unittest(厳密には JUnit から触発)のユニットテストができます。

## xUnit x Python

BigQuery の前に、まず Python を使ったユニットテストを紹介します。

『100 円未満の果物を取得する』関数、`get_less_than`があったとします。

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

[単体テストを記述するためのベストプラクティス#テストの配置](https://docs.microsoft.com/ja-jp/dotnet/core/testing/unit-testing-best-practices#arranging-your-tests)にあるように、ユニットテストは、次の 3 段階で分けて書くと、分かりやすいです。

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
fruits.py のコードにある `get_less_than`のロジックを誤ったものに変更します。
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
ユニットテストを書くメリットの 1 つは、この **デグレを検知できるところ** だと思っています。

## xUnit x BigQuery

BigQuery の場合、どのようにテストすればよいのでしょうか。
まず、BigQuery の SQL を書くために元データを用意します。

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

shop.fruits テーブルから、先程の Python コードにあった`get_less_than`関数相当の SQL を用意します。

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

- price が 100 未満の fruit は 1 つ

ただし、これは実データ(shop.fruits テーブル)を参照して生成されたデータです。
そのため、次の問題があります。

- 実データを参照しているため、テストが不安定になる
  - 実データに`orange`がなくなると、テストが失敗する
- フィードバックサイクルが長い
  - 実データが多くなると、テスト実行時間が長くなる

そこで、テーブル関数というものを活用し、実データをモックデータに差し替えるようにします。

## テーブル関数とは

BigQuery の公式ページより、テーブル関数について、次のことが書かれています。

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
FROM 句で関数呼び出しする際、モックデータを返却できるようにできないかと考えました。

そこで、次の章にある手段を発見しました。

## xUnit x BigQuery (Mock)

どのように差し替えるかというと、次の 2 つの順番にテーブル関数化していきます。

1. 元データを Mock 差し替えできるように、テーブル関数化
1. ロジックを含んだ SQL の FROM 句を、① のテーブル関数に差し替えて、テーブル関数化

順を追って説明します。

---

① 番目は、`元データをMock差し替えできるように、テーブル関数化` です。

元データは、今回`shop.fruits`テーブルですので、Mock で差し替えられるようにテーブル関数化します。
次のコードが、Mock 差し替え可能なテーブル関数です。

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

この SQL には、2 つのステートメントがあります。

1. テーブル関数 shop.fruits_inject の定義
1. テーブル関数 shop.fruits の定義

1 つ目は、後で Mock 差し替え(上書き)するための関数です。

2 つ目は、`is_test BOOL` という値を引数とした関数で、次の条件分岐があります。

- is_test が True の場合
  - モックデータ(shop.fruits_inject)を返却
- is_test が False の場合
  - 実データ(shop.fruits)を返却

プロダクションコード時は、is_test を False とし、テストコード時は、is_test を True として使う想定です。

---

② 番目は、`ロジックを含んだSQLのFROM句を、①のテーブル関数に差し替えて、テーブル関数化` です。

ロジックを含んだ SQL、今回は、`fruits_less_than_100`テーブルを関数化します。
次のコードが、① のテーブル関数で差し替えたテーブル関数です。

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

FROM 句に、先程 ① 番で定義した shop.fruits テーブル関数を呼び出します。
shop.fruits テーブル関数の引数は、shop.fruits_less_than 関数から渡ってくる`is_test BOOL`をそのままセットします。
また、shop.fruits_less_than 関数には、`p INT`という引数も持ち、less_than の price を柔軟に対応できるようにします。

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

取り上げて重要なことは、ありません。プロダクションコードは、is_test を False とします。

次が、本記事のメインである、**BigQuery の SQL に対するユニットテストコード**です。

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

この SQL は、3 つのステートメントがあります。

1. shop.fruits_inject 関数の上書き(**モックの差し込み**)
1. shop.fruits_less_than 関数で、is_test=True として生成し、一時テーブルで保存
1. ② の一時テーブルに対してアサーション

重要なのが、① 番です。shop.fruits_inject 関数を上書きします。
そうすると、shop.fruits 関数で参照する shop.fruits_inject 関数結果が、上書きされたものに切り替わります。

後は、② 番で shop.fruits_less_than 関数を呼んで一時テーブル保存し、③ 番でアサーションします。

では、テストを失敗させてみましょう。ロジックを含んでいる shop.fruits_less_than 関数を、次のように書き換えます。

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

WHERE 句の price が 100 未満ではなく、100 以下になっているので、`orange`と`lemon`の 2 つが抽出されます。

この関数を再度定義し、もう一度テストを実行してみましょう。
そうすると、次のようなメッセージが出力されます。

```
Query error: There's one fruit less than 100. at [25:1]
```

期待通り、テストは失敗しました！🎉

---

BigQuery のユニットテストができるようになれば、次は CI に組み込みたいと思うはずです。
BigQuery は、GCP のサービスなので、GCP の CI サービスとして有名な Cloud Build を活用しようと思います。
Cloud Build の定義ファイルを、次に示します。

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

Cloud Build を Github 等の Git プラットフォームと連携すれば、Git のイベント毎(Push,Merge,etc)にユニットテストを動かすことができます。

※ サンプルの cloudbuild.yaml にある、`id:fruits_ct`や`id:fruits_tvf`、`id:fruits_less_than_tvf`は何度も実行するものではないのですが、
記事をわかりやすくするために書いています。

## xUnit x BigQuery メリット・デメリット

BigQuery の Mock を差し替え可能なユニットテストについて、メリット・デメリットを列挙します。

- メリット
  - BigQuery だけ学習すればよい
    - BigQuery の標準機能だけで、完結しているため
  - フィードバックサイクルが短い
    - 実データを参照するのではなく、モックデータを参照しているため
  - テストが安定する
    - 実データを参照するのではなく、モックデータを参照しているため
- デメリット
  - BigQuery の SQL 実行順序を制御する必要あり
    - 今回でいうと、次の順番でクエリ実行する必要がある
      - 1. fruits_tvf.sql
      - 2. fruits_less_than_tvf.sql
      - 3. test_fruits_less_than_100.sql
    - 回避案
      - BigQuery の Scripting を利用
      - Cloud Build の`waitFor`を利用
  - 並列実行すると、予期せぬ動作になる
    - テーブル関数は、`CREATE OR REPLACE TABLE FUNCTION`で定義
      - shop.fruits_inject 関数が、何度も再定義されている
    - `CREATE TEMP TABLE FUNCTION` は未サポート
    - 回避案
      - BigQuery のトランザクションを利用
        - テーブル関数は未サポート
  - 汎用性がない
    - 他のデータベースエンジン(MySQL,PostgreSQL,etc)に、同じ手法(テーブル関数)は使えない
      - 回避案
        - dbt の利用(多分)

## 終わりに

今回、この手法を使うことで、BigQuery の SQL に対してユニットテストを書けることがわかりました。
これにより、データに対する品質を一定担保しながら、安全に開発できるようになります。

他にも、次のようなテスト手法についても検討して良いかもしれません。

- dbt によるデータモデルテスト
- Open Policy Agent(OPA)によるポリシーテスト
  - SQL を AST 分解 →JSON 化し、OPA でテスト
- BigQuery のクライアントライブラリを使った、ユニットテスト

## P.S.

dbt を試したいと思っています。
