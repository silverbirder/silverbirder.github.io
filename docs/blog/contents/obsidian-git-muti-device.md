---
title: ObsidianでiPhoneからGit Commitする
published: true
date: 2022-10-18
description: XX
tags: ["Obsidian"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1666099520/silver-birder.github.io/blog/anton-maksimov-5642-su-Noza-4b1xOo-unsplash.jpg
---

WikiWikiWebというコンセプトが好きで、そのコンセプトが含まれているObsidianやScrapboxが好きです。Obsidianには、[obsidian-git](https://github.com/denolehov/obsidian-git) というGit連携のプラグインがあります。こちらには、デスクトップだけでなく、モバイルからでもGit Commit できるようになりました。
そこで、私が持ってるiPhoneから、ObsidianでGit Commitする手順を紹介します。


## 手順

1. iPhone から https://obsidian.md/ にアクセスし、アプリをダウンロードする
2. アプリを開いて、Create new vault をタップする
![obsidian_1](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_1.png)
3. Vault name に、適当な名前を入力 (後で変更可能)し、Create をタップする
![obsidian_2](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_2.png)
4. 左上のアイコン → 設定アイコン → コミュニティプラグイン → コミュニティプラグインを有効化 の順でタップ
![obsidian_3](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_3.png)

5. コミュニティプラグインを閲覧 → Git を入力 → Obsidian Git をタップし、インストール → 有効化をタップ
![obsidian_4](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_4.png)

6.  オプションをタップ
![obsidian_5](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_5.png)

7. Githubのアカウント、[Personal Access Token](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) (repoの権限があれば良い) を入力. バツボタンをタップし、4の画面に戻る
![obsidian_6](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_6.png)

8. 下へスクロールして、コマンドパレットを表示 → Cloneと入力し、表示された選択肢をタップ
![obsidian_7](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_7.png)
9. cloneしたいリポジトリURLを入力
![obsidian_8](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_8.png)

10. Vault Root をタップ
![obsidian_9](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_9.png)
11. NO をタップ (.obsidianフォルダがrepositoryにあるならYES)
![obsidian_10](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_10.png)

12. cloneが成功すると、Repositoryのファイルが閲覧できる
13. Obisidian Git のAdvancedに、Author nameとAuthr emailを入力し、バツをタップ
![obsidian_12](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_12.png)

14. ファイルを適当に変更する
15. 下へスクロールし、コマンドパレットを開く → Git source control と入力し、表示された選択肢をタップ
![obsidian_13](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_13.png)

15. +ボタンでStage、チェックボタンでCommit、アップロードボタンでPush する
![obsidian_14](https://res.cloudinary.com/silverbirder/image/upload/c_scale,w_200/v1666182104/silver-birder.github.io/blog/Obsidian_14.png)


## 困ったこと

* スマホから、ブランチを作成できるがPushできない
* スマホから、ローカルには存在しないリモートブランチを(pullしても)Switchできない

基本的には、スマホからの操作は、mainブランチでコミットプッシュするしかなさそうです。

## 終わりに

これから、スマホからいろいろメモを書いていこうかなと思います！