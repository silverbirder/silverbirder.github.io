"use client";

import type { SerializeResult } from "next-mdx-remote-client/serialize";

import { useRef, useState } from "react";

type Props = {
  resolvePreview: (source: string) => Promise<SerializeResult>;
};

export const usePostEditorPresenter = ({ resolvePreview }: Props) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [previewSource, setPreviewSource] = useState<null | SerializeResult>(
    null,
  );
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const debounceRef = useRef<null | number>(null);

  const onBodyChange = (value: string) => {
    setBody(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsPreviewLoading(true);

    debounceRef.current = window.setTimeout(async () => {
      try {
        const data = await resolvePreview(value);
        setPreviewSource(data ?? null);
      } catch {
        setPreviewSource(null);
      } finally {
        setIsPreviewLoading(false);
      }
    }, 350);
  };

  return {
    body,
    isPreviewLoading,
    onBodyChange,
    onTitleChange: setTitle,
    previewSource,
    title,
  };
};
