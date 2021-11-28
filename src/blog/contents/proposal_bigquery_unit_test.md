<!-- 
title: BigQueryだけで完結するMock可能なユニットテスト手法
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

業務でBigQueryのSQLを書きます。運用・保守が長引くとBigQueryのSQLファイル数が増えたり、
SQLのロジックが複雑になります。
PythonやJavascriptのような言語では、ユニットテストを使ってロジックの保証をしますが、
BigQueryのSQLには、ユニットテストをどう書けばよいのか、私は知りませんでした。
そこで、私なりにBigQueryのSQLに対するユニットテストを考えました。

# xUnit
xUnitは、単体テストで使用するフレームワークです。例えば、『100円未満の果物を取得する』関数、`get_less_than`があったとします。言語はPythonです。

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

`get_less_than`関数に対してxUnitを書くとすれば、次のコードになります。

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

[単体テストを記述するためのベストプラクティス#テストの配置](https://docs.microsoft.com/ja-jp/dotnet/core/testing/unit-testing-best-practices#arranging-your-tests)にあるように、Arrange,Act,Assertという3段階でユニットテストを書くのが分かりやすいです。

# BigQuery

BigQueryの場合、どのようにテストしましょうか。
まず、データを用意します。

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

fruitsのテーブルから、`get_less_than`関数相当のSQLを用意します。

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

これだと、実データ(shop.fruits)を参照しています。
このまま、テストを書くとすれば、次の感じになります。

```sql
-- test_fruits_less_than_100.sql
ASSERT
  (
  SELECT
    name = "orange"
  FROM
    shop.fruits_less_than_100) AS "The fruit that costs less than 100 is an orange."
```

これだと、実データで生成したデータに対してテストをしています。
これは、次の2つのデメリットがあります。

* フィードバックサイクルが長い
* テストが不安定になる

そこで、テーブル関数というものを活用します。

# テーブル関数とは

TODO

# BigQuery Mocking

```sql
-- 1_fruits_tvf.sql
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

```sql
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

```sql
SELECT
  *
FROM
  shop.fruits_less_than(false, 100)
```

```sql
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
  shop.fruits_less_than(FALSE,
    100);
  -- assert
ASSERT
  (
  SELECT
    name = "orange"
  FROM
    fruits_less_than_100) AS "The fruit that costs less than 100 is an orange."
```

これで、dataset.product_data(false) とすれば、datasets.product_data_inject()のデータを返却できます。味噌は、datasets.product_data_inject()の関数を後で上書きします。

これにより、モックデータを差し替えた状態で、BigQueryのアサート関数を使いテストすることができます。

メリット
* BQオンリー
* 実データではなく、Mockデータ
   * フィードバックサイクルが短い
   * テストが安定
* テーブル関数によるロジックカプセル化
   * 処理共通化 (書かなくて良いかも)
デメリット
* テーブル関数がTEMPじゃない。
* BQのジョブを制御する必要がある

# 終わりに
BigQueryだけで完結できるポイントが良いです。BigQuery Client Libraryを使ったテストも、もちろんできますが、BigQueryだけでテストできるのは、テストの敷居が下がります。

# その他
今回は、たまたまBigQueryにMockingする方法としてテーブル関数が使えましたが、他のSQLには使えません。

そのため、他にテストする手段も、考えても良いです。

例えば、Open Policy Agent を使ってAST分解した構造化ファイル(jsonファイル)をOPAでテストだったり、
BigQuery API + Python によるユニットテスト、
dbtによるテスト、
Apache Beamのテストランナー などがあります。