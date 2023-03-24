---
title: ERNIE-ViLG を Google Colaboratory で動かしてみた
published: true
date: 2022-09-03
description: ERNIE-ViLG というのが、"二次元キャラ" に強いという記事を目にしました。実際に使ってみようと、次のページで試したんですが、レスポンスがイマイチでした。そこで、次の記事を参考にして、ERNIE-ViLG を Google Colaboratory で動かすようにしました。
tags: ["ERNIE-ViLG"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1662181776/silver-birder.github.io/blog/ERNIE-ViLG-DEMO.png
---

ERNIE-ViLG というのが、"二次元キャラ" に強いという記事を目にしました。
実際に使ってみようと、次のページで試したんですが、レスポンスがイマイチでした。

- https://huggingface.co/spaces/PaddlePaddle/ERNIE-ViLG

そこで、[公式ページ](https://github.com/PaddlePaddle/PaddleHub/tree/develop/modules/image/text_to_image/ernie_vilg)を参考にして、ERNIE-ViLG を Google Colaboratory を書こうと思いました。

## Google Colaboratory で動かす

実際に作ったものは、次のモノです。

- [DEMO_PaddlePaddle_PaddleHub_ERNIE_ViLG](https://colab.research.google.com/github/silverbirder/DEMO-PaddlePaddle-PaddleHub-ERNIE-ViLG/blob/main/src/DEMO_PaddlePaddle_PaddleHub_ERNIE_ViLG.ipynb)

中身については、正直良くわかっていないですが([公式ページ](https://github.com/PaddlePaddle/PaddleHub/tree/develop/modules/image/text_to_image/ernie_vilg) 通りに試しただけ)、簡単に紹介しようと思います。

## 準備

次のコマンドを叩いて、ERNIE-ViLG の準備をします。(GPU 環境でないと動作しません)

```bash
$ pip install paddlepaddle-gpu -U
$ pip install paddlehub==2.1.0
```

```python
import paddlehub
paddlehub.server_check()
```

```bash
$ hub install ernie_vilg
```

## ERNIE-ViLG を使う

使うのは、2 つのパターンがあります。

1. CLI で実行する(hub コマンド)
2. Python で実行する(hub ライブラリ)

CLI の場合は、次のとおりです。

```bash
$ hub run ernie_vilg --text_prompts "宁静的小镇" --style "油画" --output_dir ernie_vilg_out
```

Python の場合は、次のとおりです。

```python
import paddlehub as hub

module = hub.Module(name="ernie_vilg")
text_prompts = ["宁静的小镇"]
images = module.generate_image(text_prompts=text_prompts, style='油画', output_dir='./ernie_vilg_out/')
```

オプションは、次の説明の通りです。

- text_prompts
  - 生成したい画像の内容を記述した入力文
- style
  - スタイルで画像を生成することが可能
    - 油画 (油絵)
    - 水彩 (水彩画)
    - 粉笔画 (パステル)
    - 卡通 (漫画, カートゥーン)
    - 儿童画 (子供向け)
    - 蜡笔画 (クレヨン)
    - 探索无限 (無限大を探る)
- topk
  - 生成する画像数（最大 6 枚）
- output_dir
  - 保存先のディレクトリ (デフォルト:ernievilg_output)

※ [ERNIE-ViLG#API](https://github.com/PaddlePaddle/PaddleHub/tree/develop/modules/image/text_to_image/ernie_vilg#3api)

text_prompts や style は、中国語で書く必要があります。

## Google Colaboratory で 画像を簡単に見たい

ERNIE-ViLG を動かすと、出力ファイルが Google Colaboratory のフォルダに入ります。
画像を見るためには、画像をダウンロードして、開くという手間があります。

![download_image_on_browser](https://res.cloudinary.com/silverbirder/image/upload/v1662183656/silver-birder.github.io/blog/download_image_on_browser.png)

そこで、フォルダを Google Drive と同期するという機能があります。
これを使えば、保存先を Google Drive にしておけば、Google Drive の UI 上から画像を見ることができます。

![mount_google_drive](https://res.cloudinary.com/silverbirder/image/upload/v1662183656/silver-birder.github.io/blog/mount_google_drive.png)

めちゃくちゃ便利なので、ぜひ使ってみてください。
