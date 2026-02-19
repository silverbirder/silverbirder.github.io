import { afterEach, describe, expect, it, vi } from "vitest";

const { ImageResponse } = vi.hoisted(() => ({
  ImageResponse: vi.fn().mockImplementation(function (...args) {
    return { args };
  }),
}));

vi.mock("next/og", () => ({
  ImageResponse,
}));

import Icon, { contentType, generateImageMetadata, iconSizes } from "./icon";

afterEach(() => {
  vi.clearAllMocks();
});

describe("icon", () => {
  it("builds a png icon response", async () => {
    const result = await Icon({ id: Promise.resolve(48) });

    expect(contentType).toBe("image/png");
    expect(ImageResponse).toHaveBeenCalledWith(expect.anything(), {
      height: 48,
      width: 48,
    });
    expect(result).toEqual({
      args: [expect.anything(), { height: 48, width: 48 }],
    });
  });

  it("uses the resolved id", async () => {
    await Icon({ id: Promise.resolve(72) });

    expect(ImageResponse).toHaveBeenCalledWith(expect.anything(), {
      height: 72,
      width: 72,
    });
  });

  it("returns icon metadata for all sizes", () => {
    const metadata = generateImageMetadata();

    expect(metadata).toHaveLength(iconSizes.length);
    expect(metadata[0]).toEqual({
      contentType,
      id: iconSizes[0],
      size: { height: iconSizes[0], width: iconSizes[0] },
    });
  });
});
