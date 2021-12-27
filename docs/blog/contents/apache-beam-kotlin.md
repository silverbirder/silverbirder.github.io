---
title: Apache Beam + Kotlin 開発 実践入門
published: true
date: 2020-07-10
description: どうも、こんにちは。Re:ゼロ2期 始まりましたね、 @silver_birderです。最近、仕事の関係上、Apache Beam + Kotlin を使うことになりました。それらの技術が一切知らなかったので、この記事に学んだことを書いていきます。
tags: ["Apache Beam", "Kotlin", "Beginner"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614431187/silver-birder.github.io/blog/Photo_by_tian_kuan_on_Unsplash.jpg
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614431187/silver-birder.github.io/blog/Photo_by_tian_kuan_on_Unsplash.jpg
---

<!-- TODO: <span>Photo by <a href="https://unsplash.com/@realaxer?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">tian kuan</a> on <a href="https://unsplash.com/s/photos/pipeline?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span> -->

どうも、こんにちは。Re:ゼロ2期 始まりましたね👏、 [@silver_birder](https://twitter.com/silver_birder) です。
最近、仕事の関係上、Apache Beam + Kotlin を使うことになりました。それらの技術が一切知らなかったので、この記事に学んだことを書いていきます✍️。

サンプルリポジトリは、下記に載せています。

<iframely-embed card="small" url="https://github.com/Silver-birder/apache-beam-kotlin-example/tree/master/src/main/kotlin"></iframely-embed>

<!--  TODO: TOC -->

# Apache Beam とは

<iframely-embed card="small" url="https://www.st-hakky-blog.com/entry/2020/04/29/172220"></iframely-embed>

** BatchやStreaming を1つのパイプライン処理 ** として実現できるデータパイプライン、それがApache Beamです。(Batch + Stream → Beam)


言語は、Java, Python, Go(experimental)が選べます。 また、パイプライン上で実行する環境のことをランナーと呼び、Cloud DataflowやApache Flink、Apache Sparkなどがあります。

※ Streaming処理は、サーバーの能力がボトルネックになりがちです。そこで、Cloud DataflowというGCPのマネージドサービスを使用すると、その問題が解消されます。

機械学習など豊富な ** 分析ライブラリ ** を使いたい場合は、Python、 ** 型安全な ** 開発をしたい場合は、Java を選べば良いかなと思います。

今回は、Javaを選びました。モダンな書き方ができるKotlinでコーディングします。

# セットアップ
ソフトウェアバージョンは、次のとおりです。

```shell
$ java -version
openjdk version "1.8.0_252"
OpenJDK Runtime Environment (AdoptOpenJDK)(build 1.8.0_252-b09)
OpenJDK 64-Bit Server VM (AdoptOpenJDK)(build 25.252-b09, mixed mode)
```

IDEとしてintelliJを使用しており、Kotlin SDK(1.3.72)が内蔵しています。

```shell
$ git clone https://github.com/Silver-birder/apache-beam-kotlin-example.git && cd apache-beam-kotlin-example
$ ./gradlew build
```

# パイプライン処理の概要

```shell
1. データの入力する(input → PCollection)
2. 入力されたデータを変形させる (PCollection → PTransform → PCollection)
3. 加工したデータを出力する (PCollection → output)
```

PCollectionは、ひとかたまりのデータセットだと思って下さい。

よくあるサンプルコード [WordCount](https://github.com/Silver-birder/apache-beam-kotlin-example/blob/master/src/main/kotlin/WordCount.kt) を例に進めます。

※ 元々は、[ApacheBeam公式のWordCount](https://github.com/apache/beam/blob/master/examples/kotlin/src/main/java/org/apache/beam/examples/kotlin/WordCount.kt)があったのですが、ローカルマシン単体で動かせないため、多少アレンジしました。WordCountは、ある文章から単語を抽出しカウントを取るだけです。

メインのコードは、こちらです。動かすときは、IDEからデバッグ実行します。（この辺りは省略します。詳しくはMakefileを見て下さい🙇‍♂️）

```kotlin
@JvmStatic
fun main(args: Array<String>) {
    val options = (PipelineOptionsFactory.fromArgs(*args).withValidation().`as`(WordCountOptions::class.java))
    runWordCount(options)
}

@JvmStatic
fun runWordCount(options: WordCountOptions) {
    // パイプラインを作る（空っぽ）
    val p = Pipeline.create(options)

         // Textファイルからデータを入力する → PCollection
        p.apply("ReadLines", TextIO.read().from(options.inputFile))

        // PCollectionをPTransformで変形させる
        .apply(CountWords())
        .apply(MapElements.via(FormatAsTextFn()))

        // Textファイルにデータ(PCollection)を出力する
        .apply<PDone>("WriteCounts", TextIO.write().to(options.output))

    // パイプラインを実行する
    p.run().waitUntilFinish()
}
```

# PTransform

Apache BeamのコアとなるPTransform についてサンプルコードを載せます。

## ParDo
ParDoは、PCollectionを好きなように加工することができます。
最も、柔軟に処理を書くことができます。

```kotlin
    // PTransformによる変形処理
    public class CountWords : PTransform<PCollection<String>, PCollection<KV<String, Long>>>() {
        override fun expand(lines: PCollection<String>): PCollection<KV<String, Long>> {

            // 文章を単語に分割する
            val words = lines.apply(ParDo.of(ExtractWordsFn()))

            // 分割された単語をカウントする
            val wordCounts = words.apply(Count.perElement())
            return wordCounts
        }
    }

    public class ExtractWordsFn : DoFn<String, String>() {
        @ProcessElement
        fun processElement(@Element element: String, receiver: DoFn.OutputReceiver<String>) {
        ...
    }
```

## GroupByKey
Key-Value(KV)のPCollectionをKeyでグルーピングします。

```kotlin
import java.lang.Iterable as JavaIterable

// PCollection<KV<String, Long>>
val wordCounts = words.apply(Count.perElement())

// PCollection<KV<String, JavaIterable<Long>>>
val groupByWord = wordCounts.apply(GroupByKey.create<String, Long>()) as PCollection<KV<String, JavaIterable<Long>>>
```

Kotlinでは、Iterableが動作できないため、JavaのIterableを使う必要があります。

## Flatten
複数のPCollectionを1つのPCollectionに結合します。

```kotlin
// PCollection<KV<String, Long>>
val wordCounts = words.apply(Count.perElement())

// PCollectionList<KV<String, Long>>
val wordCountsDouble = PCollectionList.of(wordCounts).and(wordCounts)

// PCollection<KV<String, Long>>
val flattenWordCount = wordCountsDouble.apply(Flatten.pCollections())
```

## Combine
PCollectionの要素を結合します。
GroupByKeyのKey毎に要素を結合する方法と、PCollection毎に要素を結合する方法があります。
今回は、GroupByKeyのサンプルコードです。

```kotlin
// PCollection<KV<String, Long>>
val wordCounts = words.apply(Count.perElement())

// PCollection<KV<String, Long>>
val sumWordsByKey = wordCounts.apply(Sum.longsPerKey())
```

## Partition
PCollectionを任意の数でパーティション分割します。

```kotlin
// PCollection<KV<String, Long>>
val wordCounts = words.apply(Count.perElement())

// PCollection<KV<String, Long>>
var 10wordCounts = wordCounts.apply(Partition.of(10, PartitionFunc()))
```

# StreamingとWindowing
パイプラインを、そのまま使えばBatch実行となります。
Batchは、有限のデータに対し、Streamingは無限のデータに対して使います。
無限のデータを処理するのは、Windowingというものを使い、無限を有限のデータにカットして、処理します。


Streaming処理するためには、下記のようにコードにします。

```kotlin
    @JvmStatic
    fun main(args: Array<String>) {
        val options = (PipelineOptionsFactory.fromArgs(*args).withValidation().`as`(WordCountOptions::class.java))
        runWordCount(options)
    }

    @JvmStatic
    fun runWordCount(options: WordCountOptions) {
        val p = Pipeline.create(options)
        p.apply("ReadLines",
                        TextIO
                        .read()
                        .from("./src/main/kotlin/*.json")
                        // fromで指定したファイルがないか監視する。(入力値は無限)
                        //  10秒ごとに監視、5分間変更がなければ終了。
                        .watchForNewFiles(standardSeconds(10), afterTimeSinceNewOutput(standardMinutes(5)))
             )

            // 30秒間毎にWindowingする。（無限のデータを、有限のデータにカットする）
            .apply(Window.into<String>(FixedWindows.of(standardSeconds(30))))
            .apply(CountWords())
            .apply(MapElements.via(FormatAsTextFn()))
            .apply<PDone>("WriteCounts", TextIO.write().to(options.output).withWindowedWrites().withNumShards(1))
        p.run().waitUntilFinish()
    }
```

# テストコード
Apache Beamもテストコードが書けます。
サンプルコードは、[こちら](https://github.com/Silver-birder/apache-beam-kotlin-example/blob/master/src/test/kotlin/WordCountTest.kt)です。

実行するパイプラインをTestPipelineにすることで、テストができます。

```kotlin
import org.apache.beam.sdk.testing.TestPipeline

fun countWordsTest() {
        // Arrange
        val p: Pipeline = TestPipeline.create().enableAbandonedNodeEnforcement(false)
        val input: PCollection<String> = p.apply(Create.of(WORDS)).setCoder(StringUtf8Coder.of())
        val output: PCollection<KV<String, Long>>? = input.apply(CountWords())

        // Act
        p.run()

        // Assert
        PAssert.that<KV<String, Long>>(output).containsInAnyOrder(COUNTS_ARRAY)
    }

    companion object {
        val WORDS: List<String> = listOf(
            "hi there", "hi", "hi sue bob",
            "hi sue", "", "bob hi"
        )
        val COUNTS_ARRAY = listOf(
            KV.of("hi", 5L),
            KV.of("there", 2L),
            KV.of("sue", 2L),
            KV.of("bob", 2L)
        )
    }
```

# 終わりに
Apache Beamは、他にも Side inputやAdditional outputsなどがあります。
使いこなせるためにも、これからも頑張っていきます！

さて、Re:ゼロ2期を見ましょう👍
