import { component$, useStore } from "@builder.io/qwik";
import { Lottie } from "~/components/lottie/lottie";
import notFoundJson from "~/components/lottie/not-found.json";

export default component$(() => {
  const store = useStore({
    options: {
      animationData: notFoundJson,
    },
  });
  return <Lottie options={store.options} />;
});
