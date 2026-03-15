import { describe, expect, it, vi } from "vitest";

import {
  getLocalStorageItem,
  getOrCreateLikeAnonId,
  getOrCreateLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
  userLocalStorageKeyCatalog,
  userLocalStorageKeys,
} from "./index";

describe("@repo/user-local-storage", () => {
  it("publishes a local storage key catalog", () => {
    expect(userLocalStorageKeyCatalog.blogSearchIndexCache).toEqual({
      description: "ブログ検索インデックスのキャッシュ本体",
      key: "blog-search-index",
    });
    expect(userLocalStorageKeyCatalog.blogSearchIndexVersion).toEqual({
      description: "ブログ検索インデックスキャッシュのバージョン",
      key: "blog-search-index-version",
    });
    expect(userLocalStorageKeyCatalog.commentsAnonId).toEqual({
      description: "ノートコメント投稿用の匿名ユーザー ID",
      key: "comments:anon-id",
    });
    expect(userLocalStorageKeyCatalog.likeAnonId).toEqual({
      description: "記事ごとのいいね匿名ユーザー ID",
      key: "likes",
      legacyKeyPattern: "likes:{namespace}:{name}",
    });
  });

  it("manages predefined keys and like storage keys", () => {
    expect(userLocalStorageKeys.blogSearchIndexCache).toBe(
      userLocalStorageKeyCatalog.blogSearchIndexCache.key,
    );
    expect(userLocalStorageKeys.blogSearchIndexVersion).toBe(
      userLocalStorageKeyCatalog.blogSearchIndexVersion.key,
    );
    expect(userLocalStorageKeys.commentsAnonId).toBe(
      userLocalStorageKeyCatalog.commentsAnonId.key,
    );
    expect(userLocalStorageKeys.likeAnonId).toBe("likes");
    expect(
      userLocalStorageKeys.legacyLikeAnonId("name space", "page/slug"),
    ).toBe("likes:name_space:page_slug");
  });

  it("gets existing value from local storage", () => {
    const getItemMock = vi.fn().mockReturnValue("stored-value");
    vi.stubGlobal("window", {
      localStorage: {
        getItem: getItemMock,
        removeItem: vi.fn(),
        setItem: vi.fn(),
      },
    });

    try {
      expect(getLocalStorageItem("example-key")).toBe("stored-value");
      expect(getItemMock).toHaveBeenCalledWith("example-key");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("creates and stores value when local storage entry is missing", () => {
    const getItemMock = vi.fn().mockReturnValue(null);
    const setItemMock = vi.fn();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: getItemMock,
        removeItem: vi.fn(),
        setItem: setItemMock,
      },
    });

    try {
      expect(
        getOrCreateLocalStorageItem("example-key", () => "generated-value"),
      ).toBe("generated-value");
      expect(setItemMock).toHaveBeenCalledWith(
        "example-key",
        "generated-value",
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("returns fallback value when local storage is unavailable", () => {
    vi.stubGlobal("window", {
      get localStorage() {
        throw new Error("storage unavailable");
      },
    });

    try {
      expect(
        getOrCreateLocalStorageItem("example-key", () => "generated-value"),
      ).toBe("generated-value");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("sets and removes values safely", () => {
    const setItemMock = vi.fn();
    const removeItemMock = vi.fn();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: vi.fn(),
        removeItem: removeItemMock,
        setItem: setItemMock,
      },
    });

    try {
      expect(setLocalStorageItem("example-key", "value")).toBe(true);
      expect(removeLocalStorageItem("example-key")).toBe(true);
      expect(setItemMock).toHaveBeenCalledWith("example-key", "value");
      expect(removeItemMock).toHaveBeenCalledWith("example-key");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("gets a like anon id from the aggregated likes storage", () => {
    const getItemMock = vi.fn((key: string) => {
      if (key === "likes") {
        return JSON.stringify({ "name_space:page_slug": "stored-like-id" });
      }

      return null;
    });
    vi.stubGlobal("window", {
      localStorage: {
        getItem: getItemMock,
        key: vi.fn().mockReturnValue(null),
        length: 1,
        removeItem: vi.fn(),
        setItem: vi.fn(),
      },
    });

    try {
      expect(
        getOrCreateLikeAnonId("name space", "page/slug", () => "generated-id"),
      ).toBe("stored-like-id");
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("migrates legacy like anon ids into a single likes storage key", () => {
    const storageEntries = new Map<string, string>([
      ["likes:name_space:page_slug", "legacy-like-id"],
      ["likes:other_namespace:other_slug", "other-legacy-like-id"],
    ]);
    const getItemMock = vi.fn((key: string) => storageEntries.get(key) ?? null);
    const keyMock = vi.fn(
      (index: number) => Array.from(storageEntries.keys())[index] ?? null,
    );
    const setItemMock = vi.fn((key: string, value: string) => {
      storageEntries.set(key, value);
    });
    const removeItemMock = vi.fn((key: string) => {
      storageEntries.delete(key);
    });

    const localStorageMock = {
      getItem: getItemMock,
      key: keyMock,
      get length() {
        return storageEntries.size;
      },
      removeItem: removeItemMock,
      setItem: setItemMock,
    };

    vi.stubGlobal("window", {
      localStorage: localStorageMock,
    });

    try {
      expect(
        getOrCreateLikeAnonId("name space", "page/slug", () => "generated-id"),
      ).toBe("legacy-like-id");
      expect(setItemMock).toHaveBeenCalledWith(
        "likes",
        JSON.stringify({
          "name_space:page_slug": "legacy-like-id",
          "other_namespace:other_slug": "other-legacy-like-id",
        }),
      );
      expect(removeItemMock).toHaveBeenCalledWith("likes:name_space:page_slug");
      expect(removeItemMock).toHaveBeenCalledWith(
        "likes:other_namespace:other_slug",
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("creates a like anon id in the aggregated likes storage when missing", () => {
    const getItemMock = vi.fn().mockReturnValue(null);
    const setItemMock = vi.fn();
    vi.stubGlobal("window", {
      localStorage: {
        getItem: getItemMock,
        key: vi.fn().mockReturnValue(null),
        length: 0,
        removeItem: vi.fn(),
        setItem: setItemMock,
      },
    });

    try {
      expect(
        getOrCreateLikeAnonId("name space", "page/slug", () => "generated-id"),
      ).toBe("generated-id");
      expect(setItemMock).toHaveBeenCalledWith(
        "likes",
        JSON.stringify({ "name_space:page_slug": "generated-id" }),
      );
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
