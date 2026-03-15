const toSafeKeyPart = (value: string) => value.replace(/[^a-zA-Z0-9-_]/g, "_");
const LIKES_STORAGE_KEY = "likes";
const READ_POSTS_STORAGE_KEY = "read-posts";
const LEGACY_LIKES_KEY_PREFIX = "likes:";

const createScopedEntryKey = (namespace: string, name: string) =>
  `${toSafeKeyPart(namespace)}:${toSafeKeyPart(name)}`;

const parseStringRecord = (value: null | string) => {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter((entry): entry is [string, string] => {
        const [, itemValue] = entry;
        return typeof itemValue === "string";
      }),
    );
  } catch {
    return {};
  }
};

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
    key: LIKES_STORAGE_KEY,
    legacyKeyPattern: "likes:{namespace}:{name}",
  },
  readPostAt: {
    description: "記事ごとの閲覧日時",
    key: READ_POSTS_STORAGE_KEY,
  },
} as const;

export const userLocalStorageKeys = {
  blogSearchIndexCache: userLocalStorageKeyCatalog.blogSearchIndexCache.key,
  blogSearchIndexVersion: userLocalStorageKeyCatalog.blogSearchIndexVersion.key,
  commentsAnonId: userLocalStorageKeyCatalog.commentsAnonId.key,
  legacyLikeAnonId: (namespace: string, name: string) =>
    `${LEGACY_LIKES_KEY_PREFIX}${createScopedEntryKey(namespace, name)}`,
  likeAnonId: userLocalStorageKeyCatalog.likeAnonId.key,
  readPostAt: userLocalStorageKeyCatalog.readPostAt.key,
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

const getLikeAnonIdMap = (storage: Storage) =>
  parseStringRecord(storage.getItem(LIKES_STORAGE_KEY));

const setLikeAnonIdMap = (storage: Storage, value: Record<string, string>) => {
  storage.setItem(LIKES_STORAGE_KEY, JSON.stringify(value));
};

const getReadPostMap = (storage: Storage) =>
  parseStringRecord(storage.getItem(READ_POSTS_STORAGE_KEY));

const setReadPostMap = (storage: Storage, value: Record<string, string>) => {
  storage.setItem(READ_POSTS_STORAGE_KEY, JSON.stringify(value));
};

const migrateLegacyLikeAnonIds = (storage: Storage) => {
  const merged = getLikeAnonIdMap(storage);
  const legacyKeys: string[] = [];

  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index);
    if (!key || !key.startsWith(LEGACY_LIKES_KEY_PREFIX)) {
      continue;
    }

    const value = storage.getItem(key);
    if (!value) {
      continue;
    }

    const entryKey = key.slice(LEGACY_LIKES_KEY_PREFIX.length);
    merged[entryKey] ??= value;
    legacyKeys.push(key);
  }

  if (legacyKeys.length === 0) {
    return merged;
  }

  setLikeAnonIdMap(storage, merged);

  for (const key of legacyKeys) {
    storage.removeItem(key);
  }

  return merged;
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

export const getOrCreateLikeAnonId = (
  namespace: string,
  name: string,
  createValue: () => string,
) => {
  const storage = getSafeLocalStorage();
  if (!storage) {
    return createValue();
  }

  try {
    const entryKey = createScopedEntryKey(namespace, name);
    const likes = migrateLegacyLikeAnonIds(storage);
    const stored = likes[entryKey];
    if (stored) {
      return stored;
    }

    const value = createValue();
    setLikeAnonIdMap(storage, { ...likes, [entryKey]: value });
    return value;
  } catch {
    return createValue();
  }
};

export const markPostAsRead = (
  namespace: string,
  name: string,
  readAt = new Date().toISOString(),
) => {
  const storage = getSafeLocalStorage();
  if (!storage) {
    return false;
  }

  try {
    const entryKey = createScopedEntryKey(namespace, name);
    const readPosts = getReadPostMap(storage);
    setReadPostMap(storage, { ...readPosts, [entryKey]: readAt });
    return true;
  } catch {
    return false;
  }
};
