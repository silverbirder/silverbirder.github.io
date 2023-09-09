import { component$ } from "@builder.io/qwik";
import Index from "./index.json";
import { css } from "~/styled-system/css";
import { Card } from "~/components/card/card";

export const Cards = component$(() => {
  return (
    <div
      class={css({
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 20,
      })}
    >
      {Index.items.map((item) => (
        <Card
          key={item.name}
          name={item.name}
          image={item.image}
          width={item.width}
          height={item.height}
          date={item.date}
          shopLink={item.url}
        />
      ))}
    </div>
  );
});
