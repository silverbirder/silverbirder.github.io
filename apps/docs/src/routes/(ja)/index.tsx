import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { MdiArrowDown } from "~/components/icon/icon";
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
          base: "1fr 2fr",
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
        <h3>アイデアを形に</h3>
        <section>
          <h2>Biography</h2>
          <p>
            大学で初めてWebアプリケーション開発に挑戦し、アウトプットの喜びに触れ、これが今のキャリアのスタートとなりました。
            アイディアが浮かべば、効率的かつコストパフォーマンスを考慮し、個人開発を進めています。
            好きな食べ物は、ドーナツとチョコレートです。
          </p>
        </section>
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
            <p>お客様を日々の煩わしさから解放します。</p>
          </div>
          <div>
            <h3>Vision</h3>
            <p>
              Web技術を活用し、皆様の生活の質を高め、より豊かなものとします。
            </p>
          </div>
          <div>
            <h3>Value</h3>
            <p>
              1. <strong>ユーザーファースト:</strong>
              ユーザーのニーズと期待を最優先に考え、価値を提供します。
            </p>
            <p>
              2. <strong>言語化:</strong>
              複雑な問題も明瞭かつ正確に表現し、理解を深め、共有します。
            </p>
            <p>
              3. <strong>シンプルイズベスト:</strong>
              シンプルで直感的なデザインと機能で、使いやすさを追求します。
            </p>
            <p>
              4. <strong>デリバリー後も品質保持:</strong>
              プロダクトをリリースした後も、品質とサービスの向上を心掛けます。
            </p>
          </div>
        </section>
      </div>
      <div
        class={css({
          gridArea: "main",
          padding: "0 2rem",
        })}
      >
        <section>
          <h2>Work experience</h2>
          <div
            class={css({
              display: "flex",
              flexDirection: "column",
            })}
          >
            <div
              class={css({
                display: "flex",
                flexDirection: "row",
                gap: 4,
              })}
            >
              <p
                class={css({
                  backgroundColor: "bg.quote",
                  borderRadius: "64px",
                  height: "64px",
                  width: "64px",
                  padding: "10px",
                })}
              >
                2016/04
              </p>
              <p>SI</p>
            </div>
            <MdiArrowDown
              class={css({
                borderRadius: "32px",
                height: "32px",
                width: "32px",
              })}
            />
            <div
              class={css({
                display: "flex",
                flexDirection: "row",
                gap: 4,
              })}
            >
              <p
                class={css({
                  backgroundColor: "bg.quote",
                  borderRadius: "64px",
                  height: "64px",
                  width: "64px",
                  padding: "10px",
                })}
              >
                2017/08
              </p>
              <p>EC</p>
            </div>
            <MdiArrowDown
              class={css({
                borderRadius: "32px",
                height: "32px",
                width: "32px",
              })}
            />
            <div
              class={css({
                display: "flex",
                flexDirection: "row",
                gap: 4,
              })}
            >
              <p
                class={css({
                  backgroundColor: "bg.quote",
                  borderRadius: "64px",
                  height: "64px",
                  width: "64px",
                  padding: "10px",
                })}
              >
                2022/01
              </p>
              <p>Fintech</p>
            </div>
            <MdiArrowDown
              class={css({
                borderRadius: "32px",
                height: "32px",
                width: "32px",
              })}
            />
            <div
              class={css({
                display: "flex",
                flexDirection: "row",
                gap: 4,
              })}
            >
              <p
                class={css({
                  backgroundColor: "bg.quote",
                  borderRadius: "64px",
                  height: "64px",
                  width: "64px",
                  padding: "10px",
                })}
              >
                2022/07
              </p>
              <p>F&B</p>
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
