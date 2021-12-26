---
title: Google Apps Script で FetchAllとRedirctURL の組み合わせは悪い
published: true
date: 2020-02-24
description: Google Apps Script (以下、GAS)で、困ったことがあったので備忘録として残しておこうと思います。
tags: ["Google Apps Script", "Learning"]
cover_image: https://res.cloudinary.com/silverbirder/image/upload/v1614429255/silver-birder.github.io/blog/FetchAll_and_RedirectURL.png
socialMediaImage: https://res.cloudinary.com/silverbirder/image/upload/v1614429255/silver-birder.github.io/blog/FetchAll_and_RedirectURL.png
---

Google Apps Script (以下、GAS)で、困ったことがあったので備忘録として残しておこうと思います。

<!--  TODO: TOC -->

# やろうとしたこと

特定ハッシュタグにおける、ツイートに書いてあるリンクを集めようとしていました。
そのリンクは、特定のドメインのみでフィルタリングしたいとも思っていました。
これらをRESTful APIとして提供したかったので、手軽に作れるGASで作ろうと考えていました。

# 取り組んでみたこと

Twitterに書くリンクは、全て短縮URLになります。
そのため、短縮URLにアクセスし、リダイレクト先のURLを取りに行く必要がありました。
GASでは、リクエストメソッドであるfetchがあります。そのfetchの`followRedirects`というオプションをfalseにし、responseHeaderのlocationを取ることで、解決(リダイレクト先のURL取得が)できます。

<iframely-embed url="https://developers.google.com/apps-script/reference/url-fetch/url-fetch-app#advanced-parameters"></iframely-embed>

また、1リクエストだけをするfetchでは、直列処理になってしまうため、大変遅いです。
複数リクエストが同時にできるfeatchAllを使うことで、並列処理ができ、パフォーマンスが良いです。
要するに次のようなコードで解決しようと考えていました。

<figure title="FetchAllとRedirectURL">
<img alt="FetchAllとRedirectURL" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429255/silver-birder.github.io/blog/FetchAll_and_RedirectURL.png">
<figcaption>FetchAllとRedirectURL</figcaption>
</figure>

```typescript
let urlList: Array<string> = ['https://t.co/XXXX', 'https://t.co/YYYY'];
const locationList: Array<string> = [];
while (true) {
    const requestList: Array<URLFetchRequest> = urlList.map((url: string) => {
        return {
            url: url,
            method: 'get',
            followRedirects: false,
            muteHttpExceptions: true,
        }
    });
    const responseList: Array<HTTPResponse> = UrlFetchApp.fetchAll(requestList);
    urlList = [];
    responseList.forEach((response: HTTPResponse) => {
        const allHeaders: any = response.getAllHeaders();
        const location: string = allHeaders['Location'];
        if (location) {
            locationList.push(location);
            urlList.push(location);
        }
    });
    if (urlList.length === 0) {
        break;
    }
}
return locationList;
```

##### 追記 (20200228)

<iframely-embed url="https://developer.twitter.com/en/docs/tweets/search/api-reference/get-search-tweets"></iframely-embed>

TwitterのAPIレスポンスに `urls` がありました。説明はありませんでしたが、Tweetに貼られたリンク(短縮URLと、オリジナルURL)の情報が入るそうです。

```
"urls": [
          {
            "url": "https://t.co/Rbc9TF2s5X",
            "expanded_url": "https://twitter.com/i/web/status/1125490788736032770",
            "display_url": "twitter.com/i/web/status/1…",
            "indices": [
              117,
              140
            ]
          }
 ]
```

# 困ったこと

この手段だと、Locationを1つ1つ辿っていくことになります。
そのため、リダイレクトを自動的に追う( `followRedirects: true` )よりも、処理コストが大きいです。まあ、そこは目を瞑ります。

次です。

<iframely-embed url="https://www.monotalk.xyz/blog/google-app-script-%E3%81%AE-urlfetchapp-%E3%81%AE-%E4%BE%8B%E5%A4%96%E3%83%8F%E3%83%B3%E3%83%89%E3%83%AA%E3%83%B3%E3%82%B0%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/"></iframely-embed>

fetchやfetchAllは、`muteHttpExceptions: true` としたとしても、ExceptionErrorが発生してしまいます。
そうすると、例えば1000件のURLをfetchAllした場合、<b>どれが成功で、どれが失敗で、どれが未実施か</b> がわからないというところです。

<figure title="FetchAllとRedirectURL (Error)">
<img alt="FetchAllとRedirectURL (Error)" src="https://res.cloudinary.com/silverbirder/image/upload/v1614429297/silver-birder.github.io/blog/FetchAll_and_RedirectURL_error.png">
<figcaption>FetchAllとRedirectURL (Error)</figcaption>
</figure>

Promise.allSettled が使えれば、解決できるのかなと思いますが、現状Promiseは使えません。

私が思う解決策としては、

* fetchAllではなく、fetchを使う
* fetchAllでリクエストする件数をいくつかの塊に分ける。(一気にではなく、分ける）

# 最後に
そもそもなのですが、今回やろうとしたことってGASの良さがないですよね。
GASは、GSuites連携を簡単にできるという良さがあります。

しかし、今回はちょっとしたクローラーを作りたいだけでした。もちろん、GASでも作れると思いますが、いくつかを妥協しないといけなくなります。

もし、そこが妥協できないのであれば、別の手段を検討する必要があります。

# 教訓

* 表面的
  * fetchAllするときは、リダイレクト先URLを取得しない
* 根本的
  * 目的に適したツールを選択する

ちなみに、このツールは、並列処理をシンプルにコーティングできるgolangで書き直そうと考えています。
