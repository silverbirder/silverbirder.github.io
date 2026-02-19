import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

const loadProxy = async () => {
  vi.resetModules();
  const mod = await import("./proxy");
  return mod.default;
};

describe("proxy", () => {
  it("allows /sign-in without redirect", async () => {
    const proxy = await loadProxy();

    const request = new NextRequest("https://example.com/sign-in");
    const response = await proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });

  it("allows other routes without redirect", async () => {
    const proxy = await loadProxy();

    const request = new NextRequest("https://example.com/dashboard");
    const response = await proxy(request);

    expect(response.headers.get("location")).toBeNull();
  });
});
