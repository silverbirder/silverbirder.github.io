import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

type CapturedProps = {
  enableHatenaSync?: boolean;
  enableZennSync?: boolean;
};

let capturedProps: unknown = null;

const createPullRequestMutation = {
  isPending: false,
  mutateAsync: vi.fn(),
};
const createZennPullRequestMutation = {
  isPending: false,
  mutateAsync: vi.fn(),
};
const createHatenaPullRequestMutation = {
  isPending: false,
  mutateAsync: vi.fn(),
};

vi.mock("@/trpc/react", () => ({
  api: {
    github: {
      createPullRequest: {
        useMutation: () => createPullRequestMutation,
      },
      list: {
        useQuery: () => ({
          data: ["20260101.md"],
          isError: false,
          isLoading: false,
        }),
      },
      listTags: {
        useQuery: () => ({ data: ["tag"], isError: false, isLoading: false }),
      },
    },
    hatena: {
      createPullRequest: {
        useMutation: () => createHatenaPullRequestMutation,
      },
    },
    zenn: {
      createPullRequest: {
        useMutation: () => createZennPullRequestMutation,
      },
    },
  },
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("@repo/admin-feature-post-editor", () => ({
  PostEditor: (props: CapturedProps) => {
    capturedProps = props;
    return React.createElement("div", { "data-testid": "post-editor" });
  },
}));

import { PostEditorWithPullRequest } from "./post-editor-with-pull-request";

describe("PostEditorWithPullRequest", () => {
  it("passes Hatena and Zenn sync flags to PostEditor", async () => {
    capturedProps = null;
    const element = (
      <PostEditorWithPullRequest
        resolveLinkTitles={async (source) => source}
        resolvePreview={async () => ({
          compiledSource: "",
          frontmatter: {},
          scope: {},
        })}
        uploadImage={async () => ({ url: "https://example.com" })}
      />
    );

    renderToStaticMarkup(element);

    const props = capturedProps as CapturedProps | null;
    expect(props?.enableHatenaSync).toBe(true);
    expect(props?.enableZennSync).toBe(true);
  });
});
