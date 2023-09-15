import {
  component$,
  useStore,
  useSignal,
  noSerialize,
  useVisibleTask$,
} from "@builder.io/qwik";
import lottie from "lottie-web";

type renderer = "svg";

interface Options {
  container?: any;
  renderer?: renderer;
  loop?: boolean;
  autoplay?: boolean;
  animationData?: object;
  path?: string;
  rendererSettings?: object;
  name?: string;
}

export interface LottieProps {
  options: Options;
}

export const Lottie = component$(({ options }: LottieProps) => {
  const store = useStore({
    anim: noSerialize({}),
  });
  const canvas = useSignal<Element>();

  useVisibleTask$(() => {
    store.anim = noSerialize(
      lottie.loadAnimation({
        container: options.container || canvas.value,
        renderer: options.renderer || "svg",
        loop: options.loop || true,
        autoplay: options.autoplay || true,
        animationData: options.animationData,
        path: options.path,
        rendererSettings: options.rendererSettings,
        name: options.name,
      })
    );
  });

  return <div ref={canvas}></div>;
});
