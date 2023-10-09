import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Speak } from "qwik-speak";
import { TopPage } from "~/components/pages/top-page/top-page";

export default component$(() => {
  return (
    <Speak assets={["top"]}>
      <TopPage />
    </Speak>
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
