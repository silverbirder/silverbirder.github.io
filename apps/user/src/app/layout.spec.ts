import type { ReactNode } from "react";

import React, { isValidElement } from "react";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const GoogleAnalytics = vi.fn(({ gaId }: { gaId: string }) =>
  React.createElement("div", { "data-ga-id": gaId }),
);

const ClarityScript = vi.fn(({ projectId }: { projectId: string }) =>
  React.createElement("div", { "data-clarity-project-id": projectId }),
);

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

vi.mock("@next/third-parties/google", () => ({
  GoogleAnalytics,
}));

vi.mock("next/font/google", () => ({
  Klee_One: () => ({
    className: "klee-font",
    variable: "klee-font-variable",
  }),
}));

vi.mock("./clarity", () => ({
  ClarityScript,
}));

const originalGaId = process.env.GA_ID;
const originalClarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

describe("RootLayout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GA_ID;
    delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  });

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

  it("adds analytics scripts when GA and Clarity env vars are present", async () => {
    // Arrange
    process.env.GA_ID = "G-0000000000";
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = "clarity-project-id";
    const mod = await import("./layout");

    // Act
    const element = await mod.default({
      children: React.createElement("span", null, "child"),
    });

    // Assert
    expect(isValidElement(element)).toBe(true);
    if (!isValidElement(element)) {
      throw new Error("Root html element is missing");
    }

    const htmlElement = element as React.ReactElement<{ children: ReactNode }>;
    const bodyElement = htmlElement.props.children;
    expect(isValidElement(bodyElement)).toBe(true);
    if (!isValidElement(bodyElement)) {
      throw new Error("Body element is missing");
    }
    const bodyReactElement = bodyElement as React.ReactElement<{
      children: ReactNode;
    }>;
    const bodyChildren = React.Children.toArray(
      bodyReactElement.props.children,
    );
    const googleAnalyticsElement = bodyChildren[1];
    const clarityScriptElement = bodyChildren[2];

    expect(isValidElement(googleAnalyticsElement)).toBe(true);
    if (!isValidElement(googleAnalyticsElement)) {
      throw new Error("GoogleAnalytics element is missing");
    }
    const googleAnalyticsReactElement =
      googleAnalyticsElement as React.ReactElement<{ gaId: string }>;
    expect(googleAnalyticsReactElement.type).toBe(GoogleAnalytics);
    expect(googleAnalyticsReactElement.props.gaId).toBe("G-0000000000");

    expect(isValidElement(clarityScriptElement)).toBe(true);
    if (!isValidElement(clarityScriptElement)) {
      throw new Error("ClarityScript element is missing");
    }
    const clarityScriptReactElement =
      clarityScriptElement as React.ReactElement<{ projectId: string }>;
    expect(clarityScriptReactElement.type).toBe(ClarityScript);
    expect(clarityScriptReactElement.props.projectId).toBe(
      "clarity-project-id",
    );
  });
});

afterAll(() => {
  if (originalGaId === undefined) {
    delete process.env.GA_ID;
  } else {
    process.env.GA_ID = originalGaId;
  }

  if (originalClarityProjectId === undefined) {
    delete process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  } else {
    process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID = originalClarityProjectId;
  }
});
