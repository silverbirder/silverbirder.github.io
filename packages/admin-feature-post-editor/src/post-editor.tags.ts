"use client";

import type { KeyboardEvent } from "react";

import { useCallback, useMemo, useState } from "react";

type Args = {
  initialTags?: string[];
  tagSuggestions?: string[];
};

type Return = {
  normalizedTagSuggestions: string[];
  onTagInputBlur: () => void;
  onTagInputChange: (value: string) => void;
  onTagInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onTagSuggestionClick: (tag: string) => void;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tagInputValue: string;
  tags: string[];
};

export const usePostEditorTags = ({
  initialTags,
  tagSuggestions,
}: Args): Return => {
  const [tags, setTags] = useState<string[]>(initialTags ?? []);
  const [tagInputValue, setTagInputValue] = useState("");

  const addTagsFromInput = useCallback(
    (inputValue: string) => {
      const parts = inputValue
        .split(/[,、\n]/)
        .map((part) => part.trim())
        .filter((part) => part.length > 0);

      if (parts.length === 0) {
        return;
      }

      setTags((prev) => {
        const existing = new Set(prev.map((tag) => tag.toLowerCase()));
        const next = [...prev];
        for (const part of parts) {
          const key = part.toLowerCase();
          if (existing.has(key)) {
            continue;
          }
          existing.add(key);
          next.push(part);
        }
        return next;
      });
      setTagInputValue("");
    },
    [setTags],
  );

  const onTagInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" || event.key === ",") {
        event.preventDefault();
        addTagsFromInput(event.currentTarget.value);
      }
    },
    [addTagsFromInput],
  );

  const onTagInputBlur = useCallback(() => {
    if (tagInputValue.trim().length > 0) {
      addTagsFromInput(tagInputValue);
    }
  }, [addTagsFromInput, tagInputValue]);

  const onTagSuggestionClick = useCallback(
    (tag: string) => {
      addTagsFromInput(tag);
    },
    [addTagsFromInput],
  );

  const onTagRemove = useCallback((tag: string) => {
    setTags((prev) => prev.filter((item) => item !== tag));
  }, []);

  const normalizedTagSuggestions = useMemo(() => {
    const selected = new Set(tags.map((tag) => tag.toLowerCase()));
    const suggestions = tagSuggestions ?? [];
    return suggestions.filter((tag) => !selected.has(tag.toLowerCase()));
  }, [tagSuggestions, tags]);

  return {
    normalizedTagSuggestions,
    onTagInputBlur,
    onTagInputChange: setTagInputValue,
    onTagInputKeyDown,
    onTagRemove,
    onTagSuggestionClick,
    setTags,
    tagInputValue,
    tags,
  };
};
