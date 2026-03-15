const toSafeKeyPart = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "_");

export const userLocalStorageKeyCatalog = {
  blogSearchIndexCache: {
    description: "ブログ検索インデックスのキャッシュ本体",
    key: "blog-search-index",
  },
  blogSearchIndexVersion: {
    description: "ブログ検索インデックスキャッシュのバージョン",
    key: "blog-search-index-version",
  },
  commentsAnonId: {
    description: "ノートコメント投稿用の匿名ユーザー ID",
    key: "comments:anon-id",
  },
  likeAnonId: {
    description: "記事ごとのいいね匿名ユーザー ID",
    keyPattern: "likes:{namespace}:{name}",
  },
} as const;

export const userLocalStorageKeys = {
  blogSearchIndexCache: userLocalStorageKeyCatalog.blogSearchIndexCache.key,
  blogSearchIndexVersion: userLocalStorageKeyCatalog.blogSearchIndexVersion.key,
  commentsAnonId: userLocalStorageKeyCatalog.commentsAnonId.key,
  likeAnonId: (namespace: string, name: string) =>
    `likes:${toSafeKeyPart(namespace)}:${toSafeKeyPart(name)}`,
} as const;

const getSafeLocalStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
};

export const getLocalStorageItem = (key: string) =>
  getSafeLocalStorage()?.getItem(key) ?? null;

export const setLocalStorageItem = (key: string, value: string) => {
  const storage = getSafeLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

export const removeLocalStorageItem = (key: string) => {
  const storage = getSafeLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
};

export const getOrCreateLocalStorageItem = (
  key: string,
  createValue: () => string,
) => {
  const stored = getLocalStorageItem(key);
  if (stored) {
    return stored;
  }

  const value = createValue();
  setLocalStorageItem(key, value);
  return value;
};
