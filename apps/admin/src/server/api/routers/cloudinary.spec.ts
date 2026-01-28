import { describe, expect, it, vi } from "vitest";

import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/env", () => ({
  env: {
    ADMIN_ALLOWED_EMAILS: "allowed@example.com",
    CLOUDINARY_FOLDER: "blog",
    CLOUDINARY_URL: "cloudinary://key:secret@cloud",
  },
}));

const uploadMock = vi.fn();

vi.mock("cloudinary", () => ({
  v2: {
    config: vi.fn(),
    uploader: {
      upload: (...args: Parameters<typeof uploadMock>) => uploadMock(...args),
    },
  },
}));

const { session } = vi.hoisted(() => ({
  session: {
    session: {
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      id: "session-1",
      token: "session-token",
      updatedAt: new Date(),
      userId: "user-1",
    },
    user: {
      createdAt: new Date(),
      email: "allowed@example.com",
      emailVerified: true,
      id: "user-1",
      name: "Allowed User",
      updatedAt: new Date(),
    },
  },
}));

import { cloudinaryRouter } from "./cloudinary";

const createCaller = createCallerFactory(cloudinaryRouter);

describe("cloudinaryRouter.upload", () => {
  it("uploads the image and returns the secure url", async () => {
    uploadMock.mockResolvedValue({
      secure_url: "https://res.cloudinary.com/demo/image/upload/sample.png",
    });

    const caller = createCaller({
      headers: new Headers(),
      session,
    });

    const result = await caller.upload({
      dataUrl: "data:image/png;base64,AAA",
    });

    expect(uploadMock).toHaveBeenCalledWith(
      "data:image/png;base64,AAA",
      expect.objectContaining({
        folder: "blog",
        resource_type: "image",
      }),
    );
    expect(result).toEqual({
      url: "https://res.cloudinary.com/demo/image/upload/sample.png",
    });
  });
});
