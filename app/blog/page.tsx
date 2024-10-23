import { NotebookLayout } from "@/components/notebook-layout";
import { BlogPosts } from "@/components/posts";
import { getBlogPosts } from "@/lib/blog";
import { Suspense } from "react";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  const allBlogs = getBlogPosts();
  return (
    <NotebookLayout pathname={"/blog"}>
      <Suspense>
        <BlogPosts allBlogs={allBlogs} />
      </Suspense>
    </NotebookLayout>
  );
}
