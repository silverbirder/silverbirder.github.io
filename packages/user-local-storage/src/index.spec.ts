import { describe, expect, it, vi } from "vitest";

import {
  getLocalStorageItem,
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
      keyPattern: "likes:{namespace}:{name}",
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
    expect(userLocalStorageKeys.likeAnonId("name space", "page/slug")).toBe(
      "likes:name_space:page_slug",
    );
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
});
