import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotebookComments } from "./notebook-comments";

type MockState = "empty" | "error" | "ideal" | "loading" | "partial";

const buildComments = (state: MockState) => {
  if (state === "empty") {
    return [];
  }
  if (state === "partial") {
    return [
      {
        body: "一部だけ表示するコメント",
        createdAt: "2026-01-02T03:04:05.000Z",
        id: 1,
        mine: false,
      },
    ];
  }
  return [
    {
      body: "これはサンプルコメントです",
      createdAt: "2026-01-02T03:04:05.000Z",
      id: 1,
      mine: false,
    },
    {
      body: "2件目のコメントです",
      createdAt: "2026-01-02T04:05:06.000Z",
      id: 2,
      mine: false,
    },
  ];
};

const meta: Meta<typeof NotebookComments> = {
  component: NotebookComments,
  decorators: [
    (Story, context) => {
      const state = (context.parameters.mockState as MockState) ?? "ideal";
      const mockFetch: typeof fetch = async (_input, init) => {
        const method = init?.method ?? "GET";

        if (state === "loading" && method === "GET") {
          return await new Promise<Response>(() => {});
        }

        if (state === "error") {
          return new Response("error", { status: 500 });
        }

        if (method === "POST") {
          return new Response(
            JSON.stringify({
              comment: {
                body: "投稿したコメント",
                createdAt: "2026-01-02T05:06:07.000Z",
                id: 99,
                mine: true,
              },
            }),
            { headers: { "Content-Type": "application/json" }, status: 200 },
          );
        }

        if (method === "DELETE") {
          return new Response(JSON.stringify({ ok: true }), {
            headers: { "Content-Type": "application/json" },
            status: 200,
          });
        }

        return new Response(
          JSON.stringify({ comments: buildComments(state) }),
          {
            headers: { "Content-Type": "application/json" },
            status: 200,
          },
        );
      };

      (globalThis as typeof globalThis & { fetch: typeof fetch }).fetch =
        mockFetch;
      window.localStorage.setItem("comments:anon-id", "storybook-anon-id");

      return <Story />;
    },
  ],
  title: "UI/Domain/NotebookComments",
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Ideal: Story = {
  args: {
    slug: "ideal-post",
  },
  parameters: {
    mockState: "ideal" satisfies MockState,
  },
};

export const Empty: Story = {
  args: {
    slug: "empty-post",
  },
  parameters: {
    mockState: "empty" satisfies MockState,
  },
};

export const Error: Story = {
  args: {
    slug: "error-post",
  },
  parameters: {
    mockState: "error" satisfies MockState,
  },
};

export const Partial: Story = {
  args: {
    slug: "partial-post",
  },
  parameters: {
    mockState: "partial" satisfies MockState,
  },
};

export const Loading: Story = {
  args: {
    slug: "loading-post",
  },
  parameters: {
    mockState: "loading" satisfies MockState,
  },
};
