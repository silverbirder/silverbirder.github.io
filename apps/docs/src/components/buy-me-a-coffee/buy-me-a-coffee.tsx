import { component$ } from "@builder.io/qwik";
import Button from "./bmc-button.png?jsx";
import { css } from "~/styled-system/css";

export interface BuyMeACoffeeProps {}

export const BuyMeACoffee = component$<BuyMeACoffeeProps>(() => {
  return (
    <a
      href="https://www.buymeacoffee.com/silverbirdy"
      target="_blank"
      class={css({
        _hover: {
          opacity: 0.8,
        },
      })}
    >
      <Button
        class={css({
          display: "inline",
          width: 800 / 8,
          height: 225 / 8,
        })}
      />
    </a>
  );
});
