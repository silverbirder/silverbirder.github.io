import { component$, Slot } from "@builder.io/qwik";
import { BlogLayout } from "~/components/pages/blog-layout/blog-layout";

export default component$(() => {
  return (
    <BlogLayout>
      <Slot />
    </BlogLayout>
  );
});
