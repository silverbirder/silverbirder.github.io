import { component$ } from "@builder.io/qwik";
import ImgFavicon from "~/media/favicon.svg?jsx";
import { css } from "~/styled-system/css";
import { BiographySection } from "./biography-section";
import { PreferencesSection } from "./preferences-section";
import { ArtifactsSection } from "./artifacts-section";
import { KnowledgesSection } from "./knowledges-section";
import { WorkExperiencesSection } from "./work-experiences-section";
import { useSpeakLocale, useTranslate } from "qwik-speak";

export interface TopPageProps {}

export const TopPage = component$<TopPageProps>(() => {
  const t = useTranslate();
  const sl = useSpeakLocale();
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
            href={
              sl.lang === "ja-JP"
                ? "https://docs.google.com/spreadsheets/d/e/2PACX-1vR87UtY887Tx1R_Y4eVSwMq-12YCD2iHgtxAIz5D88PYZdrIZXZhLRuTeFcLgYs2xWrxJaCJyhGRzAr/pubhtml"
                : "https://docs-google-com.translate.goog/spreadsheets/d/e/2PACX-1vR87UtY887Tx1R_Y4eVSwMq-12YCD2iHgtxAIz5D88PYZdrIZXZhLRuTeFcLgYs2xWrxJaCJyhGRzAr/pubhtml?_x_tr_sl=ja&_x_tr_tl=en&_x_tr_hl=ja&_x_tr_pto=wapp"
            }
            target="_blank"
            class={css({
              display: "block",
            })}
          >
            {t("top.detailedBackground")}
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
