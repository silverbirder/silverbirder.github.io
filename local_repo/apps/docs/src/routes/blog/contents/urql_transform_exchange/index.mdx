---
title: urqlでデータ変換(transform)してみた
published: true
date: 2022-08-10
description: GraphQL クライアントを使っていると、データを取得後に変換処理がしたくなります。GraphQL クライアントの urql で、データ変換するのに、exchanges が使えそうだったので、それを共有します。
tags: ["GraphQL"]
---

GraphQL クライアントを使っていると、データ取得後にデータ変換がしたくなりませんか。私はしたくなります。
GraphQL クライアントの urql で、データ変換するのに、exchanges が使えそうだったので、それを共有します。

サンプルコードは、次のリポジトリに置いています。

https://github.com/silverbirder/urql-exchange-transform

## Exchanges

Exchanges とは、[公式ページ](https://formidable.com/open-source/urql/docs/architecture/#the-client-and-exchanges)より引用します。

> The Client itself doesn't actually know what to do with operations. Instead, it sends them through "exchanges". Exchanges are akin to middleware in Redux and have access to all operations and all results. Multiple exchanges are chained to process our operations and to execute logic on them, one of them being the fetchExchange, which as the name implies sends our requests to our API.

ざっくりいうと、GraphQL の通信フロー(リクエスト/レスポンス)にアクセスできる機構です。レスポンスにアクセスできるため、
データ変換もできます。exchanges にデータ変換を一手に引き受けるため、useQuery などクエリ発行する側で、何度も変換コードを書く必要がなくなります。

## Transform exchange

サンプルコードを紹介する前に、GraphQL のデータソースとして Pokemon を使います。
URL とクエリは、次のものを使います。

- url
  - `https://trygql.formidable.dev/graphql/basic-pokedex`

```graphql
query Pokemons {
  pokemons {
    id
    name
  }
}
```

データ変換は、次のようなコードを書きます。
map の部分が、実際のデータ変換になります。今回は、name を`toLowerCase`しています。

```javascript
export const transformExchange = ({ forward }) => {
  return (ops$) =>
    pipe(
      ops$,
      forward,
      // Sample transform code
      map((result) => {
        const { data } = result;
        if (!data || !data.pokemons) {
          return result;
        }
        const { pokemons } = data;
        result.data.pokemons = pokemons.map((pokemon) => {
          pokemon["name"] = pokemon.name.toLowerCase();
          return pokemon;
        });
        return result;
      })
    );
};
```

transformExchange 関数を urql のクライアントに渡します。

```javascript
import { createClient, fetchExchange } from "urql";
import { transformExchange } from "./transformExchange";

client = createClient({
  url: "https://trygql.formidable.dev/graphql/basic-pokedex",
  exchanges: [transformExchange, fetchExchange],
});
```

exchanges は、何も指定しない場合、[defaultExchanges](https://formidable.com/open-source/urql/docs/api/core/#defaultexchanges)が使われます。今回、必要最低限の説明のために、[defaultExchanges](https://formidable.com/open-source/urql/docs/api/core/#defaultexchanges)の内の fetchExchange だけ使いました。

あとは、次のコードのように useQuery でデータ取得すれば良いです。データ取得後のデータは、データ変換された結果になっています。

```javascript
import { useQuery } from "urql";

const PokemonsQuery = `
  query Pokemons {
    pokemons {
      id
      name
    }
  }
`;

export const Pokemons = () => {
  const [result] = useQuery({
    query: PokemonsQuery,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <ul>
      {data.pokemons.map((pokemon) => (
        <li key={pokemon.id}>{pokemon.name}</li>
      ))}
    </ul>
  );
};
```

pokemon.name が `toLowerCase` されています。

## 終わりに

urql の exchanges って、[wonka](https://github.com/kitten/wonka)という[Reason](https://reasonml.github.io/)言語で書かれたライブラリに依存しているので、調査するのが少し苦労しました。
