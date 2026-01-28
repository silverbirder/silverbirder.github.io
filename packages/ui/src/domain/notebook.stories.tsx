import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Notebook } from "./notebook";
import { NotebookImage } from "./notebook-image";

const meta = {
  component: Notebook,
  title: "UI/Domain/Notebook",
} satisfies Meta<typeof Notebook>;

export default meta;

type Story = StoryObj<typeof meta>;

const bodyContent = (
  <>
    <h1>Notebook Layout</h1>
    <p>
      Notes stay aligned to the ruled grid, even when the content stretches over
      multiple lines.
    </p>
    <p>
      Use this style for blog articles to keep the rhythm calm and evenly
      spaced.
    </p>
    <p>
      Inline{" "}
      <a href="https://example.com" rel="noreferrer" target="_blank">
        links
      </a>{" "}
      and <strong>emphasis</strong>, <em>italics</em>, and{" "}
      <code>inline code</code>
      should feel balanced.
    </p>
    <blockquote>
      <p>Blockquotes get their own margin and a subtle inline border.</p>
    </blockquote>
    <hr />
    <h2>Lists</h2>
    <ul>
      <li>Unordered list item</li>
      <li>
        Another item with nested list
        <ul>
          <li>Nested bullet</li>
          <li>Second nested bullet</li>
        </ul>
      </li>
    </ul>
    <ol>
      <li>Ordered list item</li>
      <li>
        Second item with nested list
        <ol>
          <li>Nested number</li>
          <li>Second nested number</li>
        </ol>
      </li>
    </ol>
    <h2>Definition List</h2>
    <dl>
      <dt>Notebook</dt>
      <dd>Layouts that follow a consistent baseline rhythm.</dd>
    </dl>
    <h2>Code Block</h2>
    <pre>
      <code className="language-shell">
        pnpm turbo run build --filter @repo/ui
      </code>
    </pre>
    <h2>Table</h2>
    <table>
      <thead>
        <tr>
          <th>Resource</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Workloads</td>
          <td>Runs and scales containers.</td>
        </tr>
        <tr>
          <td>Discovery</td>
          <td>Publishes endpoints for services.</td>
        </tr>
      </tbody>
    </table>
    <h2>Figure</h2>
    <figure>
      <NotebookImage
        alt="Notebook placeholder"
        src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='100%25' height='100%25' fill='%23e7e4e4'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%237a7a7a'%3ENotebook%20Image%3C/text%3E%3C/svg%3E"
      />
      <figcaption>A figure caption aligned to the grid.</figcaption>
    </figure>
    <h2>Keyboard</h2>
    <p>
      Press <kbd>Cmd</kbd> + <kbd>K</kbd> to open the command palette.
    </p>
    <h2>Video</h2>
    <video
      controls
      poster="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='360'%3E%3Crect width='100%25' height='100%25' fill='%23e7e4e4'/%3E%3Ctext x='50%25' y='50%25' font-size='24' text-anchor='middle' dominant-baseline='middle' fill='%237a7a7a'%3EVideo%20Placeholder%3C/text%3E%3C/svg%3E"
      width="100%"
    >
      Your browser does not support the video tag.
    </video>
  </>
);

export const Ideal: Story = {
  args: {
    children: bodyContent,
    navigation: {},
    postNumber: 12,
    publishedAt: "2025-01-12",
    relatedPosts: [],
    tags: ["Notebook", "UI"],
    title: "Notebook Preview",
  },
};

export const Empty: Story = {
  args: {
    children: null,
    navigation: {},
    relatedPosts: [],
    tags: [],
    title: "Notebook Preview",
  },
};

export const Error: Story = {
  args: {
    children: <p role="alert">We could not load this entry.</p>,
    navigation: {},
    postNumber: 12,
    publishedAt: "2025-01-12",
    relatedPosts: [],
    tags: ["Draft"],
    title: "Notebook Preview",
  },
};

export const Partial: Story = {
  args: {
    children: (
      <>
        <h2>Summary</h2>
        <p>Only the key takeaway for now.</p>
      </>
    ),
    navigation: {},
    postNumber: 12,
    publishedAt: "2025-01-12",
    relatedPosts: [],
    tags: [],
    title: "Notebook Preview",
  },
};

export const Loading: Story = {
  args: {
    children: <p aria-busy="true">Loading notes...</p>,
    navigation: {},
    postNumber: 12,
    publishedAt: "2025-01-12",
    relatedPosts: [],
    tags: ["Loading"],
    title: "Notebook Preview",
  },
};

export const WithNavigation: Story = {
  args: {
    children: bodyContent,
    navigation: {
      next: {
        href: "/blog/contents/next-post",
        publishedAt: "2025-01-13",
        title: "Next Post Title",
      },
      prev: {
        href: "/blog/contents/prev-post",
        publishedAt: "2025-01-11",
        title: "Previous Post Title",
      },
    },
    postNumber: 12,
    publishedAt: "2025-01-12",
    relatedPosts: [],
    tags: ["Notebook", "UI"],
    title: "Notebook Preview",
  },
};
