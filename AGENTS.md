# AGENTS.md

## プロジェクト概要

- Turborepo + pnpm の monorepo。Next.js アプリが `apps/`、共有パッケージが `packages/` にあります。
- 主要アプリ: `apps/user` (公開サイト, static export) と `apps/admin` (管理画面, auth + tRPC)。
- UI コンポーネントは `packages/ui`、Storybook は `packages/storybook`。

## 主要ディレクトリ

- `apps/user`: Next.js (port 3000), next-intl, static export (`output: "export"`)
- `apps/admin`: Next.js (port 3001), next-intl, tRPC, better-auth
- `packages/message`: next-intl 用のメッセージ管理（原則、表示テキストはここに集約）
- `packages/ui`: 共有 UI コンポーネント (Storybook 連携あり)
- `packages/storybook`: Storybook 設定/テスト
- `packages/*-config`: ESLint / TypeScript / Vitest の共有設定
- `turbo/`: turbo gen のテンプレート

## セットアップ

- 依存関係: `pnpm install`
- Node: `>=24.x` (ルート `package.json` の engines を優先)

## よく使うコマンド

- 開発: `pnpm dev` (全体)
- ビルド: `pnpm build`
- 型チェック: `pnpm check-types`
- Lint: `pnpm lint`
- Lint 修正: `pnpm lint:fix`
- フォーマット: `pnpm format`
- テスト: `pnpm test`
- テスト更新: `pnpm test:fix`

## パッケージ単位の実行

- turbo 経由: `pnpm turbo run <task> --filter <package>`
- 例: `pnpm turbo run test --filter admin`

## Storybook

- 開発: `pnpm --filter @repo/storybook dev`
- テスト: `pnpm --filter @repo/storybook test`

## 環境変数

- `apps/admin/.env.example` を `.env` にコピーして設定。
- `apps/admin/src/env.js` のスキーマに合わせる。
- `SKIP_ENV_VALIDATION=1` で Next.js の env 検証をスキップ可能。
- `apps/user` は `NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH` で `basePath/assetPrefix` を設定。
- 追加/変更する env は `turbo.json` の `globalEnv` も更新する。

## テスト方針

- 変更したパッケージの `test` と `lint` は優先して実行。
- UI コンポーネント変更時は Storybook テストも検討。
- テストガイドラインは「Unit Test Writing Guidelines」を必ず遵守: `https://silverbirder.github.io/blog/contents/unit-test-writing-guidelines/`
- プロダクトコードを追加/変更したら対応する `*.spec.ts(x)` を必ず作成。
- ガイドライン要約:
  - AAA（Arrange→Act→Assert）を徹底。1ケース1サイクルで複数 Act/Assert を混在させない。
  - テストは仕様ドキュメントとして読みやすく。自然文のテスト名/変数名、肯定形を優先。
  - 期待値の算出に本番と同じロジックを使わない。モック値は本番に近い値を使う。
  - describe のネストは浅く（目安2階層）。条件はテスト名に織り込む。
  - 正常→準異常→異常の順で並べる。状態遷移は状態ごとに分割して検証。
  - 境界値/同値分割を網羅し、必要なら parameterized test を使う。
  - アサートは細かく明示（戻り値/DOM/モック呼び出し回数・引数まで）。
  - it.fails / it.todo / it.skip で意図を残す。完了後は除去。警告やフレークは放置しない。

## コードスタイル

- ESLint / Prettier を使用。自動整形は `pnpm format`。
- TypeScript は strict (共有 tsconfig を利用)。

## 文言（メッセージ）管理

- 画面に表示するテキスト（ボタン/見出し/説明/エラーメッセージ等）は、原則 `packages/message`（next-intl）で一元管理する。
- アプリや UI コンポーネント内に表示文字列を直書きしない（例外: テスト内の説明文字、ログ用途などユーザー向けでないもの）。
- 新しい文言を追加する場合は、まず `packages/message` にキーを追加し、各アプリからは next-intl 経由で参照する。

## 追加メモ

- ルートの `pnpm generate:feature` で新規 feature パッケージ生成。
- 汎用的なものは `packages/util` に入れる。

## コンポーネント規約

- props 型は `type Props = { };` で定義し、関数コンポーネントで受け取る。
- 例:
  type Props = { };

  export const Button = ({}: Props) => {
  }

- コンポーネント作成時は Storybook も必ず作成する。
- Story は UI stack ごとに分け、以下の状態を用意する:
  - Ideal（理想ステート）
  - Empty（エンプティステート）
  - Error（エラーステート）
  - Partial（パーシャルステート）
  - Loading（ローディングステート）

## MCP活用

本リポジトリでは、開発効率向上のため MCP（Model Context Protocol）を積極的に活用します。

### 利用時の注意

- Playwright / Storybook MCP を使う場合は、事前にサーバーを起動する
  - アプリ: `pnpm dev`
  - Storybook（必要な場合）: `pnpm --filter @repo/storybook dev`
- MCP で生成したコードも、本リポジトリのテスト方針・コーディング規約に従うこと
