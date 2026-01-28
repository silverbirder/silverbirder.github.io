import { Me } from "@repo/user-feature-me";
import { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/util", async () => {
  const actual =
    await vi.importActual<typeof import("@repo/util")>("@repo/util");
  return {
    ...actual,
    buildSiteUrl: vi.fn((pathname: string) => `url:${pathname}`),
  };
});

import Page, { metadata } from "./page";

describe("MePage", () => {
  it("renders the me feature entry", () => {
    const element = Page();

    expect(isValidElement(element)).toBe(true);
    expect(element.type).toBe(Me);
  });

  it("defines metadata for the profile page", () => {
    expect(metadata.title).toBe("自己紹介");
    expect(metadata.alternates?.canonical).toBe("url:me/");
    expect(metadata.openGraph).toMatchObject({
      title: "自己紹介",
      type: "website",
      url: "url:me/",
    });
    expect(metadata.twitter).toMatchObject({
      title: "自己紹介",
    });
  });
});
