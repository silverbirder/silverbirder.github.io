export type PostSummary = {
  publishedAt: string;
  slug: string;
  summary: string;
  tags: string[];
  title: string;
};

type Pagination = {
  currentPage: number;
  items: PostSummary[];
  totalPages: number;
};

type PaginationItem =
  | { isCurrent: boolean; page: number; type: "page" }
  | { key: string; type: "ellipsis" };

const PAGE_SIZE = 10;

const toDateValue = (publishedAt: string) => {
  const dateValue = Date.parse(publishedAt);
  return Number.isNaN(dateValue) ? 0 : dateValue;
};

const toYear = (publishedAt: string) => {
  const year = publishedAt.slice(0, 4);
  return /^\d{4}$/.test(year) ? year : null;
};

export const normalizePosts = (posts: PostSummary[]) => {
  return [...posts].sort(
    (a, b) => toDateValue(b.publishedAt) - toDateValue(a.publishedAt),
  );
};

export const getAvailableYears = (posts: PostSummary[]) => {
  const years = posts
    .map((post) => toYear(post.publishedAt))
    .filter((year): year is string => year !== null);

  return Array.from(new Set(years)).sort((a, b) => Number(b) - Number(a));
};

export const getAvailableTags = (posts: PostSummary[]) => {
  const tags = posts.flatMap((post) => post.tags);
  return Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b, "ja"));
};

export const filterPosts = (
  posts: PostSummary[],
  input: { tag: null | string; year: null | string },
) => {
  return posts.filter((post) => {
    if (input.year) {
      const year = toYear(post.publishedAt);
      if (year !== input.year) {
        return false;
      }
    }

    if (input.tag) {
      if (!post.tags.includes(input.tag)) {
        return false;
      }
    }

    return true;
  });
};

export const paginatePosts = (
  posts: PostSummary[],
  currentPage: number,
): Pagination => {
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const safePage = Number.isFinite(currentPage)
    ? Math.min(Math.max(1, Math.trunc(currentPage)), totalPages)
    : 1;
  const startIndex = (safePage - 1) * PAGE_SIZE;
  return {
    currentPage: safePage,
    items: posts.slice(startIndex, startIndex + PAGE_SIZE),
    totalPages,
  };
};

export const getPaginationItems = (
  currentPage: number,
  totalPages: number,
): PaginationItem[] => {
  if (totalPages <= 1) {
    return [];
  }

  const pages = new Set<number>([1, totalPages]);
  for (const offset of [-1, 0, 1]) {
    const page = currentPage + offset;
    if (page >= 1 && page <= totalPages) {
      pages.add(page);
    }
  }

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items: PaginationItem[] = [];

  let previous: null | number = null;
  for (const page of sorted) {
    if (previous !== null && page - previous > 1) {
      items.push({ key: `${previous}-${page}`, type: "ellipsis" });
    }
    items.push({ isCurrent: page === currentPage, page, type: "page" });
    previous = page;
  }

  return items;
};
