"use client";

import type { RefObject } from "react";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

type Args = {
  bodyRef: RefObject<string>;
  bodyTextareaRef: RefObject<HTMLTextAreaElement | null>;
  onBodyChange: (value: string) => void;
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
};

export const useImageDropzone = ({
  bodyRef,
  bodyTextareaRef,
  onBodyChange,
  uploadImage,
}: Args) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImageToCloudinary = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const payload = await uploadImage(formData);

      if (!payload.url) {
        throw new Error("Upload response is missing url.");
      }

      return payload.url;
    },
    [uploadImage],
  );

  const normalizeAltText = useCallback((fileName: string) => {
    const trimmed = fileName.replace(/\.[^.]+$/, "");
    const replaced = trimmed.replace(/[-_]+/g, " ");
    return replaced.length > 0 ? replaced : "image";
  }, []);

  const buildMarkdownImage = useCallback(
    (file: File, url: string) => {
      const alt = normalizeAltText(file.name);
      return `![${alt}](${url})`;
    },
    [normalizeAltText],
  );

  const insertAtCursor = useCallback(
    (snippet: string) => {
      const textarea = bodyTextareaRef.current;
      const currentBody = bodyRef.current;

      if (!textarea) {
        onBodyChange(`${currentBody}${currentBody ? "\n\n" : ""}${snippet}`);
        return;
      }

      const selectionStart = textarea.selectionStart ?? currentBody.length;
      const selectionEnd = textarea.selectionEnd ?? currentBody.length;
      const before = currentBody.slice(0, selectionStart);
      const after = currentBody.slice(selectionEnd);
      const needsLeadingSpace = before.length > 0 && !before.endsWith("\n");
      const needsTrailingSpace = after.length > 0 && !after.startsWith("\n");
      const prefix = needsLeadingSpace ? "\n\n" : "";
      const suffix = needsTrailingSpace ? "\n" : "";
      const nextBody = `${before}${prefix}${snippet}${suffix}${after}`;

      onBodyChange(nextBody);

      requestAnimationFrame(() => {
        const cursor = before.length + prefix.length + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [bodyRef, bodyTextareaRef, onBodyChange],
  );

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return;
      }

      setIsUploading(true);

      try {
        const uploadedUrls = await Promise.all(
          acceptedFiles.map((file) => uploadImageToCloudinary(file)),
        );
        const markdown = acceptedFiles
          .map((file, index) => {
            const url = uploadedUrls[index];
            return url ? buildMarkdownImage(file, url) : null;
          })
          .filter((value): value is string => value !== null)
          .join("\n\n");

        insertAtCursor(markdown);
      } catch {
        // ignore upload errors to avoid breaking the editor flow
      } finally {
        setIsUploading(false);
      }
    },
    [buildMarkdownImage, insertAtCursor, uploadImageToCloudinary],
  );

  const dropzoneConfig = useMemo(
    () => ({
      accept: { "image/*": [] },
      multiple: true,
      noClick: true,
      noKeyboard: true,
      onDrop: handleDrop,
    }),
    [handleDrop],
  );

  const { getInputProps, getRootProps, isDragActive } =
    useDropzone(dropzoneConfig);

  return {
    getInputProps,
    getRootProps,
    isDragActive,
    isUploading,
  };
};
