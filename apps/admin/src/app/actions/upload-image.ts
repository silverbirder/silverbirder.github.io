import { api } from "@/trpc/server";

export const uploadImage = async (formData: FormData) => {
  "use server";
  const file = formData.get("file");

  if (!(file instanceof File)) {
    throw new Error("Invalid file.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Unsupported file type.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${file.type};base64,${base64}`;

  return api.cloudinary.upload({ dataUrl });
};
