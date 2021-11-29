<!-- 
title: BigQueryだけで完結するモック可能なユニットテスト手法
date: 2021-11-26T20:47:00+09:00
draft: false
description: 
image: 
icon: ⚡️
-->

BigQuery、皆さん使っていますか？ 
私は、業務でBigQueryを使ったデータ構築をしています。
品質担保のため、BigQueryのSQLに対してテストをしたいと考えています。
本記事では、BigQueryだけで完結し、かつ、Mockデータを差し替え可能なユニットテスト手法について、紹介します。

[:contents]

# 動機
端的に言うと、BigQueryのSQL改修時にデグレが発生していないか確認したいです。

業務でBigQueryのSQLを書いているのですが、それに対するユニットテストがありません。

PythonやJavascriptのような言語でアプリケーション開発する場合、XUnit等のユニットテストフレームワークでユニットテストを書くのは、よくあると思います。
しかし、SQLに対するユニットテストというのは、(私の観測範囲上) あまり聞いたことがありません。

dbt(Data Build Tool)というツールを使えば、SQLへユニットテストをかけるようですが、私はそれの良さ・悪さを知りません。
それよりも、新しいライブラリ・ツールを覚えるのではなく、その言語の**標準的な技術**を用いて、SQLのユニットテストが書けないかと悩みました。

そこで、私なりにBigQueryのSQLに対するユニットテスト方法を考えてみました。

# xUnit

xUnitは、ユニットテストのためのフレームワークです。

> xUnit is the collective name for several unit testing frameworks that derive their structure and functionality from Smalltalk's SUnit.

※ https://en.wikipedia.org/wiki/XUnit

xUnitは、各プログラミング言語に影響を与えました。
JavaならJUnit、Pythonならunittest(厳密にはJUnitから触発)のユニットテストができます。

# xUnit x Python

Pythonを使って、サンプルのユニットテストを紹介します。

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

テストは成功したようです。今度は、失敗させてみましょう。
fruits.pyのコードにある `get_less_than`のロジックを下記のように変更します。

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
その際、**ロジックが間違っている** と気付ける、つまりデグレしていることが気づける事が大切です。
ユニットテストを書くメリットは、この **デグレを検知できるところ** だと思っています。

# xUnit x BigQuery

BigQueryの場合、どのようにテストすればよいのでしょうか。
まず、BigQueryのSQLを書くために元データを用意します。

```sql
-- fruits_ct.sql
-- destination: 
--   dataset: shop
--   table: fruits
CREATE TABLE
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
    name = "orange"
  FROM
    shop.fruits_less_than_100) AS "The fruit that costs less than 100 is an orange."
```

このテストにより `fruits_less_than_100`テーブルに対して、次のことを保証できました。

* priceが100未満のfruitのnameがorangeであるということ

ただし、これは実データ(shop.fruitsテーブル)を参照して生成されたデータです。
そのため、次の問題があります。

* 実データを参照しているため、テストが不安定になる
  * 実データに`orange`がなくなると、テストが失敗する
* フィードバックサイクルが長い
  * 実データが多くなると、テスト結果に時間がかかる

そこで、テーブル関数というものを活用し、実データをモックデータに差し替えるようにします。

# テーブル関数とは

> テーブル関数（テーブル値関数、TVF とも呼ばれます）は、テーブルを返すユーザー定義関数です。テーブル関数は、テーブルを使用できる場所であればどこでも使用できます。テーブル関数はビューと似ていますが、テーブル関数ではパラメータを取得できます。

※ [テーブル関数|BigQuery|Google Cloud](https://cloud.google.com/bigquery/docs/reference/standard-sql/table-functions)

テーブル関数の定義は、次のように書きます。

```sql
-- names_by_year.tvf.sql
CREATE OR REPLACE TABLE
  FUNCTION shop.names_by_year(y INT64) AS
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

定義したテーブル関数は、次のように使います。

```sql
-- names_by_year.sql
SELECT
  *
FROM
  shop.names_by_year(1950)
ORDER BY
  total DESC
LIMIT
  5
```

テーブル関数は、FROM句に使えます。これを利用してMockデータの差し替えができるようにします。

# xUnit x BigQuery (Mock)

shop.fruitsテーブルをMockで差し替えられるように、テーブル関数化します。

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
2つ目は、`is_test BOOL` という値を引数とした関数で、実データ(shop.fruits)とモックデータ(shop.fruits_inject)の和集合を返します。

元データを関数化したら、次は `fruits_less_than_100`テーブルを関数化します。

```sql
-- fruits_tvf.sql
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

shop.fruits_less_than関数は、shop.fruits関数と同じ `is_test BOOL` という引数を持ちます。
また、`p INT` という引数も持ち、less_thanのpriceを柔軟に対応できるようにします。

では、プロダクションコードを書きます。

```sql
-- fruits_less_than_100.sql
-- destination
--   dataset: shop
--   table: fruits_less_than_100
SELECT
  *
FROM
  shop.fruits_less_than(False, 100)
```

次が、本記事のメインであるユニットテストコードです。

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
  *
FROM
  shop.fruits_less_than(True,
    100);
-- assert
ASSERT
  (
  SELECT
    name = "orange"
  FROM
    fruits_less_than_100) AS "The fruit that costs less than 100 is an orange."
```

このSQLは、3つのステートメントがあります。

1. shop.fruits_inject関数の上書き(**モックの差し込み**)
1. shop.fruits_less_than関数で、is_test=Trueとして生成し、一時テーブルで保存
1. fruits_less_than_100に対してアサーション

重要なのが、①番です。shop.fruits_inject関数を上書きします。
そうすると、shop.fruits関数で参照するshop.fruits_inject関数結果が、上書きされたものに切り替わります。

後は、②番でshop.fruits_less_than関数を呼んで一時テーブル保存し、③番でアサーションします。

# xUnit x BigQuery メリット・デメリット

BigQueryのMockを差し替え可能なユニットテストについて、メリット・デメリットを列挙します。

* メリット
  * BQオンリー
  * 実データではなく、Mockデータ
    * フィードバックサイクルが短い
    * テストが安定
  * テーブル関数によるロジックカプセル化
   * 処理共通化 (書かなくて良いかも)
* デメリット
  * テーブル関数がTEMPじゃない。
  * BQのジョブを制御する必要がある

# 終わりに
TODO

# その他
今回は、たまたまBigQueryにMockingする方法としてテーブル関数が使えましたが、他のSQLには使えません。
そのため、他にテストする手段も、考えても良いです。
例えば、Open Policy Agent を使ってAST分解した構造化ファイル(jsonファイル)をOPAでテストだったり、
BigQuery API + Python によるユニットテスト、
Apache Beamのテストランナー などがあります。