import { Slot, component$ } from "@builder.io/qwik";
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
import { LogosGoogleCloudPlatform } from "~/components/icon/icon";
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
  OriginalBigQuery,
  OriginalUrql,
  OriginalVarnish,
} from "~/components/icon/original";
import {
  SimpleIconsBackstage,
  SimpleIconsFluentd,
  SimpleIconsGoogleappsscript,
} from "~/components/icon/simple";
import { css } from "~/styled-system/css";

export const KnowledgesSection = component$(() => {
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
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosBootstrap
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosElectron
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosEslint
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosFigma
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGulp
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosHugo
            class={css({ layerStyle: "beginnerIcon", height: "icon.main" })}
          />
          <LogosJquery
            class={css({ layerStyle: "middleIcon", height: "icon.main" })}
          />
          <LogosJavascript
            class={css({
              layerStyle: "advancedIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosLitIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosMadge
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosMaterialUi
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosNextjsIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPandacssIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPartytownIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPwa
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosQwikIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosReact
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosReactRouter
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosReduxSaga
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosStorybookIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSwr
            class={css({ layerStyle: "beginnerIcon", height: "icon.main" })}
          />
          <LogosTurborepoIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosTypescriptIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <OriginalUrql
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosVitejs
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosVue
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosWebpack
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosWebcomponents
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="Backend">
          <LogosBashIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosCakephpIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosC
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosDjangoIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosExpress
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosFlask
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGo
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGraphql
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosKotlinIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosNodejsIcon
            class={css({
              layerStyle: "advancedIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPhp
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPython
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosRails
            class={css({ layerStyle: "beginnerIcon", height: "icon.main" })}
          />
          <LogosRuby
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosRust
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="Testing">
          <LogosCucumber
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <DeviconPytest
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosJest
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosMsw
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPlaywright
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPuppeteer
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSelenium
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSonarqube
            class={css({ layerStyle: "beginnerIcon", height: "icon.main" })}
          />
          <LogosTestingLibrary
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosVitest
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="Data">
          <OriginalApacheBeam
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <OriginalBigQuery
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosMongodbIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosMysqlIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="Infra/Middleware">
          <LogosAnsible
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosApache
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <FileIconsDigdag
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosDockerIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <SimpleIconsFluentd
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosAws
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGoogleCloudPlatform
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosKubernetes
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosMemcached
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosNginx
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <OriginalVarnish
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosTerraformIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="DevOps">
          <SimpleIconsBackstage
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosCircleci
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosDatadog
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosDependabot
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <FileIconsOpenpolicyagent
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGithubActions
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosArgoIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosJenkins
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosLighthouse
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosRollbarIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSentryIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSnyk
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="SaaS">
          <LogosAlgolia
            class={css({ layerStyle: "middleIcon", height: "icon.main" })}
          />
          <DeviconGitbook
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosChromaticIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosCloudflareWorkersIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosCloudinaryIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosCodecovIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosContentful
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosExpoIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGithubCopilot
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGravatarIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosHerokuIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosNetlifyIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosNow
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosOpenaiIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSurge
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosVercel
            class={css({ layerStyle: "beginnerIcon", height: "icon.main" })}
          />
        </Knowledge>
        <Knowledge name="Editor">
          <LogosAtomIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosBrackets
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <DeviconGithubcodespaces
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <DeviconGitpod
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosEclipseIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosIntellijIdea
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosVisualStudioCode
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="Development">
          <LogosFfmpegIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <SimpleIconsGoogleappsscript
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosPostmanIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSwagger
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
        </Knowledge>
        <Knowledge name="Business">
          <LogosAtlassian
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosBitbucket
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosChromeWebStore
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosDiscordIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosDropbox
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosGithubIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosObsidianIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosRocketChatIcon
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSlackIcon
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
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
