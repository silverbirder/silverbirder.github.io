import { DeviconGitbook } from "@/components/_icons/devicon";
import { FileIconsDigdag } from "@/components/_icons/file";
import { LogosGoogleCloudPlatform } from "@/components/_icons/icon";
import {
  LogosAlgolia,
  LogosAmpIcon,
  LogosAnsible,
  LogosApache,
  LogosAws,
  LogosBootstrap,
  LogosCakephpIcon,
  LogosChromaticIcon,
  LogosChromeWebStore,
  LogosCircleci,
  LogosCloudflareWorkersIcon,
  LogosCloudinaryIcon,
  LogosCucumber,
  LogosDatadog,
  LogosDependabot,
  LogosDockerIcon,
  LogosElectron,
  LogosExpoIcon,
  LogosExpress,
  LogosFigma,
  LogosFlask,
  LogosGithubActions,
  LogosGithubIcon,
  LogosGo,
  LogosGoogleAnalytics,
  LogosGoogleMaps,
  LogosGoogleTagManager,
  LogosGraphql,
  LogosGravatarIcon,
  LogosGulp,
  LogosHugo,
  LogosJavascript,
  LogosJenkins,
  LogosJest,
  LogosJquery,
  LogosKubernetes,
  LogosLighthouse,
  LogosLitIcon,
  LogosMadge,
  LogosMaterialUi,
  LogosMemcached,
  LogosMsw,
  LogosMysqlIcon,
  LogosNetlifyIcon,
  LogosNextjsIcon,
  LogosNginx,
  LogosNodejsIcon,
  LogosOpenaiIcon,
  LogosPandacssIcon,
  LogosPartytownIcon,
  LogosPhp,
  LogosPlaywright,
  LogosPuppeteer,
  LogosPwa,
  LogosPython,
  LogosQwikIcon,
  LogosRails,
  LogosReact,
  LogosRollbarIcon,
  LogosRust,
  LogosSentryIcon,
  LogosSlackIcon,
  LogosSonarqube,
  LogosStorybookIcon,
  LogosTerraformIcon,
  LogosTestingLibrary,
  LogosTurborepoIcon,
  LogosTypescriptIcon,
  LogosVercel,
  LogosVitest,
  LogosWebcomponents,
  LogosWebpack,
} from "@/components/_icons/logos";
import {
  OriginalApacheBeam,
  OriginalBigQuery,
  OriginalUrql,
  OriginalVarnish,
} from "@/components/_icons/original";
import { SimpleIconsFluentd } from "@/components/_icons/simple";
import {
  SkillIconsEmotionLight,
  SkillIconsRocket,
} from "@/components/_icons/skillicon";
import { TablerBrandReactNative } from "@/components/_icons/tablericon";

const reactSkill = {
  name: "React",
  icon: LogosReact,
  description: "フロントエンドで一番よく使うやつ。",
};
const jestSkill = {
  name: "Jest",
  icon: LogosJest,
  description: "テストといえばこれ。これなしじゃ落ち着かない。",
};
const playwrightSkill = {
  name: "Playwright",
  icon: LogosPlaywright,
  description: "ブラウザ操作で真っ先に使うツール。",
};
const storybookSkill = {
  name: "Storybook",
  icon: LogosStorybookIcon,
  description: "フロント開発の相棒。UI作るならこれがあると便利。",
};
const figmaSkill = {
  name: "Figma",
  icon: LogosFigma,
  description: "デザイナーと一緒に作業するときに欠かせないツール。",
};

export const topSkills = [
  reactSkill,
  jestSkill,
  playwrightSkill,
  storybookSkill,
  figmaSkill,
];

export const skillCategories = [
  {
    name: "フロントエンド",
    skills: [
      {
        name: "Accelerated Mobile Pages (AMP)",
        icon: LogosAmpIcon,
        description:
          "Googleが推すAMPを試して、自サイトを対応させたことがある。",
      },
      {
        name: "Bootstrap",
        icon: LogosBootstrap,
        description: "Webデザインを手軽に統一するためのツールキット。",
      },
      {
        name: "Electron",
        icon: LogosElectron,
        description: "デスクトップアプリ開発で遊んでた。Tauriも気になる。",
      },
      figmaSkill,
      {
        name: "Gulp",
        icon: LogosGulp,
        description:
          "ビルドやタスク管理を楽にするツール。webpackとセットで使うこと多い。",
      },
      {
        name: "Hugo",
        icon: LogosHugo,
        description:
          "静的サイトを作るジェネレーター。自分のサイトで使用したことがある。",
      },
      {
        name: "jQuery",
        icon: LogosJquery,
        description: "初めて使ったフロントエンドライブラリ。懐かしさがある。",
      },
      {
        name: "JavaScript",
        icon: LogosJavascript,
        description: "一番使い慣れてる言語。何か始めるときはまずこれ。",
      },
      {
        name: "Lit",
        icon: LogosLitIcon,
        description: "Webコンポーネントを簡単に使えるライブラリ。",
      },
      {
        name: "Madge",
        icon: LogosMadge,
        description: "モジュールの依存関係が見える化でき、リファクタに使える。",
      },
      {
        name: "Material-UI",
        icon: LogosMaterialUi,
        description: "これ使うだけで無難なデザインになる。",
      },
      {
        name: "Next.js",
        icon: LogosNextjsIcon,
        description: "React使うならNext.jsが定番フレームワーク。",
      },
      {
        name: "Panda CSS",
        icon: LogosPandacssIcon,
        description:
          "ゼロランタイムのCSS-in-JSライブラリ。自サイトに使ってた。",
      },
      {
        name: "Partytown",
        icon: LogosPartytownIcon,
        description:
          "Webワーカーに処理を移してブラウザを軽くするツール。自サイトに使ってた。",
      },
      {
        name: "Progressive Web Apps (PWA)",
        icon: LogosPwa,
        description: "PWAでネイティブアプリっぽいWebアプリが作れる。",
      },
      {
        name: "Qwik",
        icon: LogosQwikIcon,
        description:
          "必要な時だけロードするフレームワーク。自分のサイトに使ってた。",
      },
      reactSkill,
      {
        name: "React Native",
        icon: TablerBrandReactNative,
        description: "Reactのクロスプラットフォーム版。条件次第で選ぶ感じ。",
      },
      storybookSkill,
      {
        name: "Turborepo",
        icon: LogosTurborepoIcon,
        description: "モノレポのビルドシステム。キャッシュが効いて速い。",
      },
      {
        name: "TypeScript",
        icon: LogosTypescriptIcon,
        description: "JavaScriptで中・大規模開発ならほぼ必須。",
      },
      {
        name: "urql",
        icon: OriginalUrql,
        description: "軽量なGraphQLクライアント。",
      },
      {
        name: "Webpack",
        icon: LogosWebpack,
        description:
          "モジュールをまとめるツール。プロジェクトでよく出番がある。",
      },
      {
        name: "Web Components",
        icon: LogosWebcomponents,
        description: "標準技術でUIコンポーネントを作る。推し",
      },
      {
        name: "emotion",
        icon: SkillIconsEmotionLight,
        description: "CSS-in-JSするならReactでよく使う。",
      },
      {
        name: "Rocket",
        icon: SkillIconsRocket,
        description: "静的ページを作るツール。MarkdownとWeb Components対応。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "バックエンド",
    skills: [
      {
        name: "CakePHP",
        icon: LogosCakephpIcon,
        description:
          "MVCを学んだフレームワーク。初めての業務開発はこれだった。",
      },
      {
        name: "Express.js",
        icon: LogosExpress,
        description: "はじめてプログラミングを学んだNode.jsと一緒に学んだ。",
      },
      {
        name: "Flask",
        icon: LogosFlask,
        description: "PythonでWebアプリ作るならこれ。Djangoも触ったことあり。",
      },
      {
        name: "Go",
        icon: LogosGo,
        description: "マイクロサービス開発で使ってた。好き嫌いが分かれる言語。",
      },
      {
        name: "GraphQL",
        icon: LogosGraphql,
        description: "クライアント側だけでの使用経験あり。",
      },
      {
        name: "Node.js",
        icon: LogosNodejsIcon,
        description: "初めて触ったプログラミング言語。C10Kって後から知った。",
      },
      {
        name: "PHP",
        icon: LogosPhp,
        description:
          "昔、業務システムをPHPで作った。テストも型もなかった時代。",
      },
      {
        name: "Python",
        icon: LogosPython,
        description: "入社先の会社で使われてた言語。機械学習はやってない。",
      },
      {
        name: "Ruby on Rails",
        icon: LogosRails,
        description:
          "スタートアップでよく登場。何度かキャッチアップして使ってた。",
      },
      {
        name: "Rust",
        icon: LogosRust,
        description: "所有権の考え方が面白かった言語。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "インフラ・ミドルウェア",
    skills: [
      {
        name: "Ansible",
        icon: LogosAnsible,
        description: "ミドルウェアのセットアップが超便利になった。",
      },
      {
        name: "Apache HTTP Server",
        icon: LogosApache,
        description: "最初に学んだWebサーバ技術。",
      },
      {
        name: "Amazon Web Services (AWS)",
        icon: LogosAws,
        description:
          "初めて使ったクラウド。画面ぽちぽちでサーバ建てられて感動。",
      },
      {
        name: "Digdag",
        icon: FileIconsDigdag,
        description: "シンプルで使いやすいワークフローエンジン。",
      },
      {
        name: "Docker",
        icon: LogosDockerIcon,
        description: "コンテナで開発するのは、最初は衝撃的だった。",
      },
      {
        name: "Fluentd",
        icon: SimpleIconsFluentd,
        description: "WebサーバのログをGoogle Loggingに送ってた。",
      },
      {
        name: "Google Cloud Platform (GCP)",
        icon: LogosGoogleCloudPlatform,
        description: "BigQueryとCloud Runが大好き！",
      },
      {
        name: "Kubernetes",
        icon: LogosKubernetes,
        description: "自宅のRaspberry Piでk8s環境を作って遊んでた。",
      },
      {
        name: "Memcached",
        icon: LogosMemcached,
        description: "業務で必要になって少し調べたけど、詳しくない。",
      },
      {
        name: "Nginx",
        icon: LogosNginx,
        description: "業務で必要になって少し調べたけど、詳しくない。",
      },
      {
        name: "Terraform",
        icon: LogosTerraformIcon,
        description:
          "インフラをコードで管理するのが快感。state管理はちょっと怖い。",
      },
      {
        name: "Varnish Cache",
        icon: OriginalVarnish,
        description: "業務で少し触ったけど、そこまで詳しくない。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "データ",
    skills: [
      {
        name: "Apache Beam",
        icon: OriginalApacheBeam,
        description:
          "Dataflowでデータパイプライン構築に使った。大規模データでもスケールする。",
      },
      {
        name: "BigQuery",
        icon: OriginalBigQuery,
        description: "1年以上使ってた。毎日SQLをひたすら書いてた感じ。",
      },
      {
        name: "MySQL",
        icon: LogosMysqlIcon,
        description:
          "知識はあるけど、そこまでDB業務に深く関わってない。必要な時に使う程度。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "テスト",
    skills: [
      {
        name: "Cucumber",
        icon: LogosCucumber,
        description: "ATDDのためには欠かせない。受け入れテストに必須。",
      },
      jestSkill,
      {
        name: "Mock Service Worker (MSW)",
        icon: LogosMsw,
        description: "API通信をモックするのに簡単に導入できる。",
      },
      playwrightSkill,
      {
        name: "Puppeteer",
        icon: LogosPuppeteer,
        description: "Playwrightを使う前は、これをよく使ってた。",
      },
      {
        name: "SonarQube",
        icon: LogosSonarqube,
        description: "コードを静的解析して、改善を繰り返すのに使ってた。",
      },
      {
        name: "Testing Library",
        icon: LogosTestingLibrary,
        description: "Reactのテストには欠かせないライブラリ。",
      },
      {
        name: "Vitest",
        icon: LogosVitest,
        description: "Jestよりも速くて便利。これからはこれを使うかも。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "DevOps",
    skills: [
      {
        name: "CircleCI",
        icon: LogosCircleci,
        description: "CIのパフォーマンスチューニングをやった経験あり。",
      },
      {
        name: "Datadog",
        icon: LogosDatadog,
        description: "バックエンドやインフラの監視でよく使う。",
      },
      {
        name: "Dependabot",
        icon: LogosDependabot,
        description: "ライブラリのアップデートをお任せできる便利な子。",
      },
      {
        name: "GitHub Actions",
        icon: LogosGithubActions,
        description: "制約がなければ、これをよく使う。",
      },
      {
        name: "Jenkins",
        icon: LogosJenkins,
        description: "パイプライン構築を何度か経験した。",
      },
      {
        name: "Lighthouse",
        icon: LogosLighthouse,
        description: "Core Web Vitalsを測るのに便利。",
      },
      {
        name: "Rollbar",
        icon: LogosRollbarIcon,
        description: "会社によってはこれを使うところもある。",
      },
      {
        name: "Sentry",
        icon: LogosSentryIcon,
        description: "フロントエンドの監視にはこれを使うことが多い。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "SaaS",
    skills: [
      {
        name: "Algolia",
        icon: LogosAlgolia,
        description: "手軽に全文検索を実現したいならこれ！",
      },
      {
        name: "GitBook",
        icon: DeviconGitbook,
        description: "Markdownで手軽にドキュメントを公開するならこれ！",
      },
      {
        name: "Chromatic",
        icon: LogosChromaticIcon,
        description: "Storybookでいろいろ便利に使いたいならこれ！",
      },
      {
        name: "Cloudflare Workers",
        icon: LogosCloudflareWorkersIcon,
        description: "エッジで処理するならこれ！",
      },
      {
        name: "Cloudinary",
        icon: LogosCloudinaryIcon,
        description: "URLで画像を簡単に加工できるのが便利すぎる。",
      },
      {
        name: "Expo",
        icon: LogosExpoIcon,
        description: "React Nativeでのアプリ開発には欠かせないツール。",
      },
      {
        name: "Gravatar",
        icon: LogosGravatarIcon,
        description: "アバター画像を作成するときによく使う。",
      },
      {
        name: "Netlify",
        icon: LogosNetlifyIcon,
        description: "静的サイトを公開したい時はこれ！",
      },
      {
        name: "Vercel",
        icon: LogosVercel,
        description: "now.shの頃からお気に入りのサービス。",
      },
      {
        name: "OpenAI",
        icon: LogosOpenaiIcon,
        description: "ChatGPTにはいつもお世話になってます。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
  {
    name: "ビジネス",
    skills: [
      {
        name: "Chrome Web Store",
        icon: LogosChromeWebStore,
        description: "Chrome拡張機能を公開するときに使うプラットフォーム。",
      },
      {
        name: "GitHub",
        icon: LogosGithubIcon,
        description: "開発するならコードはここにPushするのが基本。",
      },
      {
        name: "Slack",
        icon: LogosSlackIcon,
        description: "仕事でもプライベートでも使うコミュニケーションツール。",
      },
      {
        name: "Google Tag Manager",
        icon: LogosGoogleTagManager,
        description: "GTMだけじゃなくsGTMも導入経験あり。",
      },
      {
        name: "Google Analytics",
        icon: LogosGoogleAnalytics,
        description: "自サイトの行動ログ確認で使う。ほぼ必須のツール。",
      },
      {
        name: "Google Map",
        icon: LogosGoogleMaps,
        description: "個人開発でGoogle MapのAPIを利用している。",
      },
    ].sort((a, b) => a.name.localeCompare(b.name)),
  },
];

export const workExperiences = [
  {
    company: "System Integration",
    description:
      "新卒でWebアプリの開発、保守、運用に従事。設計からリリースまで一貫して経験を積む。",
    type: "fulltime",
  },
  {
    company: "E-Commerce",
    description:
      "フルスタックエンジニアとして、大規模アプリケーションのアーキテクチャ設計とモダナイゼーションに貢献。",
    type: "fulltime",
  },
  {
    company: "Fintech",
    description:
      "フロントエンドエンジニアとして、プロダクト改善および新機能の開発に携わる。",
    type: "fulltime",
  },
  {
    company: "Restaurant",
    description:
      "フロントエンドエンジニアとして、SaaSプロダクトのクロスプラットフォーム開発に携わる。",
    type: "contract",
  },
  {
    company: "Food Delivery",
    description:
      "フルスタックエンジニアとして、宅食サービスのプロダクト開発を担当。",
    type: "fulltime",
  },
  {
    company: "Media",
    description:
      "フロントエンドエンジニアとして、メディアサイトの新規開発および改善に携わる。",
    type: "contract",
  },
];

export const artifacts = {
  books: [
    {
      title: "はじめてのWeb Components入門",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1696334257/silver-birder.github.io/artifacts/Introduction-to-webcomponents-for-beginners.jpg",
      link: "https://www.amazon.co.jp/gp/product/B08CY2QCFV/",
    },
  ],
  webServices: [
    {
      title: "ぼちぼち",
      description: "『どこの食材が一番安い？』そんな悩みを解決するWebサービス",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1707629480/silver-birder.github.io/artifacts/bochi-bochi.png",
      link: "https://bochi-bochi.vercel.app",
    },
    {
      title: "こつこつ",
      description: "何でもこつこつ記録して可視化できるWebサービス",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1716716859/silver-birder.github.io/artifacts/kotsu-kotsu.png",
      link: "https://kotsu-kotsu.vercel.app",
    },
    {
      title: "クチコミ仲間",
      description:
        "クチコミ仲間は、あなたと同じ場所をクチコミした仲間を見つけるためのアプリです。",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1726033783/silver-birder.github.io/artifacts/review-connect",
      link: "https://review-connect.vercel.app",
    },
    {
      title: "元とらなアカン",
      description:
        "商品価格を使用頻度や期間から1日あたりのコストを計算するシンプルな電卓アプリ",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1726487561/silver-birder.github.io/artifacts/%E5%85%83%E3%81%A8%E3%82%89%E3%81%AA%E3%82%A2%E3%82%AB%E3%83%B3",
      link: "https://moto-torana-akan.vercel.app",
    },
    {
      title: "タイアップ検索",
      description:
        "Spotifyで再生中の曲情報を取得し、AIを使ってタイアップ情報を自動で検索します。",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1729167141/silver-birder.github.io/artifacts/%E3%82%BF%E3%82%A4%E3%82%A2%E3%83%83%E3%83%95%E3%82%9A%E6%A4%9C%E7%B4%A2.jpg",
      link: "https://tie-track.vercel.app",
    },
    {
      title: "絵文字ルーレット",
      description: "名前と絵文字で登録し、ルーレットで楽しく遊べるツールです。",
      image:
        "https://res.cloudinary.com/silverbirder/image/upload/v1730642411/silver-birder.github.io/artifacts/emoji-roulette.png",
      link: "https://emoji-roulette.vercel.app",
    },
  ],
  githubProjects: [
    {
      name: "o-embed",
      description: "Web Components for oEmbed generated by open-wc",
      link: "https://www.webcomponents.org/element/silverbirder/o-embed",
    },
    {
      name: "ogp-me",
      description:
        "WebComponent that displays Facebook-like information based on Open Graph Protocol (OGP)",
      link: "https://www.webcomponents.org/element/silverbirder/ogp-me",
    },
    {
      name: "Google Account Photo API",
      description: "API that returns the image of your Google account",
      link: "https://github.com/silverbirder/Google-Account-Photo-API",
    },
    {
      name: "CaAT",
      description:
        "Google Apps Script Library to calculate assigned time in Google Calendar",
      link: "https://github.com/silverbirder/CaAT",
    },
    {
      name: "Cotlin",
      description:
        "Tools that collect links in tweets using the Twitter API (Search Tweets)",
      link: "https://github.com/silverbirder/Cotlin",
    },
    {
      name: "rMinc",
      description: "Google Apps Script Library to register mail in Calendar",
      link: "https://github.com/silverbirder/rMinc",
    },
    {
      name: "Tiqav2",
      description: "Platform that provides image search API",
      link: "https://github.com/silverbirder/tiqav2",
    },
    {
      name: "zoom-meeting-creator",
      description: "Google Apps Script for creating Zoom meetings",
      link: "https://github.com/silverbirder/zoom-meeting-creator",
    },
  ],
};

export const notableContent = [
  {
    title: "大規模フロントエンドのクリーンアーキテクチャ化",
    type: "Presentation",
    link: "https://www.slideshare.net/slideshow/ss-150331504/150331504",
    description: "Developers Boost KANSAI (2019.6.15 @Osaka) の発表資料です。",
  },
  {
    title:
      "初めての技術選定を頼まれた時に大事だったのは俯瞰的・相対的な考え方だった",
    type: "Blog",
    link: "https://tech-blog.monotaro.com/entry/2021/06/03/090000",
    description: "ワークフローエンジンの技術選定についてのブログ記事です。",
  },
  {
    title:
      "Webフロントエンド再設計: レイヤードアーキテクチャの導入 ~ 高品質なコードを実現するために ~",
    type: "Blog",
    link: "https://zenn.dev/moneyforward/articles/e97dd1c0412071",
    description:
      "WebフロントエンドにFeature-Sliced Designというレイヤードアーキテクチャを導入した話です。",
  },
  {
    title: "Webフロントエンドにおける網羅的テストパターンガイド",
    type: "Blog",
    link: "https://zenn.dev/silverbirder/articles/c3de04c9e6dd58",
    description:
      "Webフロントエンドにおける機能面、非機能面、そしてUI/UXの視点からのテストパターンガイドを紹介します。",
  },
];
