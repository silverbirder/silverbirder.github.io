import { api } from "@/trpc/server";

export const resolvePreview = async (source: string) => {
  "use server";
  return api.mdx.preview({ source });
};
