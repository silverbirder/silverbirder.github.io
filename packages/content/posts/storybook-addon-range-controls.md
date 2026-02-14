---
title: 'はじめてのStorybookアドオン開発体験記'
publishedAt: '2025-08-20'
summary: 'こんにちは。先日、ちょっとしたきっかけでStorybookのアドオンをはじめて開発しました。本記事では、そのStorybookのアドオン開発の体験を共有したいと思います。'
tags: ["フロントエンド"]
index: false
---

こんにちは。
先日、ちょっとしたきっかけでStorybookのアドオンをはじめて開発しました。
本記事では、そのStorybookのアドオン開発の体験を共有したいと思います。

## 開発したアドオン

storybook-addon-range-controls というアドオンを開発しました。
npmで公開しています。

- https://www.npmjs.com/package/storybook-addon-range-controls

このアドオンは、端的にいうと Storybook上で、 **コンポーネントの文字列・数値・配列の引数を、スライダーでデータ増減できるアドオン** です。
作ろうと思ったきっかけは、StorybookのArgTypesでrangeの値を使って、 **データ増減に伴うデザイン崩れをチェック** していたのですが、
配列のスライダーをするのに少しだけコードを書く手間があり、もっと簡単にできないかというのがきっかけです。

デモは、以下のリンクで公開していますので、気になる方はぜひ触ってみてください。

- https://develop--689dd119bb72c220c0ddb738.chromatic.com

このアドオンを作るために、何をしたのかを振り返ります。

実装したコードベースは、以下で公開していますので、よければご参考ください。

- https://github.com/silverbirder/storybook-addon-range-controls

## アドオンキット

まず、Storybookのアドオンってどうやって作るのか、作った経験がない私にはわからなかったので、
以下のStorybookのドキュメントを読みました。

- https://storybook.js.org/docs/addons/writing-addons

読んでいると、以下のアドオンキットがあることに辿り着きました。

- https://github.com/storybookjs/addon-kit

これは、Storybookのアドオン開発に必要なものが最低限揃っていて、最初のとっかかりにはちょうどよかったです。

## アドオンの種類

アドオンキットを読んでいると、以下の3つの種類のアドオン開発があることを知りました。

- パネル
- ツール
- タブ

3つの種類についての説明は、以下の公式ページがわかりやすいです。

- https://storybook.js.org/docs/addons/addon-types

今回、私がなんとなく想像していたのはパネルだったので、今回はパネルを使ってみることにしました。

## パネル開発

アドオンキットでは、開発するアドオンを組み込んだStorybookを起動できる（npm run start）ようになっていて、起動させたStorybook上でアドオンの実装を進めていきます。

アドオン開発には、さまざまなAPIが用意されており、公式のドキュメントが参考になります。

- https://storybook.js.org/docs/addons/addons-api

例えば、表示しているStoryのparamtersやargsを取得するhooksなどがあります。
以下は、私が利用したhooksのコード例です。

```tsx
import React, { memo } from "react";
import type { RangeControlsParameters } from "src/types";
import { useParameter, useArgs } from "storybook/manager-api";
import { useTheme } from "storybook/theming";

import { KEY } from "../../constants";

type Props = {
  active: boolean;
};

export const Panel = memo((props: Props) => {
  const config = useParameter<RangeControlsParameters>(KEY, {});
  const theme = useTheme();
  const [args, updateArgs] = useArgs();

  return (<>...</>);
});
```

また、パネルのUI開発には、以下にあるように、コンポーネントやスタイルなどが用意されています。

- コンポーネント一覧
  - https://github.com/storybookjs/storybook/blob/da8cf2095bfde31267c11652a5f18deb4c48e192/code/core/src/components/README.md
  - emotionを使ってスタイルを書きます
- スタイル一覧
  - https://github.com/storybookjs/storybook/blob/da8cf2095bfde31267c11652a5f18deb4c48e192/code/core/src/theming/README.md
  - ダークモードの対応も可能です

上記のコンポーネントやスタイルにあるタイポグラフィやカラー、スペーシングなどを使うだけなので、
ゼロから作り上げるということはありません。また、ダークテーマの対応もできます。

以下は、私が実装したパネルのコード例です。
emotionを使ったことがある人なら、理解しやすいコードかと思います。

```tsx
// PropControl.styles.ts
import { Badge } from "storybook/internal/components";
import { styled, typography } from "storybook/theming";

export const StyledDetails = styled.details`
  border: 1px solid
    ${({ theme }) =>
      theme.base === "dark" ? theme.color.dark : theme.color.border};
  margin-bottom: ${({ theme }) => theme.layoutMargin}px;
  background: ${({ theme }) => theme.color.lightest};
`;

export const StyledSummary = styled.summary`
  padding: ${({ theme }) => theme.layoutMargin}px;
  cursor: pointer;
  font-weight: ${typography.weight.bold};
  font-size: ${typography.size.s2}px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: ${({ theme }) => theme.color.defaultText};
  background: ${({ theme }) => theme.background.content};

  &:hover {
    background: ${({ theme }) =>
      theme.base === "dark" ? theme.color.darker : theme.color.lighter};
  }
`;

export const SummaryBadge = styled(Badge)`
  margin-left: auto;
`;
```

## リリース

npmへの公開は、アドオンキットにあるGitHub Actionsの release.yml をほとんどそのまま使いました。
必要なAPIトークンは、[README](https://github.com/storybookjs/addon-kit)に書いてあるので、その通りにやれば大丈夫です。

## デモ

アドオンの使い方を示すためにデモが欲しかったので、Chromaticのサービスを使用しました。

以下のURLにデモを公開しています。

- https://develop--689dd119bb72c220c0ddb738.chromatic.com

## 困ったこと

### ホットリロードが効かない

以下のaddon-kitのissueにもあるように、ホットリロードがうまく動かないことがありました。

- https://github.com/storybookjs/addon-kit/issues/49

そのため、開発中はコード修正してリロードを繰り返していました。ちょっと面倒でしたね。

### パラメータに関数を渡せない

StorybookのParametersに関数を設定したとしても、useParameterでは関数が取得できません。
JSONシリアライズの関係かと思います。

少し強引なやり方かもしれませんが、プレビューのデコレータからだと、パラメータに関数がまだ残っているため、そのデータをパネルへ渡すようにしました。

以下のように、プレビューのデコレータで、関数入りパラメータを独自シリアライズをし、パネルではそのデータを取得するようにしました。

```tsx
// withGlobals.ts
import type {
  Renderer,
  StoryContext,
  PartialStoryFn as StoryFunction,
} from "storybook/internal/types";
import { useEffect, useChannel } from "storybook/preview-api";
import { EVENTS, KEY } from "./constants";
import { serializeFunctions } from "./utils/serialize";

export const withGlobals = (
  StoryFn: StoryFunction<Renderer>,
  context: StoryContext<Renderer>,
) => {
  const emit = useChannel({});

  useEffect(() => {
    const params = context.parameters?.[KEY];
    if (params) {
      const serialized = JSON.stringify(serializeFunctions(params));
      emit(EVENTS.PARAMETERS_SYNC, serialized);
    }
  }, [context.id, context.parameters]);

  return StoryFn();
};
```

```tsx
// preview.ts
import type { ProjectAnnotations, Renderer } from "storybook/internal/types";

import { KEY } from "./constants";
import { withGlobals } from "./withGlobals";

const preview: ProjectAnnotations<Renderer> = {
  decorators: [withGlobals],
  initialGlobals: {
    [KEY]: false,
  },
};

export default preview;
```

```tsx
// Panel.tsx
import React, { memo } from "react";
import type { RangeControlsParameters } from "src/types";
import { useChannel } from "storybook/manager-api";

import { EVENTS } from "../../constants";
import { reviveFunctions } from "../../utils/serialize";

type Props = {
  active: boolean;
};

export const Panel = memo((props: Props) => {
  useChannel({
    [EVENTS.PARAMETERS_SYNC]: (serialized: string) => {
      try {
        const parsed = JSON.parse(serialized);
        const revived = reviveFunctions<RangeControlsParameters>(parsed);
        // Do something with the revived parameters
      } catch (e) {
        console.error("Failed to deserialize parameters", e);
      }
    },
  });

  return (<>...</>);
});
```

## 最後に

Storybookのアドオン開発って、どれぐらい難しいのかなと思ったのですが、
アドオンキットのおかげで、思ったよりも簡単に開発できました。
コンポーネントやスタイルも整っているし、リリースも簡単にできましたし、素晴らしいエコシステムだなと思います。
