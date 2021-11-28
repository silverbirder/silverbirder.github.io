<!-- 
title: BigQuery UnitTest 手法提案
date: 2021-11-26T20:47:00+09:00
draft: false
description: 
image: 
icon: ⚡️
-->


[:contents]

# 書く内容

# 概要
単体テストのテスティングフレームワークであるxUnitの BigQuery版のアイデアを考案しました。名付けて BQUnitTest です。本記事では、BQUnitTest について紹介します。

# 動機
端的に言うと、BigQuery SQLの改修時にデグレが発生していないか確認したいです。


バッチ系のプロジェクトで、BigQueryを使ったデータ構築があります。データ構築には、複数のBigQuery SQLファイルをある順序に従って、テーブル出力します。
BigQuery SQLの数は、数十以上存在します。プロジェクトが進行するにつれて、また、運用が進むにつれて、BigQuery SQLの改修が発生します。その際、デグレが発生しないかを確認するテストが必要となりました。

# xUnit
xUnitは、単体テストで使用するフレームワークです。例えば、『100円以下の商品名を取得する』関数があったとします。言語はPythonです。


```python
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

この関数に対してxUnitを書くとすれば、次のコードになります。

```python
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

# BQUnitTest

```sql
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

このままだと、実データを参照しているため、テストが不安定になります。


```sql
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


BQUnitTestのコードは、次のコードです。

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