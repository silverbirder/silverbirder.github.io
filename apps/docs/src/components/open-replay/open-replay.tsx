import { component$, useVisibleTask$ } from "@builder.io/qwik";

export interface OpenReplayProps {}

export const OpenReplay = component$<OpenReplayProps>(() => {
  useVisibleTask$(async () => {
    const { default: Tracker } = await import("@openreplay/tracker");
    const { default: trackerAssist } = await import(
      "@openreplay/tracker-assist"
    );
    const tracker = new Tracker({
      projectKey: import.meta.env.PUBLIC_OPEN_REPLAY_PROJECT_KEY,
      __DISABLE_SECURE_MODE: true,
    });
    tracker.use(trackerAssist());
    tracker.start();
  });
  return <></>;
});
