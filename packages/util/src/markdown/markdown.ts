const hasFrontmatter = (source: string) => {
  const trimmed = source.trimStart();
  if (!trimmed.startsWith("---")) {
    return false;
  }
  return /^---\n[\s\S]*?\n---\n/.test(trimmed);
};

export { hasFrontmatter };
