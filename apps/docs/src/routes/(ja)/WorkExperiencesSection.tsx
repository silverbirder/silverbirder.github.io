import { Slot, component$ } from "@builder.io/qwik";
import { FileIconsDigdag } from "~/components/icon/file";
import { LogosGoogleCloudPlatform } from "~/components/icon/icon";
import {
  LogosAnsible,
  LogosAtomIcon,
  LogosAws,
  LogosBitbucket,
  LogosBootstrap,
  LogosBrackets,
  LogosCakephpIcon,
  LogosChromaticIcon,
  LogosCircleci,
  LogosEclipseIcon,
  LogosFigma,
  LogosFlask,
  LogosGithubActions,
  LogosGithubIcon,
  LogosGraphql,
  LogosGulp,
  LogosIntellijIdea,
  LogosJavascript,
  LogosJenkins,
  LogosJquery,
  LogosNginx,
  LogosPhp,
  LogosPython,
  LogosRails,
  LogosReact,
  LogosReduxSaga,
  LogosRocketChatIcon,
  LogosRollbarIcon,
  LogosSentryIcon,
  LogosSlackIcon,
  LogosStorybookIcon,
  LogosSubversion,
  LogosSwr,
  LogosTerraformIcon,
  LogosTestingLibrary,
  LogosTypescriptIcon,
  LogosVisualStudioCode,
  LogosWebcomponents,
  LogosWebpack,
} from "~/components/icon/logos";
import {
  OriginalApacheBeam,
  OriginalBigQuery,
  OriginalUrql,
} from "~/components/icon/original";
import { SimpleIconsBackstage } from "~/components/icon/simple";
import { css } from "~/styled-system/css";

export const WorkExperiencesSection = component$(() => {
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
        >
          <LogosJquery
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosSubversion
            class={css({
              layerStyle: "beginnerIcon",
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
          <LogosBootstrap
            class={css({
              layerStyle: "middleIcon",
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
          <LogosAws
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
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
          <LogosEclipseIcon
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
        </WorkExperience>
        <WorkExperience
          from="2018/08"
          to="2021/12"
          industry="E-Commerce"
          description="フルスタックエンジニアとして、大規模アプリのアーキテクチャとモダナイゼーションに貢献。"
        >
          <LogosGulp
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosJquery
            class={css({ layerStyle: "middleIcon", height: "icon.main" })}
          />
          <LogosWebpack
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
          <LogosPython
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
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
          <LogosAnsible
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
          <LogosGoogleCloudPlatform
            class={css({
              layerStyle: "middleIcon",
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
          <LogosTerraformIcon
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
          <LogosSentryIcon
            class={css({
              layerStyle: "middleIcon",
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
          <LogosBitbucket
            class={css({
              layerStyle: "middleIcon",
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
        </WorkExperience>
        <WorkExperience
          from="2021/01"
          to="2022/06"
          industry="Fintech"
          description="フロントエンドエンジニアとして、プロダクト改修と新規開発に携わる。"
        >
          <LogosFigma
            class={css({
              layerStyle: "middleIcon",
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
          <LogosStorybookIcon
            class={css({
              layerStyle: "middleIcon",
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
          <LogosGraphql
            class={css({
              layerStyle: "beginnerIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosRails
            class={css({ layerStyle: "beginnerIcon", height: "icon.main" })}
          />
          <LogosTestingLibrary
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
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
          <LogosGithubActions
            class={css({
              layerStyle: "middleIcon",
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
          <LogosChromaticIcon
            class={css({
              layerStyle: "middleIcon",
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
          <LogosGithubIcon
            class={css({
              layerStyle: "middleIcon",
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
        </WorkExperience>
        <WorkExperience
          from="2021/07"
          to="now"
          industry="Restaurant"
          description="業務委託で飲食店向けSaaSプロダクトのクロスプラットフォーム開発を担当。"
        >
          <LogosFigma
            class={css({
              layerStyle: "middleIcon",
              width: "icon.main",
              height: "icon.main",
            })}
          />
          <LogosJavascript
            class={css({
              layerStyle: "advancedIcon",
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
          <LogosTypescriptIcon
            class={css({
              layerStyle: "middleIcon",
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
          <LogosSentryIcon
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
          <LogosGithubIcon
            class={css({
              layerStyle: "middleIcon",
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
        </WorkExperience>
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
        <div
          class={css({
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            flexDirection: "row",
            marginTop: 2,
          })}
        >
          <Slot />
        </div>
      </div>
    );
  }
);
