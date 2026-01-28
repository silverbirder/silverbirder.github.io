import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { NotebookProse } from "./notebook-prose";

const meta = {
  component: NotebookProse,
  title: "UI/Domain/NotebookProse",
} satisfies Meta<typeof NotebookProse>;

export default meta;
type Story = StoryObj<typeof meta>;

const richContent = (
  <>
    <h1>Notebook Prose</h1>
    <p>
      Notes stay aligned to the ruled grid, even when the content stretches over
      multiple lines.
    </p>
    <p>
      Inline <a href="https://example.com">links</a>, <strong>emphasis</strong>,
      <em> italics</em>, and <code>inline code</code> should feel balanced.
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
  </>
);

export const Ideal: Story = {
  args: {
    children: richContent,
    size: "md",
  },
};

export const Empty: Story = {
  args: {},
};

export const Error: Story = {
  args: {
    children: (
      <div role="alert">
        <h2>Failed to load</h2>
        <p>Something went wrong.</p>
      </div>
    ),
  },
};

export const Partial: Story = {
  args: {
    children: (
      <>
        <h2>Partial</h2>
        <p>Short content preview.</p>
      </>
    ),
    size: "lg",
  },
};

export const Loading: Story = {
  args: {
    children: (
      <div aria-busy>
        <h2>Loading…</h2>
        <p>Fetching content.</p>
      </div>
    ),
  },
};
