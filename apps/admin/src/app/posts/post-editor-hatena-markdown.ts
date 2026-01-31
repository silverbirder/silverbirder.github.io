const escapeHatenaTitle = (value: string) => value.replace(/\r?\n/g, " ");

type HatenaDraft = {
  body: string;
  title: string;
};

export const buildHatenaMarkdown = ({ body, title }: HatenaDraft) => {
  const normalizedTitle = escapeHatenaTitle(title);
  const safeTitle = normalizedTitle.length > 0 ? normalizedTitle : "Untitled";
  return `---\nTitle: ${safeTitle}\nDraft: true\n---\n\n${body}\n`;
};
