const escapeYamlSingleQuotedString = (value: string) =>
  value.replace(/'/g, "''");

const formatTopics = (topics: string[]) => {
  const normalized = Array.from(
    new Set(topics.map((topic) => topic.trim()).filter(Boolean)),
  );
  if (normalized.length === 0) {
    return "[]";
  }
  const escaped = normalized.map(
    (topic) => `'${escapeYamlSingleQuotedString(topic)}'`,
  );
  return `[${escaped.join(", ")}]`;
};

type ZennDraft = {
  body: string;
  title: string;
  topics: string[];
  type: string;
};

export const buildZennMarkdown = ({ body, title, topics, type }: ZennDraft) => {
  const normalizedTitle = escapeYamlSingleQuotedString(title);
  const normalizedType = escapeYamlSingleQuotedString(type);
  const normalizedTopics = formatTopics(topics);

  return `---\ntitle: '${normalizedTitle}'\ntype: '${normalizedType}'\ntopics: ${normalizedTopics}\npublished: false\n---\n\n${body}\n`;
};
