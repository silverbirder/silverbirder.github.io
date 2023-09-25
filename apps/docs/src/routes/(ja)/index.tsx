import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
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
        gridTemplateRows: {
          base: "1fr auto",
          smDown: "auto",
        },
        gridTemplateColumns: "auto",
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
        <p>silverbirder</p>
        <p>
          👨‍💻 I'm a web application developer. 🔍 I'm interested in Browser
          Engine, Micro Frontends. 😎 Enjoy It !
        </p>
        <p>Japan</p>
        <p>silverbirder@gmail.com</p>
        <p>@silverbirder</p>
      </div>
      <div
        class={css({
          gridArea: "main",
        })}
      >
        <h2>テクノロジーで、アイデアを形に</h2>
        <h5>ideas.map(transformToRealityWithTech)</h5>
        <section>
          <h2>Biography</h2>
          <p>
            2016年、Sler企業へ新卒入社し、Webアプリケーションの開発・保守・運用を経験。上流工程から下流工程まで幅広く業務を担当。
            2018年、大手EC企業へ転職し、フルスタックエンジニア(データ,インフラ,アプリ)として、大規模アプリケーションのリアーキテクチャやモダナイゼーションに貢献。
            2022年、FintechのSaaS企業へ転職し、フロントエンドエンジニアとして、既存プロダクト改修や新規プロダクト開発に携わり、今に至る。
          </p>
        </section>
        <section
          class={css({
            display: "flex",
            flexDirection: {
              base: "row",
              smDown: "column",
            },
          })}
        >
          <div>
            <h2>Mission</h2>
            <p>煩わしいことから解放する</p>
          </div>
          <div>
            <h2>Vision</h2>
            <p>Web技術を通して、ユーザーの生活をより豊かに</p>
          </div>
          <div>
            <h2>Value</h2>
            <p>ユーザーファースト</p>
            <p>言語化</p>
            <p>シンプルイズベスト</p>
            <p>デリバリー、その後はクオリティ</p>
          </div>
        </section>
        <section>
          <h2>Work experience</h2>
          <div
            class={css({
              flexDirection: "column",
              alignItems: "center",
            })}
          >
            <div>
              <p>2016</p>
              <p>TGL</p>
            </div>
            <div
              class={css({
                position: "relative",
                background: "black",
                marginBottom: 5,
                width: 2,
                height: 10,
                _after: {
                  content: '"▼"',
                  position: "absolute",
                  color: "black",
                  fontSize: 30,
                  bottom: "-1em",
                  left: "-0.25em",
                },
              })}
            ></div>
            <div>
              <p>2018</p>
              <p>MonotaRO</p>
            </div>
            <div
              class={css({
                position: "relative",
                background: "black",
                marginBottom: 5,
                width: 2,
                height: 10,
                _after: {
                  content: '"▼"',
                  position: "absolute",
                  color: "black",
                  fontSize: 30,
                  bottom: "-1em",
                  left: "-0.25em",
                },
              })}
            ></div>
            <div>
              <p>2022</p>
              <p>Moneyforward</p>
            </div>
          </div>
        </section>
        <section>
          <h2>Knowledges</h2>
        </section>
        <section>
          <h2>Artifacts</h2>
        </section>
      </div>
    </div>
  );
});

/**

<section>
        <ImgFavicon />
      </section>
      <section>
        <h2>Biography</h2>
        <p>
          2016年、Sler企業へ新卒入社し、Webアプリケーションの開発・保守・運用を経験。上流工程から下流工程まで幅広く業務を担当。
          2018年、大手EC企業へ転職し、フルスタックエンジニア(データ,インフラ,アプリ)として、大規模アプリケーションのリアーキテクチャやモダナイゼーションに貢献。
          2022年、FintechのSaaS企業へ転職し、フロントエンドエンジニアとして、既存プロダクト改修や新規プロダクト開発に携わり、今に至る。
        </p>
      </section>

      <section>
        <h2>Preferences</h2>
        <p>これが好きだ！</p>
      </section>

      {/* <section>
        <h2>MVC</h2>
        <h3>Mission</h3>
        <p>自分の使命</p>
        <h3>Vision</h3>
        <p>
          Web技術を通して、ユーザーの生活をより豊かにすることができる、そんなWebエンジニアを目指しています。
        </p>
        <h3>Values</h3>
        <p>手段</p>
      </section> 

      <section>
        <h2>CV</h2>
        <h3>Work experience</h3>
        <p>2016 ~ 何してた？</p>
        <h3>Knowledges</h3>
        <p>Javascriptとかね!</p>
      </section>

      <section>
        <h2>Artifact</h2>
      </section>

 */

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
