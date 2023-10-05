import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import ImgFavicon from "~/media/favicon.svg?jsx";
import { css } from "~/styled-system/css";
import { BiographySection } from "./BiographySection";
import { PreferencesSection } from "./PreferencesSection";
import { ArtifactsSection } from "./ArtifactsSection";
import { KnowledgesSection } from "./KnowledgesSection";
import { WorkExperiencesSection } from "./WorkExperiencesSection";

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
