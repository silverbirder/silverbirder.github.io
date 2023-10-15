import { component$ } from "@builder.io/qwik";
import { Speak } from "qwik-speak";
import { OneSignal } from "~/components/one-signal/one-signal";

export default component$(() => {
  return (
    <Speak assets={["notification"]}>
      <OneSignal />
    </Speak>
  );
});
