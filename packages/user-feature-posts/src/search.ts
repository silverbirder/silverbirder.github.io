export type SearchIndexItem = {
  body: string;
  publishedAt: string;
  slug: string;
  title: string;
};

type SearchDocument = {
  bodyText: string;
  dateValue: number;
  order: number;
  publishedAt: string;
  slug: string;
  title: string;
  titleText: string;
};

type SearchResult = {
  publishedAt: string;
  slug: string;
  title: string;
};

const normalizeText = (value: string) => value.trim().toLowerCase();

const toDateValue = (publishedAt: string) => {
  const dateValue = Date.parse(publishedAt);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

export const buildSearchIndex = (items: SearchIndexItem[]): SearchDocument[] =>
  items.map((item, order) => {
    const title = item.title ?? "";
    const body = item.body ?? "";
    return {
      bodyText: normalizeText(body),
      dateValue: toDateValue(item.publishedAt),
      order,
      publishedAt: item.publishedAt,
      slug: item.slug,
      title: item.title,
      titleText: normalizeText(title),
    };
  });

export const searchIndex = (
  documents: SearchDocument[],
  query: string,
  limit = 20,
): SearchResult[] => {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return [];
  }

  const matches = documents
    .map((doc) => {
      const titleIndex = doc.titleText.indexOf(normalizedQuery);
      const bodyIndex = doc.bodyText.indexOf(normalizedQuery);
      if (titleIndex < 0 && bodyIndex < 0) {
        return null;
      }

      const score = titleIndex >= 0 ? titleIndex : bodyIndex + 1000;
      return { doc, score };
    })
    .filter(
      (
        entry,
      ): entry is {
        doc: SearchDocument;
        score: number;
      } => entry !== null,
    )
    .sort((a, b) => {
      if (a.doc.dateValue !== b.doc.dateValue) {
        return b.doc.dateValue - a.doc.dateValue;
      }
      if (a.score !== b.score) {
        return a.score - b.score;
      }
      return a.doc.order - b.doc.order;
    })
    .slice(0, limit)
    .map(({ doc }) => ({
      publishedAt: doc.publishedAt,
      slug: doc.slug,
      title: doc.title,
    }));

  return matches;
};
