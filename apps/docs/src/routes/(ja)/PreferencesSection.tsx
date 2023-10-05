import { component$ } from "@builder.io/qwik";
import { LogosGoogleCloudPlatform } from "~/components/icon/icon";
import {
  LogosGoogleMaps,
  LogosJavascript,
  LogosJest,
  LogosNodejsIcon,
  LogosOpenaiIcon,
  LogosPlaywright,
  LogosStorybookIcon,
  LogosWebcomponents,
} from "~/components/icon/logos";
import {
  OriginalBeardPapas,
  OriginalBigQuery,
  OriginalMisterDonuts,
} from "~/components/icon/original";
import { css } from "~/styled-system/css";

export const PreferencesSection = component$(() => {
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
          class={css({
            layerStyle: "advancedIcon",
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
        <LogosWebcomponents
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <LogosStorybookIcon
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <LogosJest
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <LogosPlaywright
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <LogosGoogleCloudPlatform
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <OriginalBigQuery
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <LogosGoogleMaps
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
        <OriginalMisterDonuts
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
        <OriginalBeardPapas
          class={css({
            layerStyle: "beginnerIcon",
            width: "icon.main",
            height: "icon.main",
          })}
        />
      </div>
    </section>
  );
});
