import { BlogPosts } from "@/components/posts";
import { getBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Read my blog.",
};

export default function Page() {
  const allBlogs = getBlogPosts();
  return <BlogPosts allBlogs={allBlogs} />;
}
