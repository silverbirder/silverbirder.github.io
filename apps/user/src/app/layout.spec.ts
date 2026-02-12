import type { ReactNode } from "react";

import React, { isValidElement } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@repo/ui", () => ({
  Provider: ({ children }: { children: ReactNode }) =>
    React.createElement("div", { "data-provider": "ui" }, children),
  UserLayout: ({ children }: { children: ReactNode }) =>
    React.createElement("div", { "data-layout": "user" }, children),
}));

vi.mock("next-intl", () => ({
  NextIntlClientProvider: ({ children }: { children: ReactNode }) =>
    React.createElement("div", { "data-provider": "intl" }, children),
}));

const getMessages = vi.fn().mockResolvedValue({});

vi.mock("next-intl/server", () => ({
  getMessages,
}));

vi.mock("next/font/google", () => ({
  Klee_One: () => ({
    className: "klee-font",
    variable: "klee-font-variable",
  }),
}));

describe("RootLayout", () => {
  it("wraps children with intl provider and applies html and body attributes", async () => {
    const mod = await import("./layout");

    const ui = await import("@repo/ui");
    const nextIntl = await import("next-intl");

    const element = await mod.default({
      children: React.createElement("span", null, "child"),
    });

    expect(getMessages).toHaveBeenCalledTimes(1);
    expect(isValidElement(element)).toBe(true);
    expect(element.type).toBe("html");
    expect(element.props.lang).toBe("ja");

    const bodyElement = element.props.children;

    expect(bodyElement.type).toBe("body");
    expect(bodyElement.props.className).toBe("klee-font klee-font-variable");

    const bodyChildren = React.Children.toArray(bodyElement.props.children);
    const uiProviderCandidate = bodyChildren[0];

    expect(isValidElement(uiProviderCandidate)).toBe(true);
    if (!isValidElement(uiProviderCandidate)) {
      throw new Error("UI Provider element is missing");
    }
    const uiProviderElement = uiProviderCandidate as React.ReactElement<{
      children: ReactNode;
    }>;
    expect(uiProviderElement.type).toBe(ui.Provider);

    const intlProviderCandidate = uiProviderElement.props.children;
    expect(isValidElement(intlProviderCandidate)).toBe(true);
    if (!isValidElement(intlProviderCandidate)) {
      throw new Error("Intl Provider element is missing");
    }
    const intlProviderElement = intlProviderCandidate as React.ReactElement<{
      children: ReactNode;
    }>;
    expect(intlProviderElement.type).toBe(nextIntl.NextIntlClientProvider);

    const viewTransitionCandidate = intlProviderElement.props.children;
    expect(isValidElement(viewTransitionCandidate)).toBe(true);
    if (!isValidElement(viewTransitionCandidate)) {
      throw new Error("ViewTransition element is missing");
    }
    const viewTransitionElement =
      viewTransitionCandidate as React.ReactElement<{
        children: ReactNode;
      }>;
    const suspenseCandidate = viewTransitionElement.props.children;
    expect(isValidElement(suspenseCandidate)).toBe(true);
    if (!isValidElement(suspenseCandidate)) {
      throw new Error("Suspense element is missing");
    }
    expect(suspenseCandidate.type).toBe(React.Suspense);

    const suspenseElement = suspenseCandidate as React.ReactElement<{
      children: ReactNode;
    }>;
    const userLayoutCandidate = suspenseElement.props.children;
    expect(isValidElement(userLayoutCandidate)).toBe(true);
    if (!isValidElement(userLayoutCandidate)) {
      throw new Error("UserLayout element is missing");
    }
    expect(userLayoutCandidate.type).toBe(ui.UserLayout);

    const userLayoutElement = userLayoutCandidate as React.ReactElement<{
      children: ReactNode;
    }>;
    const userLayoutChild = userLayoutElement.props.children;
    expect(isValidElement(userLayoutChild)).toBe(true);
    if (!isValidElement(userLayoutChild)) {
      throw new Error("UserLayout child element is missing");
    }
    expect(userLayoutChild.type).toBe("span");
  });
});
