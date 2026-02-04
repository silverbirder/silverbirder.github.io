import { describe, expect, it, vi } from "vitest";

const loadAction = async () => {
  vi.resetModules();

  const upload = vi.fn().mockResolvedValue({
    url: "https://res.cloudinary.com/demo/image/upload/sample.png",
  });

  vi.doMock("@/trpc/server", () => ({
    api: {
      cloudinary: {
        upload,
      },
    },
  }));

  const mod = await import("./upload-image");

  return {
    upload,
    uploadImage: mod.uploadImage,
  };
};

describe("uploadImage", () => {
  it("delegates to the cloudinary upload procedure", async () => {
    const { upload, uploadImage } = await loadAction();

    const file = new File(["sample"], "sample.png", { type: "image/png" });
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadImage(formData);

    const expectedBase64 = Buffer.from("sample").toString("base64");
    expect(upload).toHaveBeenCalledWith({
      dataUrl: `data:image/png;base64,${expectedBase64}`,
    });
    expect(result).toEqual({
      url: "https://res.cloudinary.com/demo/image/upload/sample.png",
    });
  });

  it("accepts a Blob payload with an image type", async () => {
    const { upload, uploadImage } = await loadAction();

    const blob = new Blob(["blob-data"], { type: "image/png" });
    const formData = new FormData();
    formData.append("file", blob);

    const result = await uploadImage(formData);

    const expectedBase64 = Buffer.from("blob-data").toString("base64");
    expect(upload).toHaveBeenCalledWith({
      dataUrl: `data:image/png;base64,${expectedBase64}`,
    });
    expect(result).toEqual({
      url: "https://res.cloudinary.com/demo/image/upload/sample.png",
    });
  });
});
