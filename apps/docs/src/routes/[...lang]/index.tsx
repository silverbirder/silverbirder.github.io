import { component$ } from "@builder.io/qwik";
import {
  type StaticGenerateHandler,
  type DocumentHead,
} from "@builder.io/qwik-city";
import ImgFavicon from "~/media/favicon.svg?jsx";
import { css } from "~/styled-system/css";
import { BiographySection } from "./BiographySection";
import { PreferencesSection } from "./PreferencesSection";
import { ArtifactsSection } from "./ArtifactsSection";
import { KnowledgesSection } from "./KnowledgesSection";
import { WorkExperiencesSection } from "./WorkExperiencesSection";
import { config } from "~/speak-config";

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
        <div
          class={css({
            padding: "2px 4px",
            marginTop: {
              base: "-10px",
              smDown: "0",
            },
            textAlign: "center",
            borderColor: "text.link",
            borderWidth: "1px",
            borderRadius: "4px",
            _hover: {
              backgroundColor: "text.link",
              "& a": {
                color: "white",
              },
            },
          })}
        >
          <a
            href="https://docs.google.com/spreadsheets/d/e/2PACX-1vR87UtY887Tx1R_Y4eVSwMq-12YCD2iHgtxAIz5D88PYZdrIZXZhLRuTeFcLgYs2xWrxJaCJyhGRzAr/pubhtml"
            target="_blank"
            class={css({
              display: "block",
            })}
          >
            Detail Work Experiences
          </a>
        </div>
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
      </div>
    </div>
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

export const onStaticGenerate: StaticGenerateHandler = () => {
  return {
    params: config.supportedLocales.map((locale) => {
      return {
        lang: locale.lang !== config.defaultLocale.lang ? locale.lang : ".",
      };
    }),
  };
};
