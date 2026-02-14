---
title: 'Testcontainersで実現する、使い捨て結合テスト環境構築とテスト実施'
publishedAt: '2025-01-03'
summary: 'みなさん、Testcontainersをご存知ですか？Testcontainersは、Dockerコンテナを利用して実際のサービスを統合テストで手軽に使用できるオープンソースのライブラリです。今回、Testcontainersを使って、GitHub Actions上でRails API、MySQL、Next.jsをDockerコンテナとして起動させ、複数のテストシナリオを独立してテストすることができました。以下はその概要図です。本記事では、このテストについての解説と学びを紹介したいと思います。'
tags: ["テスト"]
---

みなさん、Testcontainersをご存知ですか？

Testcontainersは、Dockerコンテナを利用して実際のサービスを統合テストで手軽に使用できるオープンソースのライブラリです。
今回、Testcontainersを使って、GitHub Actions上でRails API、MySQL、Next.jsをDockerコンテナとして起動させ、複数のテストシナリオを独立してテストすることができました。以下はその概要図です。本記事では、このテストについての解説と学びを紹介したいと思います。

![概要図](https://res.cloudinary.com/silverbirder/image/upload/v1735639067/silver-birder.github.io/blog/testcontainers-overview.png)

動くコードは、[こちらのリポジトリ](https://github.com/silverbirder/testcontainers-rails-nextjs)にありますので、ご参考にしてください。
GitHub Actionsのテストログは、[こちら](https://github.com/silverbirder/testcontainers-rails-nextjs/actions/workflows/e2e.yml)にあります。

ちなみに、過去にTestcontainersに関するブログ記事を書いていたので、そちらもよろしければお読みください。

https://zenn.dev/silverbirder/articles/bcf9ae9b496a15

## Testcontainersを使用する対象

Testcontainersは、コンテナで管理されているサービスに対してテストを行うことができます。一方、コンテナで管理されていないサービスについても、以下のリンクにあるモジュールライブラリを利用することでテストが可能な場合があります。

- [Modules | Testcontainers](https://testcontainers.com/modules/)

Testcontainersのモジュールライブラリには、MySQL、Apache Kafka、Vaultなど、事前に構成済みのテストコンテナが提供されています。これらのモジュールにないサービスについても、[GenericContainer](https://testcontainers.com/getting-started/#genericcontainer-abstraction) と呼ばれる汎用コンテナを使用することで、独自のイメージを利用したテストが可能です。

さらに、Testcontainersをサポートするプログラミング言語は、執筆時点で以下の通りです。

- Java
- Go
- .NET
- Node.js
- Clojure
- Elixir
- Haskell
- Python
- Ruby
- Rust

※ [Supported languages and prerequisites | Testcontainers](https://testcontainers.com/getting-started/#supported-languages-and-prerequisites)

今回は、Node.jsを使用して検証を行います。

## 今回のテスト対象

[前回の記事](https://zenn.dev/silverbirder/articles/bcf9ae9b496a15)では、[T3 Stack](https://create.t3.gg/) を使用して構築したアプリケーションでテストを行いました。このアプリケーションは、Next.js、tRPC、Prismaで構成されており、Testcontainersで扱うDockerコンテナはNext.jsとMySQLの2つだけでした。そのため、Testcontainersに慣れるには良い経験となりました。しかし、実際の業務ではフロントエンドとバックエンドを分離した開発が多く見られるかと思います。

そこで今回は、フロントエンドとバックエンドを分離した以下の構成でテストを行いました。

- バックエンド: API
  - Dockerコンテナ
    - Rails API
    - MySQL
  - docker-composeで管理
- フロントエンド: Web
  - Dockerコンテナ
    - Next.js
  - Dockerfileで管理

使用している技術スタックやライブラリは一例に過ぎず、Dockerコンテナで管理されていれば、どのような技術でも適用可能だと考えています。

テスト対象のアプリケーションは、TodoMVC風のアプリケーションとしました。ブラウザからAPI経由でTodoデータを取得・表示し、データをDBに保存する機能を備えています。以下が、画面のイメージです。

![Todo App](https://res.cloudinary.com/silverbirder/image/upload/v1735639029/silver-birder.github.io/blog/testcontainers-todo-app.png)

`Save All`ボタンをクリックすると、データがDBに保存されます。

## テスト方法

今回は、以下のテストファイルを作成し、Testcontainersを使用してテストを行います。

- `health.test.ts`
  - ヘルスチェック  
    - DBに指定のデータベースおよびテーブルが存在するかを確認
    - RailsのAPIエンドポイントにGETリクエストを送り、ステータスコード200を確認
    - Next.jsのサーブURLにブラウザでアクセスし、ページタイトルを確認
- `integration.test.ts`
  - Todo Appの結合テスト
    - ブラウザ操作でTodoを追加・保存し、DBに正しく保存されていることを確認

各テストは、Testcontainersを使ってAPIやWebのDockerコンテナを独立して起動させます。テストが終了すると、Dockerコンテナは削除されます。Dockerコンテナは、テストで使い終わったら削除する、つまり **コンテナは使い捨て** です。再掲になりますが、以下の図が今回のテストの概要図です。

![概要図](https://res.cloudinary.com/silverbirder/image/upload/v1735639067/silver-birder.github.io/blog/testcontainers-overview.png)

それでは、概要図にあるSetup・Teardown、Testについて紹介していきます。

## Setup・Teardown

まずは、SetupとTeardownについて説明します。Setupでは、主に以下のことを行います。

1. APIおよびWebの各Dockerコンテナを起動
1. APIおよびWebの各コンテナへのアクセスURLやオブジェクトを返す
1. テスト終了後にDockerコンテナを停止するTeardownを提供

Setupは、Vitestでいう`beforeAll`や`beforeEach`のように、テスト実行前に動作することを想定しています。各テスト内でDockerコンテナは、ボリュームなどを共有せずに独立して起動します。
Teardownは、Vitestでいう`afterAll`や`afterEach`のように、テスト実行後に動作することを想定しています。

どうしてもコンテナの起動・停止が重たくなる場合は、`globalSetup`や`globalTeardown`のような仕組みを利用し、Dockerコンテナをシングルトンとして起動・停止する方法もあります。

それでは、具体的なコードを紹介していきます。

### APIのSetup・Teardown

まずは、APIのSetupとTeardownについて説明します。以下に該当するコードをご覧ください。

```ts
// setup/api.ts
import path from "path";
import { DockerComposeEnvironment, RandomUuid } from "testcontainers";
import { writeFileSync, unlinkSync } from "fs";
import { join } from "path";

const API_PORT = 3000;

export const setupApiContainer = async () => {
  const apiPath = path.resolve(__dirname, "../../../apps/api");
  const apiComposeFileName = "docker-compose.yml";
  const uuid = new RandomUuid();
  const containerSuffix = `_${uuid.nextUuid()}`;
  const apiEnvironment = await new DockerComposeEnvironment(
    apiPath,
    apiComposeFileName
  )
    .withEnvironment({
      CONTAINER_SUFFIX: containerSuffix,
    })
    .up();

  const apiContainer = apiEnvironment.getContainer(
    `testcontainers_api${containerSuffix}`
  );
  const dbContainer = apiEnvironment.getContainer(
    `testcontainers_api_db${containerSuffix}`
  );

  const networks = apiContainer.getNetworkNames();
  const networkName = networks[0] ?? "";
  const ip = apiContainer.getIpAddress(networkName);
  const host = apiContainer.getHost();
  const port = apiContainer.getMappedPort(API_PORT);

  const executeSqlFile = async (sqlContent: string, fileName: string) => {
    const tempSqlFile = join(__dirname, fileName);
    writeFileSync(tempSqlFile, sqlContent, "utf-8");
    try {
      await dbContainer.copyFilesToContainer([
        { source: tempSqlFile, target: `/temp.sql` },
      ]);
      const result = await dbContainer.exec([
        "mysql",
        "-uroot",
        "-proot",
        "-e",
        "source /temp.sql",
      ]);
      return result.output.trim();
    } finally {
      unlinkSync(tempSqlFile);
    }
  };

  return {
    apiContainer,
    dbContainer,
    executeSqlFile,
    apiInternalUrl: `http://${ip}:${API_PORT}`,
    apiPublicUrl: `http://${host}:${port}`,
    networkName,
    teardown: async () => {
      await apiEnvironment.down({ removeVolumes: true });
    },
  };
};
```

`DockerComposeEnvironment`は、docker-composeを起動するためのクラスです。各コンテナは`apiContainer`や`dbContainer`という変数で定義されており、これらに対して`exec`コマンドなどを実行することが可能です。`networkName`は、APIとWebを同一ネットワークにするために使用されます（Webのセットアップ時に利用）。Teardown時には、`apiEnvironment.down`を使用してdocker-composeを停止します。

上記で参照している`docker-compose.yml`は、以下の内容です。

```yml
services:
  db:
    image: mysql:8.0
    container_name: "testcontainers_api_db${CONTAINER_SUFFIX}"
    environment:
      DATABASE_USERNAME: root
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: api_development
    healthcheck:
      test: mysqladmin ping -h 127.0.0.1 -u$$MYSQL_USER -p$$MYSQL_PASSWORD
      interval: 10s
      timeout: 10s
      retries: 3
      start_period: 30s
    ports:
      - ":3306"
    volumes:
      - db_data:/var/lib/mysql
  api:
    build:
      context: .
    container_name: "testcontainers_api${CONTAINER_SUFFIX}"
    depends_on:
      db:
        condition: service_healthy
    ports:
      - "${API_PORT-}:3000"
    environment:
      DATABASE_HOST: db
      DATABASE_USERNAME: root
      DATABASE_PASSWORD: root
      DATABASE_PORT: 3306
volumes:
  db_data:
```

**重要なポイント** として、`ports`の設定があります。`"${API_PORT-}:3000"`は、`API_PORT`という環境変数が設定されていない場合、ホスト側のポートが動的に決定されます。デフォルト値を指定したい場合は、`"${API_PORT:-3000}:3000"`のように記述します。ホスト側のポートを固定すると、同じポートを利用する複数のコンテナを起動できず、テストが失敗する可能性があるため、動的ポートを使用しています。

工夫している点として、`container_name`の設定があります。Testcontainersでは、docker-composeで起動する際にサービスへのアクセスにコンテナ名を使用します。そのため、コンテナ名を明示的に指定しています。ただし、同じ名前のコンテナを複数起動できないため、環境変数でランダムな接尾辞を付与する仕組みを採用しています。

また、`depends_on`を指定していますが、デフォルトではDBの起動完了を待たずにRailsが接続を試みて失敗することがありました。そこで、`healthcheck`を追加してDBの起動完了を確認するようにしています。

`ports`のホスト側を固定しない設計については、Testcontainersのベストプラクティスを参考にしています。その他のTestcontainersのベストプラクティスについては、以下のリンクをご参照ください。

- [Testcontainers のベスト プラクティス | Docker](https://www.docker.com/ja-jp/blog/testcontainers-best-practices/)

### WebのSetup・Teardown

次に、WebのSetupとTeardownについて説明します。以下に該当するコードをご覧ください。

```ts
// setup/web.ts
import path from "path";
import { GenericContainer, RandomUuid } from "testcontainers";

const WEB_PORT = 3200;

export const setupWebContainer = async (
  apiInternalUrl,
  apiPublicUrl,
  networkName
) => {
  const webPath = path.resolve(__dirname, "../../../apps/web");
  const uuid = new RandomUuid();
  const containerSuffix = `${uuid.nextUuid()}`;
  const webContainer = await (
    await GenericContainer.fromDockerfile(webPath)
      .withBuildArgs({
        API_URL: apiInternalUrl,
        NEXT_PUBLIC_API_URL: apiPublicUrl,
      })
      .build(`web:${containerSuffix}`, { deleteOnExit: true })
  )
    .withExposedPorts(WEB_PORT)
    .withNetworkMode(networkName)
    .start();

  const webPort = webContainer.getMappedPort(WEB_PORT);
  const webHost = `http://${webContainer.getHost()}:${webPort}`;

  return {
    webContainer,
    webHost,
    teardown: async () => {
      await webContainer.stop({ remove: true, removeVolumes: true });
    },
  };
};
```

Web側では、シンプルなDockerのみを使用するため、`GenericContainer.fromDockerfile`を利用しています。イメージをビルドする際に`apiInternalUrl`と`apiPublicUrl`を渡すことで、Next.jsのSSR時およびCSR時のフェッチを確認できるようにしています。

また、Webへのアクセスを可能にするために`webHost`を`return`で返しています。Teardown時にはコンテナを停止しています。

それでは、いよいよテストのコードについて紹介します。

## Test

### ヘルスチェック

ヘルスチェックのテストコードを紹介します。

```ts
import { chromium } from "@playwright/test";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import axios from "axios";
import { StartedTestContainer } from "testcontainers";
import { setupApiContainer, setupWebContainer } from "../setup";

describe("Health check", () => {
  let apiContainer: StartedTestContainer;
  let dbContainer: StartedTestContainer;
  let webContainer: StartedTestContainer;
  let apiPublicUrl: string;
  let apiInternalUrl: string;
  let executeSqlFile: (sqlContent: string, fileName: string) => Promise<string>;
  let webHost: string;
  let teardownApi: () => Promise<void>;
  let teardownWeb: () => Promise<void>;

  beforeAll(async () => {
    const apiSetup = await setupApiContainer();
    apiContainer = apiSetup.apiContainer;
    apiInternalUrl = apiSetup.apiInternalUrl;
    apiPublicUrl = apiSetup.apiPublicUrl;
    const networkName = apiSetup.networkName;
    dbContainer = apiSetup.dbContainer;
    executeSqlFile = apiSetup.executeSqlFile;
    teardownApi = apiSetup.teardown;

    const webSetup = await setupWebContainer(
      apiInternalUrl,
      apiPublicUrl,
      networkName
    );
    webContainer = webSetup.webContainer;
    webHost = webSetup.webHost;
    teardownWeb = webSetup.teardown;
  });

  afterAll(async () => {
    await teardownWeb();
    await teardownApi();
  });

  it("should perform a DB health check", async () => {
    // Arrange
    const checkDatabaseSQL = "SHOW DATABASES LIKE 'api_development';";

    // Act
    const dbCheckOutput = await executeSqlFile(
      checkDatabaseSQL,
      "check_database.sql"
    );
    // Assert
    expect(dbCheckOutput).toContain("api_development");

    // Arrange
    const checkTableSQL = "SHOW TABLES IN api_development LIKE 'todos';";

    // Act
    const tableCheckOutput = await executeSqlFile(
      checkTableSQL,
      "check_table.sql"
    );

    // Assert
    expect(tableCheckOutput).toContain("todos");
  });

  it("should perform an API health check", async () => {
    // Arrange
    const todosEndpoint = `${apiPublicUrl}/todos`;

    // Act
    const response = await axios.get(todosEndpoint);

    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  it("should perform a web health check", async () => {
    // Arrange
    const todosPageUrl = `${webHost}`;

    // Act
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(todosPageUrl);

    // Assert
    expect(await page.title()).toBe("Create Next App");
  });
});
```

先ほど紹介したSetupは、`beforeAll`および`afterAll`で使用しています。

DBのヘルスチェックでは、`executeSqlFile`を使用してデータベース名とテーブル名を確認しています。Dockerに対して`exec`コマンドを用いてテストを行っています。

APIのヘルスチェックでは、`apiPublicUrl`を利用してエンドポイントのステータスおよびレスポンスデータをテストしています。

Webのヘルスチェックでは、`webHost`を使用してPlaywrightでChromiumを起動し、`page.title`をテストしています。

### 結合テスト

Todo Appの結合テストについて紹介します。

```ts
import { describe, it, beforeAll, afterAll, beforeEach, expect } from "vitest";
import { StartedTestContainer } from "testcontainers";
import { setupApiContainer, setupWebContainer } from "../setup";
import { chromium } from "@playwright/test";
import { TodoPage } from "../pages";

describe("Integration Test", () => {
  let apiContainer: StartedTestContainer;
  let webContainer: StartedTestContainer;
  let apiPublicUrl: string;
  let apiInternalUrl: string;
  let webHost: string;
  let teardownApi: () => Promise<void>;
  let teardownWeb: () => Promise<void>;

  beforeAll(async () => {
    const apiSetup = await setupApiContainer();
    apiContainer = apiSetup.apiContainer;
    apiInternalUrl = apiSetup.apiInternalUrl;
    apiPublicUrl = apiSetup.apiPublicUrl;
    const networkName = apiSetup.networkName;
    teardownApi = apiSetup.teardown;

    const webSetup = await setupWebContainer(
      apiInternalUrl,
      apiPublicUrl,
      networkName
    );
    webContainer = webSetup.webContainer;
    webHost = webSetup.webHost;
    teardownWeb = webSetup.teardown;
  });

  afterAll(async () => {
    await teardownWeb();
    await teardownApi();
  });

  beforeEach(async () => {
    await apiContainer.exec(["bin/rails", "runner", "Todo.delete_all"]);
  });

  it("should allow adding, toggling, and deleting a todo item successfully", async () => {
    // Arrange
    const todosPageUrl = `${webHost}`;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const todoPage = new TodoPage(page);
    await todoPage.navigate(todosPageUrl);

    // Act
    const newTodo = "new Todo";
    await todoPage.addTodo(newTodo);
    await todoPage.toggleTodo(newTodo);
    await todoPage.deleteTodoByName(newTodo);

    // Assert
    const todos = await todoPage.getTodos();
    expect(todos).toHaveLength(0);

    await browser.close();
  });

  it("should save a todo item and persist it after reload", async () => {
    // Arrange
    const todosPageUrl = `${webHost}`;
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const todoPage = new TodoPage(page);
    await todoPage.navigate(todosPageUrl);

    // Act
    const newTodo = "persistent Todo";
    await todoPage.addTodo(newTodo);
    await todoPage.saveAllTodos();
    await page.waitForTimeout(1000); // BAD!
    await todoPage.navigate(todosPageUrl);

    // Assert
    // Web
    const todos = await todoPage.getTodos();
    expect(todos).toHaveLength(1);
    expect(todos[0]).toEqual({ name: newTodo, checked: false });
    // Rails
    const result = await apiContainer.exec([
      "bin/rails",
      "runner",
      "puts Todo.all.to_json",
    ]);
    const railsTodos = JSON.parse(result.output.trim());
    expect(railsTodos).toHaveLength(1);
    expect(railsTodos[0].name).toBe(newTodo);
    expect(railsTodos[0].checked).toBe(false);

    await browser.close();
  });
});
```

テストを実行する前に、`beforeEach`で各テストの前に`await apiContainer.exec(["bin/rails", "runner", "Todo.delete_all"]);`を実行し、 **データを削除しています** 。
この状態でPlaywrightを使用して、ブラウザ上でのテストを実施します。さらに、`apiContainer.exec`を用いて **データのテストも行っています** 。

上記のテストのように、 **コンテナに直接アクセスできる** ため、Railsのコマンド実行やDBのデータ確認が可能です。これにより、単純にPlaywrightで結合テストを行うだけでなく、 **必要に応じてデータの加工や準備も容易に行えます** 。データだけでなく、コンテナに対して柔軟な操作をすることができます。(例えば、日付の変更、バッチの起動、イベントの発火など)
結合テストではデータ準備やメンテナンスが課題となりますが、必要なデータのみを用意することで、メンテナンス負荷を軽減できます。

#### TestContainersのよさ

[What is Testcontainers, and why should you use it? | Testcontainers](https://testcontainers.com/guides/introducing-testcontainers/) でも述べられている通り、従来の統合テスト環境ではテストデータの管理が煩雑でした。特定のシナリオをテストするとテストデータが変更され、別のシナリオテストが失敗するなど、データの干渉が課題となっていました。これらの問題を解決してくれたのが、Testcontainersです。

さらに、結合テスト環境のインフラ維持やメンテナンスの手間も大きな悩みの種でした。Testcontainersを利用することで、特別な結合テスト環境を用意する必要がなくなり、 **テストのたびに環境が自動的に構築・削除されます** 。これにより、コスト面でも効率的であり、より安定したテスト環境を実現できます。

#### Page Object Model

`TodoPage` については、[Page Object Model](https://playwright.dev/docs/pom)を採用しています。そのため、以下のようなTodoページに対するクラスを作成しています。

```ts
import { Locator, Page } from "@playwright/test";

export class TodoPage {
  page: Page;
  newTodoInput: Locator;
  addButton: Locator;
  todoCheckbox: (name: string) => Locator;
  deleteButton: (name: string) => Locator;
  saveAllButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodoInput = page.getByPlaceholder("Add a new todo");
    this.addButton = page.getByRole("button", { name: "Add" });
    this.todoCheckbox = (todoName) =>
      page
        .locator(".todo-list li")
        .filter({ hasText: todoName })
        .getByRole("checkbox");
    this.deleteButton = (todoName) =>
      page
        .locator(".todo-list li")
        .filter({ hasText: todoName })
        .getByRole("button");
    this.saveAllButton = page.getByRole("button", { name: "Save All" });
  }

  /**
   * Navigate to the Todo app.
   */
  async navigate(url: string) {
    await this.page.goto(url);
  }

  /**
   * Add a new todo item.
   */
  async addTodo(text: string) {
    await this.newTodoInput.fill(text);
    await this.addButton.click();
  }

  /**
   * Toggle a todo item by its name.
   */
  async toggleTodo(todoName: string) {
    const checkbox = this.todoCheckbox(todoName);
    await checkbox.check();
  }

  /**
   * Delete a todo item by its name.
   */
  async deleteTodoByName(todoName: string) {
    const deleteBtn = this.deleteButton(todoName);
    await deleteBtn.click();
  }

  /**
   * Save all todos.
   */
  async saveAllTodos() {
    await this.saveAllButton.click();
  }

  /**
   * Get all visible todo items with their names and checked status.
   */
  async getTodos() {
    const todoItems = this.page.locator(".todo-list li");
    const results: { name: string; checked: boolean }[] = [];
    const itemsCount = await todoItems.count();

    for (let i = 0; i < itemsCount; i++) {
      const todo = todoItems.nth(i);
      const name = await todo.locator("span").textContent();
      const checked = await todo.locator("input[type='checkbox']").isChecked();
      results.push({ name: name?.trim() || "", checked });
    }

    return results;
  }
}
```

蛇足になりますが、テストサイクルを高速化するために、`TodoPage`オブジェクトの検証には`examples`フォルダを用意しています。このフォルダでは、対象ページを`playwright codegen`で開き、操作手順を自動生成しながらアクセス方法を確認・テストします。問題がないことを確認できた段階で、これらの操作を結合テストに組み込むことで、`TodoPage`の個別テストを省略することが可能になります。

## 終わりに

いかがだったでしょうか。Testcontainersの魅力に気づきましたでしょうか。
ぜひ、結合テストの1つに利用してみてください。

## 参考

- [Getting Started | Testcontainers](https://testcontainers.com/getting-started/)
- [Getting started with Testcontainers for Node.js | Testcontainers](https://testcontainers.com/guides/getting-started-with-testcontainers-for-nodejs/)
- [Search for Testcontainers | Docker](https://www.docker.com/search/?_sf_s=Testcontainers)
