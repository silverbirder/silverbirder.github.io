import { escapeYamlSingleQuotedString, formatYamlStringList } from "@repo/util";

const formatTopics = (topics: string[]) => formatYamlStringList(topics);

type ZennDraft = {
  body: string;
  title: string;
  topics: string[];
  type: string;
};

export const generateZennSlug = () => {
  const length = 12;
  const bytes = new Uint8Array(length / 2);
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, length);
};

export const buildZennMarkdown = ({ body, title, topics, type }: ZennDraft) => {
  const normalizedTitle = escapeYamlSingleQuotedString(title);
  const normalizedType = escapeYamlSingleQuotedString(type);
  const normalizedTopics = formatTopics(topics);

  return `---\ntitle: '${normalizedTitle}'\ntype: '${normalizedType}'\ntopics: ${normalizedTopics}\npublished: false\n---\n\n${body}\n`;
};
