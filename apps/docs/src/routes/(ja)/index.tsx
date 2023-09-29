import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { LogosGoogleCloudPlatform } from "~/components/icon/icon";
import {
  LogosJavascript,
  LogosJest,
  LogosPlaywright,
  LogosStorybookIcon,
  LogosWebcomponents,
} from "~/components/icon/logos";
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
          "main"
          "side"
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
          padding: "0 2rem",
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
        <LogosJest class={css({ width: "icon.main", height: "icon.main" })} />
        <LogosPlaywright
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosStorybookIcon
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosWebcomponents
          class={css({ width: "icon.main", height: "icon.main" })}
        />
        <LogosGoogleCloudPlatform
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
          between="2016/04 ~ 2018/07"
          industry="System Integration"
        />
        <WorkExperience between="2018/08 ~ 2021/12" industry="E-Commerce" />
        <WorkExperience between="2022/01 ~ 2022/06" industry="Fintech" />
        <WorkExperience between="2022/07 ~ now" industry="Restaurant" />
      </div>
    </section>
  );
});

const WorkExperience = component$(
  (props: { between: string; industry: string }) => {
    return (
      <div
        class={css({
          backgroundColor: "bg.quote",
          margin: "8px",
          padding: "8px",
          width: {
            base: "40%",
            smDown: "100%",
          },
          borderRadius: 8,
        })}
      >
        <h4>{props.between}</h4>
        <div>{props.industry}</div>
      </div>
    );
  }
);

const KnowledgesSection = component$(() => {
  return (
    <section>
      <h3>Knowledges</h3>
      <h4>Frontend</h4>
      <h4>Backend</h4>
      <h4>Infra</h4>
      <h4>DevOps</h4>
      <h4>Business</h4>
    </section>
  );
});

const ArtifactsSection = component$(() => {
  return (
    <section>
      <h3>Artifacts</h3>
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
