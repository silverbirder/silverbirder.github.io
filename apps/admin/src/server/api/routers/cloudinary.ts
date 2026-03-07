import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

import { env } from "@/env";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

cloudinary.config({
  cloudinary_url: env.CLOUDINARY_URL,
  secure: true,
});

const buildNotebookImageUrl = ({
  originalHeight,
  originalWidth,
  secureUrl,
}: {
  originalHeight: number;
  originalWidth: number;
  secureUrl: string;
}) => {
  const url = new URL(secureUrl);
  url.searchParams.set("ar", `${originalWidth}:${originalHeight}`);
  return url.href;
};

export const cloudinaryRouter = createTRPCRouter({
  upload: publicProcedure
    .input(
      z.object({
        dataUrl: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const uploadOptions: { folder?: string; resource_type: "image" } = {
        resource_type: "image",
      };

      if (env.CLOUDINARY_FOLDER) {
        uploadOptions.folder = env.CLOUDINARY_FOLDER;
      }

      const result = await cloudinary.uploader.upload(
        input.dataUrl,
        uploadOptions,
      );

      if (!result.secure_url) {
        throw new Error("Upload failed.");
      }

      if (!result.width || !result.height) {
        return { url: result.secure_url };
      }

      return {
        url: buildNotebookImageUrl({
          originalHeight: result.height,
          originalWidth: result.width,
          secureUrl: result.secure_url,
        }),
      };
    }),
});
