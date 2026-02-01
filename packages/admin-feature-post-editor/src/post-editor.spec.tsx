import { composeStories } from "@storybook/nextjs-vite";
import { describe, expect, it, vi } from "vitest";

import { PostEditor } from "./post-editor";
import * as stories from "./post-editor.stories";
import { renderWithProvider } from "./test-util";

const Stories = composeStories(stories);

describe("PostEditor", () => {
  const resolveLinkTitles = async (source: string) => source;
  const resolvePreview = async (source: string) => ({
    compiledSource: `/*@jsxRuntime automatic @jsxImportSource react*/\nimport { jsx as _jsx } from "react/jsx-runtime";\nexport default function MDXContent(){return _jsx("p", { children: ${JSON.stringify(source)} });}`,
    frontmatter: {},
    scope: {},
  });
  const uploadImage = async () => ({
    url: "https://res.cloudinary.com/demo/image/upload/sample.png",
  });
  const openDrawer = async () => {
    const drawerTrigger = document.querySelector(
      "[data-testid='post-editor-drawer-trigger']",
    );
    drawerTrigger?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 0));
  };

  it.each(Object.entries(Stories))("should %s snapshot", async (_, Story) => {
    const originalInnerHtml = document.body.innerHTML;

    await Story.run();

    await expect(document.body).toMatchScreenshot();

    document.body.innerHTML = originalInnerHtml;
  });

  it("renders labels and placeholders from messages", async () => {
    await renderWithProvider(
      <PostEditor
        resolveLinkTitles={resolveLinkTitles}
        resolvePreview={resolvePreview}
        tagSuggestions={["TypeScript"]}
        uploadImage={uploadImage}
      />,
    );

    await openDrawer();

    const labels = Array.from(document.querySelectorAll("label")).map(
      (label) => label.textContent ?? "",
    );
    const titleInput = document.querySelector("input[name='title']");
    const publishedAtInput = document.querySelector(
      "input[name='publishedAt']",
    );
    const tagsInput = document.querySelector("input[name='tags']");
    const bodyInput = document.querySelector("textarea[name='body']");

    expect(labels.some((label) => label.includes("タイトル"))).toBe(false);
    expect(labels.some((label) => label.includes("公開日"))).toBe(true);
    expect(labels.some((label) => label.includes("タグ"))).toBe(true);
    expect(labels.some((label) => label.includes("本文"))).toBe(false);
    expect(titleInput?.getAttribute("placeholder") ?? "").not.toBe("");
    expect(publishedAtInput).not.toBeNull();
    expect(tagsInput?.getAttribute("placeholder") ?? "").not.toBe("");
    expect(bodyInput?.getAttribute("placeholder") ?? "").not.toBe("");
  });

  it("adds tags from the input", async () => {
    await renderWithProvider(
      <PostEditor
        resolveLinkTitles={resolveLinkTitles}
        resolvePreview={resolvePreview}
        uploadImage={uploadImage}
      />,
    );

    await openDrawer();

    const tagInput = document.querySelector(
      "input[name='tags']",
    ) as HTMLInputElement | null;

    expect(tagInput).not.toBeNull();

    if (tagInput) {
      tagInput.value = "TypeScript";
      tagInput.dispatchEvent(new Event("input", { bubbles: true }));
      tagInput.dispatchEvent(
        new KeyboardEvent("keydown", { bubbles: true, key: "Enter" }),
      );
    }

    await expect
      .poll(() => document.querySelectorAll("[data-testid='post-editor-tag']"))
      .toHaveLength(1);
  });

  it("keeps body focused while preview loads", async () => {
    vi.useFakeTimers();

    try {
      await renderWithProvider(
        <PostEditor
          resolveLinkTitles={resolveLinkTitles}
          resolvePreview={() => new Promise(() => undefined)}
          uploadImage={uploadImage}
        />,
      );

      const bodyInput = document.querySelector(
        "textarea[name='body']",
      ) as HTMLTextAreaElement | null;

      bodyInput?.focus();
      if (bodyInput) {
        bodyInput.value = "Hello";
        bodyInput.dispatchEvent(new Event("input", { bubbles: true }));
      }

      await vi.advanceTimersByTimeAsync(400);

      expect(document.activeElement).toBe(bodyInput);
    } finally {
      vi.useRealTimers();
    }
  });

  it("uploads dropped images and inserts markdown", async () => {
    const uploadUrl =
      "https://res.cloudinary.com/example/image/upload/sample.png";
    const uploadMock = vi.fn().mockResolvedValue({ url: uploadUrl });

    try {
      await renderWithProvider(
        <PostEditor
          resolveLinkTitles={resolveLinkTitles}
          resolvePreview={resolvePreview}
          uploadImage={uploadMock}
        />,
      );

      const dropzone = document.querySelector(
        "[data-testid='post-editor-body-dropzone']",
      );

      expect(dropzone).not.toBeNull();

      const file = new File(["dummy"], "sample-image.png", {
        type: "image/png",
      });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      const dropEvent = new Event("drop", { bubbles: true }) as DragEvent;
      Object.defineProperty(dropEvent, "dataTransfer", {
        value: dataTransfer,
      });

      dropzone?.dispatchEvent(dropEvent);

      await expect
        .poll(() => {
          const textarea = document.querySelector(
            "textarea[name='body']",
          ) as HTMLTextAreaElement | null;
          return textarea?.value ?? "";
        })
        .toContain(uploadUrl);

      expect(uploadMock).toHaveBeenCalledOnce();
      const formData = uploadMock.mock.calls[0]?.[0] as FormData | undefined;
      const uploadedFile = formData?.get("file");
      expect(uploadedFile instanceof File).toBe(true);
      expect((uploadedFile as File | null)?.name).toBe("sample-image.png");
    } finally {
      uploadMock.mockReset();
    }
  });

  it("creates a Zenn draft payload when Zenn sync is enabled", async () => {
    const onCreatePullRequest = vi.fn().mockResolvedValue(undefined);
    const getRandomValues = (arr: Uint8Array) => {
      arr.fill(1);
      return arr;
    };
    vi.stubGlobal("crypto", { getRandomValues });

    await renderWithProvider(
      <PostEditor
        enableZennSync
        initialBody="Hello"
        initialTitle="Title"
        initialZennEnabled
        onCreatePullRequest={onCreatePullRequest}
        resolveLinkTitles={resolveLinkTitles}
        resolvePreview={resolvePreview}
        uploadImage={uploadImage}
      />,
    );

    await openDrawer();

    const button = document.querySelector(
      "[data-testid='post-editor-create-pull-request']",
    ) as HTMLButtonElement | null;
    await expect.poll(() => button?.disabled).toBe(false);
    button?.click();

    await expect.poll(() => onCreatePullRequest.mock.calls.length).toBe(1);

    const payload = onCreatePullRequest.mock.calls[0]?.[0];
    expect(payload.zenn?.enabled).toBe(true);
    expect(payload.zenn?.slug).toBe("010101010101");
    expect(payload.zenn?.type).toBe("tech");
    expect(payload.index).toBe(false);
  });

  it("creates a Hatena draft payload when Hatena sync is enabled", async () => {
    const onCreatePullRequest = vi.fn().mockResolvedValue(undefined);

    await renderWithProvider(
      <PostEditor
        enableHatenaSync
        initialBody="Hello"
        initialHatenaEnabled
        initialTitle="Title"
        onCreatePullRequest={onCreatePullRequest}
        resolveLinkTitles={resolveLinkTitles}
        resolvePreview={resolvePreview}
        uploadImage={uploadImage}
      />,
    );

    await openDrawer();

    const button = document.querySelector(
      "[data-testid='post-editor-create-pull-request']",
    ) as HTMLButtonElement | null;
    await expect.poll(() => button?.disabled).toBe(false);
    button?.click();

    await expect.poll(() => onCreatePullRequest.mock.calls.length).toBe(1);

    const payload = onCreatePullRequest.mock.calls[0]?.[0];
    expect(payload.hatena?.enabled).toBe(true);
    expect(payload.index).toBe(false);
  });
});
