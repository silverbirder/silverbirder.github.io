import { Slot, component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Image } from "~/components/image/image";
import {
  DeviconGitbook,
  DeviconGithubcodespaces,
  DeviconGitpod,
  DeviconPytest,
} from "~/components/icon/devicon";
import {
  FileIconsDigdag,
  FileIconsOpenpolicyagent,
} from "~/components/icon/file";
import { LogosGoogleCloudPlatform, MdiApi } from "~/components/icon/icon";
import {
  LogosAlgolia,
  LogosAmpIcon,
  LogosAnsible,
  LogosApache,
  LogosArgoIcon,
  LogosAtlassian,
  LogosAtomIcon,
  LogosAws,
  LogosBashIcon,
  LogosBitbucket,
  LogosBootstrap,
  LogosBrackets,
  LogosC,
  LogosCakephpIcon,
  LogosChromaticIcon,
  LogosChromeWebStore,
  LogosCircleci,
  LogosCloudflareWorkersIcon,
  LogosCloudinaryIcon,
  LogosCodecovIcon,
  LogosContentful,
  LogosCucumber,
  LogosDatadog,
  LogosDependabot,
  LogosDiscordIcon,
  LogosDjangoIcon,
  LogosDockerIcon,
  LogosDropbox,
  LogosEclipseIcon,
  LogosElectron,
  LogosEslint,
  LogosExpoIcon,
  LogosExpress,
  LogosFfmpegIcon,
  LogosFigma,
  LogosFlask,
  LogosGithubActions,
  LogosGithubCopilot,
  LogosGithubIcon,
  LogosGo,
  LogosGoogleMaps,
  LogosGraphql,
  LogosGravatarIcon,
  LogosGulp,
  LogosHerokuIcon,
  LogosHugo,
  LogosIntellijIdea,
  LogosJavascript,
  LogosJenkins,
  LogosJest,
  LogosJquery,
  LogosKotlinIcon,
  LogosKubernetes,
  LogosLighthouse,
  LogosLitIcon,
  LogosMadge,
  LogosMaterialUi,
  LogosMemcached,
  LogosMongodbIcon,
  LogosMsw,
  LogosMysqlIcon,
  LogosNetlifyIcon,
  LogosNextjsIcon,
  LogosNginx,
  LogosNodejsIcon,
  LogosNow,
  LogosObsidianIcon,
  LogosOpenaiIcon,
  LogosOpenapiIcon,
  LogosPandacssIcon,
  LogosPartytownIcon,
  LogosPhp,
  LogosPlaywright,
  LogosPostmanIcon,
  LogosPuppeteer,
  LogosPwa,
  LogosPython,
  LogosQwikIcon,
  LogosRails,
  LogosReact,
  LogosReactRouter,
  LogosReduxSaga,
  LogosRocketChatIcon,
  LogosRollbarIcon,
  LogosRuby,
  LogosRust,
  LogosSelenium,
  LogosSentryIcon,
  LogosSlackIcon,
  LogosSnyk,
  LogosSonarqube,
  LogosStorybookIcon,
  LogosSurge,
  LogosSwagger,
  LogosSwr,
  LogosTerraformIcon,
  LogosTestingLibrary,
  LogosTurborepoIcon,
  LogosTypescriptIcon,
  LogosVercel,
  LogosVisualStudioCode,
  LogosVitejs,
  LogosVitest,
  LogosVue,
  LogosWebcomponents,
  LogosWebpack,
} from "~/components/icon/logos";
import {
  OriginalApacheBeam,
  OriginalBeardPapas,
  OriginalBigQuery,
  OriginalMisterDonuts,
  OriginalUrql,
  OriginalVarnish,
} from "~/components/icon/original";
import {
  SimpleIconsBackstage,
  SimpleIconsFluentd,
  SimpleIconsGoogleappsscript,
} from "~/components/icon/simple";
import ImgFavicon from "~/media/favicon.svg?jsx";
import { css } from "~/styled-system/css";

export default component$(() => {
  return (
    <div
      class={css({
        display: "grid",
        gridTemplateAreas: {
          base: `
          "side main"`,
          smDown: `
          "side"
          "main"
          `,
        },
        gridTemplateColumns: {
          base: "1fr 3fr",
          smDown: "auto",
        },
        gridTemplateRows: "auto",
      })}
    >
      <div
        class={css({
          gridArea: "side",
          flexDirection: "column",
        })}
      >
        <ImgFavicon
          class={css({
            width: "avatar.main",
            height: "avatar.main",
          })}
        />
        <MessageSection />
        <BiographySection />
        <PreferencesSection />
      </div>
      <div
        class={css({
          gridArea: "main",
        })}
      >
        <WorkExperiencesSection />
        <KnowledgesSection />
        <ArtifactsSection />
        <MVCSection />
      </div>
    </div>
  );
});

const MessageSection = component$(() => {
  return (
    <section>
      <h2>
        アイデアを
        <br />
        形に
      </h2>
    </section>
  );
});

const BiographySection = component$(() => {
  return (
    <section>
      <h3>Biography</h3>
      <div>
        大学で初めてWebアプリケーション開発に挑戦し、アウトプットの喜びに触れ、これが今のキャリアのスタートとなりました。
        アイディアが浮かべば、効率的かつコストパフォーマンスを考慮し、個人開発を進めています。
        好きな食べ物は、ドーナツとチョコレートです。
      </div>
    </section>
  );
});

const PreferencesSection = component$(() => {
  return (
    <section>
      <h3>Preferences</h3>
      <div
        class={css({
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        })}
      >
        <LogosJavascript
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosNodejsIcon
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosWebcomponents
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosStorybookIcon
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosJest class={css({ width: "icon.main", height: "icon.main" })} />
        <LogosPlaywright
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosGoogleCloudPlatform
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <OriginalBigQuery
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosGoogleMaps
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosOpenaiIcon
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <OriginalMisterDonuts
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <OriginalBeardPapas
          class={css({ width: "icon.main", height: "icon.main" })}
        />
      </div>
    </section>
  );
});

const WorkExperiencesSection = component$(() => {
  return (
    <section>
      <h3>Work Experiences</h3>
      <div
        class={css({
          display: "flex",
          flexWrap: "wrap",
          flexDirection: {
            base: "row",
            smDown: "column",
          },
        })}
      >
        <WorkExperience
          from="2016/04"
          to="2018/07"
          industry="System Integration"
          description="新卒でWebアプリ開発・保守・運用に従事。上流から下流工程まで経験。"
        />
        <WorkExperience
          from="2018/08"
          to="2021/12"
          industry="E-Commerce"
          description="フルスタックエンジニアとして、大規模アプリのアーキテクチャとモダナイゼーションに貢献。"
        />
        <WorkExperience
          from="2021/01"
          to="2022/06"
          industry="Fintech"
          description="フロントエンドエンジニアとして、プロダクト改修と新規開発に携わる。"
        />
        <WorkExperience
          from="2021/07"
          to="now"
          industry="Restaurant"
          description="業務委託で飲食店向けSaaSプロダクトのクロスプラットフォーム開発を担当。"
        />
      </div>
    </section>
  );
});

const WorkExperience = component$(
  (props: {
    from: string;
    to: string;
    industry: string;
    description: string;
  }) => {
    return (
      <div
        class={css({
          backgroundColor: "bg.quote",
          margin: "8px",
          padding: "8px",
          width: {
            base: "40%",
            smDown: "95%",
          },
          borderRadius: 8,
        })}
      >
        <h4>{props.industry}</h4>
        <div
          class={css({
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          })}
        >
          <p>{props.from}</p>
          <div>~</div>
          <p>{props.to}</p>
        </div>
        <div>{props.description}</div>
      </div>
    );
  }
);

const KnowledgesSection = component$(() => {
  return (
    <section>
      <h3>Knowledges</h3>
      <div
        class={css({
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          flexDirection: {
            base: "row",
            smDown: "column",
          },
        })}
      >
        <Knowledge name="Frontend">
          <LogosAmpIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosBootstrap
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosElectron
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosEslint
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosFigma
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGulp class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosHugo class={css({ height: "icon.main" })} />
          <LogosJquery class={css({ height: "icon.main" })} />
          <LogosJavascript
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosLitIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosMadge
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosMaterialUi
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosNextjsIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosPandacssIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosPartytownIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosPwa class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosQwikIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosReact
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosReactRouter
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosReduxSaga
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosStorybookIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSwr class={css({ height: "icon.main" })} />
          <LogosTurborepoIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosTypescriptIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <OriginalUrql
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosVitejs
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosVue class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosWebpack
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosWebcomponents
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="Backend">
          <LogosBashIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosCakephpIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosC class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosDjangoIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosExpress
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosFlask
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGo class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosGraphql
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosKotlinIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosNodejsIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />

          <LogosPhp class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosPython
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosRails class={css({ height: "icon.main" })} />
          <LogosRuby class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosRust class={css({ width: "icon.main", height: "icon.main" })} />
        </Knowledge>
        <Knowledge name="Testing">
          <LogosCucumber
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <DeviconPytest
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosJest class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosMsw class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosPlaywright
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosPuppeteer
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSelenium
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSonarqube class={css({ height: "icon.main" })} />
          <LogosTestingLibrary
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosVitest
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="Data">
          <OriginalApacheBeam
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <OriginalBigQuery
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosMongodbIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosMysqlIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="Infra/Middleware">
          <LogosAnsible
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosApache
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosAws class={css({ width: "icon.main", height: "icon.main" })} />
          <FileIconsDigdag
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosDockerIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <SimpleIconsFluentd
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGoogleCloudPlatform
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosKubernetes
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosMemcached
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosNginx
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <OriginalVarnish
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosTerraformIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="DevOps">
          <SimpleIconsBackstage
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosCircleci
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosDatadog
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosDependabot
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <FileIconsOpenpolicyagent
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGithubActions
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosArgoIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosJenkins
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosLighthouse
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosRollbarIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSentryIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSnyk class={css({ width: "icon.main", height: "icon.main" })} />
        </Knowledge>
        <Knowledge name="SaaS">
          <LogosAlgolia class={css({ height: "icon.main" })} />
          <DeviconGitbook
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosChromaticIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosCloudflareWorkersIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosCloudinaryIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosCodecovIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosContentful
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosExpoIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGithubCopilot
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGravatarIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosHerokuIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosNetlifyIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosNow class={css({ width: "icon.main", height: "icon.main" })} />
          <LogosOpenaiIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSurge
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosVercel class={css({ height: "icon.main" })} />
        </Knowledge>
        <Knowledge name="Editor">
          <LogosAtomIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosBrackets
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <DeviconGithubcodespaces
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <DeviconGitpod
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosEclipseIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosIntellijIdea
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosVisualStudioCode
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="Development">
          <LogosFfmpegIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <SimpleIconsGoogleappsscript
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosOpenapiIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosPostmanIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSwagger
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="Business">
          <LogosAtlassian
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosBitbucket
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosChromeWebStore
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosDiscordIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosDropbox
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosGithubIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosObsidianIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosRocketChatIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
          <LogosSlackIcon
            class={css({ width: "icon.main", height: "icon.main" })}
          />
        </Knowledge>
      </div>
    </section>
  );
});

const Knowledge = component$((props: { name: string }) => {
  return (
    <div
      class={css({
        width: {
          base: "40%",
          smDown: "100%",
        },
      })}
    >
      <h4>{props.name}</h4>
      <div
        class={css({
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 1,
        })}
      >
        <Slot />
      </div>
    </div>
  );
});

const ArtifactsSection = component$(() => {
  return (
    <section>
      <h3>Artifacts</h3>
      <h4>Main</h4>
      <div
        class={css({
          display: "flex",
          alignItems: "center",
        })}
      >
        <Image
          src="https://res.cloudinary.com/silverbirder/image/upload/v1696334257/silver-birder.github.io/artifacts/Introduction-to-webcomponents-for-beginners.jpg"
          width={1057 / 5}
          height={1500 / 5}
          layout="constrained"
          alt="はじめてのWeb Components入門 - Amazon"
          href="https://www.amazon.co.jp/gp/product/B08CY2QCFV/"
        />
        <Image
          src="https://res.cloudinary.com/silverbirder/image/upload/v1696335110/silver-birder.github.io/artifacts/AI-GHOST-WRITER.jpg"
          width={640 / 3}
          height={400 / 3}
          layout="constrained"
          alt="AIゴーストライター - Chrome ウェブストア"
          href="https://chrome.google.com/webstore/detail/ai-ghostwriter/hpcokeldeijnfmbbbjkedhnedjjbjmoa"
        />
        <a
          href="https://github.com/silverbirder/Google-Account-Photo-API"
          target="_blank"
        >
          <figure
            title={"Google Account Photo API - GitHub"}
            class={css({
              display: "flex",
              alignItems: "center",
              flexDirection: "column",
              textAlign: "center",
            })}
          >
            <MdiApi
              class={css({
                width: "100px",
                height: "100px",
              })}
            />
            <figcaption
              class={css({
                fontSize: "0.8rem",
                color: "gray.500",
              })}
            >
              Google Account Photo API - GitHub
            </figcaption>
          </figure>
        </a>
      </div>
      <h4>Others</h4>
      <div>
        <div>
          <a
            href="https://www.webcomponents.org/element/silverbirder/o-embed"
            target="_brank"
          >
            o-embed - webcomponents.org
          </a>
        </div>
        <div>
          <a
            href="https://www.webcomponents.org/element/silverbirder/ogp-me"
            target="_brank"
          >
            ogp-me - webcomponents.org
          </a>
        </div>
        <div>
          <a href="https://github.com/silverbirder/CaAT" target="_brank">
            CaAT - GitHub
          </a>
        </div>
        <div>
          <a href="https://github.com/silverbirder/Cotlin" target="_brank">
            Cotlin - GitHub
          </a>
        </div>
        <div>
          <a href="https://github.com/silverbirder/rMinc" target="_brank">
            rMinc - GitHub
          </a>
        </div>
        <div>
          <a href="https://github.com/silverbirder/tiqav2" target="_brank">
            tiqav2 - GitHub
          </a>
        </div>
        <div>
          <a
            href="https://github.com/silverbirder/zoom-meeting-creator"
            target="_brank"
          >
            zoom-meeting-creator - GitHub
          </a>
        </div>
      </div>
    </section>
  );
});

const MVCSection = component$(() => {
  return (
    <section
      class={css({
        display: "flex",
        flexDirection: {
          base: "column",
          smDown: "column",
        },
        gap: 4,
      })}
    >
      <div>
        <h3>Mission</h3>
        <div>日々の煩わしさから解放します。</div>
      </div>
      <div>
        <h3>Vision</h3>
        <div>
          Web技術を活用し、人々の生活の質を高め、より豊かなものとします。
        </div>
      </div>
      <div>
        <h3>Value</h3>
        <ul>
          <li>ユーザーファースト</li>
          <ul>
            <li>ユーザーのニーズと期待を最優先に考え、価値を提供します。</li>
          </ul>
          <li>言語化</li>
          <ul>
            <li>複雑な問題も明瞭かつ正確に表現し、理解を深め、共有します。</li>
          </ul>
          <li>シンプルイズベスト</li>
          <ul>
            <li>
              シンプルで直感的なデザインと機能で、使いやすさを追求します。
            </li>
          </ul>
          <li>QCD</li>
          <ul>
            <li>状況に応じて、QCDのバランスを考慮し、最適な判断をします。</li>
          </ul>
        </ul>
      </div>
    </section>
  );
});

export const head: DocumentHead = ({ head }) => {
  return {
    ...head,
    title: `silverbirder`,
    meta: [
      {
        name: "description",
        content: "silverbirder's page",
      },
    ],
  };
};
