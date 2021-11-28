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

業務でBigQueryのSQLを書いているのですが、それに対するユニットテストがありません。
PythonやJavascriptのような言語でアプリケーション開発する場合、XUnit等のユニットテストフレームワークを使いユニットテストができます。

しかし、SQLに対するユニットテストというのは、(私の観測範囲上) あまり聞いたことがありません。
dbt(Data Build Tool)というツールを使えば、SQLへテストをかけるようですが、私はそれの良さ・悪さを知りません。

新しいライブラリ・ツールを覚えるよりも、その言語の**標準的な技術**を用いて、SQLのユニットテストがかけないかと考えました。
そこで、BigQueryの標準的な技術だけで、ユニットテストを書こうと思いました。

# XUnit

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

BigQueryの場合、どのようにテストすればよいのでしょうか。
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

出力された`fruits_less_than_100`テーブルに対して、Pythonで書いたようなテストを、SQLで書いてみます。

```sql
-- test_fruits_less_than_100.sql
ASSERT
  (
  SELECT
    name = "orange"
  FROM
    shop.fruits_less_than_100) AS "The fruit that costs less than 100 is an orange."
```

このテストにより `fruits_less_than_100`テーブルに対して、"priceが100未満のfruitのnameがorangeであるということ"が保証できました。

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

ユーザー定義関数は、スカラ値を返却できますが、非スカラ値、つまりテーブルを返却できません。
次にユーザー定義関数の例を示します。

```sql
CREATE TEMP FUNCTION AddFourAndDivide(x INT64, y INT64)
  RETURNS FLOAT64
  AS ((x + 4) / y);
```

ユーザー定義関数は、次のように使います。

```sql
SELECT val, AddFourAndDivide(val, 2)
  FROM UNNEST([2,3,5,8]) AS val;
```

逆にテーブル関数は、テーブルを返却することができます。次にテーブル関数の例を示します。

```sql
CREATE OR REPLACE TABLE FUNCTION mydataset.names_by_year(y INT64)
AS
  SELECT year, name, SUM(number) AS total
  FROM `bigquery-public-data.usa_names.usa_1910_current`
  WHERE year = y
  GROUP BY year, name
```

テーブル関数は、次のように使います。

```sql
SELECT * FROM mydataset.names_by_year(1950)
  ORDER BY total DESC
  LIMIT 5
```


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