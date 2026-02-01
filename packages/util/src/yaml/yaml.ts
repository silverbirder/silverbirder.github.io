const escapeYamlSingleQuotedString = (value: string) =>
  value.replace(/'/g, "''");

const normalizeStringList = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

const formatYamlStringList = (values: string[]) => {
  const normalized = normalizeStringList(values);
  if (normalized.length === 0) {
    return "[]";
  }
  const escaped = normalized.map(
    (value) => `'${escapeYamlSingleQuotedString(value)}'`,
  );
  return `[${escaped.join(", ")}]`;
};

export { escapeYamlSingleQuotedString, formatYamlStringList };
