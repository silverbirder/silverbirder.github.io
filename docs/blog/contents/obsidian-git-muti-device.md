---
title: ObsidianでiPhoneからGit Commitする
published: true
date: 2022-10-18
description: WikiWikiWeb というコンセプトが好きで、そのコンセプトが含まれている Obsidian や Scrapbox が好きです。Obsidian には、obsidian-gitという Git 連携のプラグインがあります。こちらには、デスクトップだけでなく、モバイルからでも Git Commit できるようになりました。
tags: ["Obsidian"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1666099520/silver-birder.github.io/blog/anton-maksimov-5642-su-Noza-4b1xOo-unsplash.jpg
---

WikiWikiWeb というコンセプトが好きで、そのコンセプトが含まれている Obsidian や Scrapbox が好きです。Obsidian には、[obsidian-git](https://github.com/denolehov/obsidian-git) という Git 連携のプラグインがあります。こちらには、デスクトップだけでなく、モバイルからでも Git Commit できます。
そこで、私が持ってる iPhone を使って、Obsidian で Git Commit する手順を紹介します。

## 手順

1. iPhone から https://obsidian.md/ にアクセスし、アプリをダウンロード

2. アプリを開いて、Create new vault をタップ

![obsidian_1](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_1.png)

3. Vault name に、適当な名前を入力 (後で変更可能)し、Create をタップ

![obsidian_2](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_2.png)

4. 左上のサイドバーアイコン → 設定アイコン → コミュニティプラグイン → コミュニティプラグインを有効化 の順でタップ

![obsidian_3](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_3.png)

5. コミュニティプラグインを閲覧 → Git を入力 → Obsidian Git をタップし、インストール → 有効化をタップ

![obsidian_4](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_4.png)

6. オプションをタップ

![obsidian_5](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_5.png)

7. Github のアカウント、[Personal Access Token](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (repo の権限があれば良い) を入力. バツボタンをタップし、4 の画面に戻る

![obsidian_6](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_6.png)

8. 下へスクロールして、コマンドパレットを表示 → Clone と入力し、表示された選択肢をタップ

![obsidian_7](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_7.png)

9. Clone したいリポジトリ URL を入力

![obsidian_8](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_8.png)

10. Vault Root をタップ

![obsidian_9](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_9.png)

11. NO をタップ (.obsidian フォルダが repository にあるなら YES)

![obsidian_10](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_10.png)

12. Clone が成功すると、リポジトリのファイルが閲覧できる

13. Obisidian Git の Advanced に、Author name と Authr email を入力し、バツをタップ

![obsidian_12](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_12.png)

14. ファイルを適当に変更する

15. 下へスクロールし、コマンドパレットを開く → Git Open source と入力し、表示された選択肢をタップ

![obsidian_16](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_16.png)

15. +ボタンで Stage、チェックボタンで Commit、アップロードボタンで Push できる

![obsidian_15](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_400/v1666182104/silver-birder.github.io/blog/Obsidian_15.png)

## 困ったこと

- スマホから、ブランチを作成できるが Push できない
- スマホから、ローカルには存在しないリモートブランチを(pull しても)Switch できない

基本的には、スマホからの操作は、main ブランチでコミットプッシュするしかできなさそうです。

## 終わりに

これから、スマホからいろいろメモを書いていこうかなと思います！
