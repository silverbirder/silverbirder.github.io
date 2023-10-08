import { component$, Slot } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export default component$(() => {
  return (
    <div
      class={css({
        margin: {
          base: "1% 5%",
          sm: "1% 10%",
          md: "1% 10%",
          lg: "1% 25%",
          xl: "1% 25%",
        },
      })}
    >
      <Slot />
    </div>
  );
});
