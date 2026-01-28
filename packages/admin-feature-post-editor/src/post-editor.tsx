"use client";

import { MdxClientWrapper, PostEditorLayout } from "@repo/ui";
import { SerializeResult } from "next-mdx-remote-client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";

import { usePostEditorPresenter } from "./post-editor.presenter";

type Props = {
  createPullRequestDisabled?: boolean;
  onCreatePullRequest?: (draft: {
    body: string;
    title: string;
  }) => Promise<void>;
  resolveLinkTitles: (source: string) => Promise<string>;
  resolvePreview: (source: string) => Promise<SerializeResult>;
  uploadImage: (formData: FormData) => Promise<{ url: string }>;
};

export const PostEditor = ({
  createPullRequestDisabled,
  onCreatePullRequest,
  resolveLinkTitles,
  resolvePreview,
  uploadImage,
}: Props) => {
  const {
    body,
    isPreviewLoading,
    onBodyChange,
    onTitleChange,
    previewSource,
    title,
  } = usePostEditorPresenter({ resolvePreview });
  const [isUploading, setIsUploading] = useState(false);
  const [isResolvingLinks, setIsResolvingLinks] = useState(false);
  const [isCreatingPullRequest, setIsCreatingPullRequest] = useState(false);
  const bodyRef = useRef(body);
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    bodyRef.current = body;
  }, [body]);

  const handleBodyChange = useCallback(
    (value: string) => {
      bodyRef.current = value;
      onBodyChange(value);
    },
    [onBodyChange],
  );

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
        handleBodyChange(
          `${currentBody}${currentBody ? "\n\n" : ""}${snippet}`,
        );
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

      handleBodyChange(nextBody);

      requestAnimationFrame(() => {
        const cursor = before.length + prefix.length + snippet.length;
        textarea.focus();
        textarea.setSelectionRange(cursor, cursor);
      });
    },
    [handleBodyChange],
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
  const isBodyEmpty = body.length === 0;

  const hasFrontmatter = useMemo(() => {
    const trimmed = body.trimStart();
    if (!trimmed.startsWith("---")) {
      return false;
    }
    return /^---\n[\s\S]*?\n---\n/.test(trimmed);
  }, [body]);

  const createPullRequestIsDisabled =
    createPullRequestDisabled === true ||
    isBodyEmpty ||
    (title.length === 0 && !hasFrontmatter) ||
    isUploading ||
    isResolvingLinks ||
    isCreatingPullRequest ||
    !onCreatePullRequest;

  const handleCreatePullRequest = useCallback(async () => {
    if (!onCreatePullRequest || createPullRequestIsDisabled) {
      return;
    }

    setIsCreatingPullRequest(true);

    try {
      await onCreatePullRequest({ body: bodyRef.current, title });
    } finally {
      setIsCreatingPullRequest(false);
    }
  }, [createPullRequestIsDisabled, onCreatePullRequest, title]);

  const handleResolveLinkTitles = useCallback(async () => {
    if (isResolvingLinks || isBodyEmpty) {
      return;
    }

    const currentBody = bodyRef.current;
    if (currentBody.length === 0) {
      return;
    }

    const textarea = bodyTextareaRef.current;
    const selectionStart = textarea?.selectionStart ?? null;
    const selectionEnd = textarea?.selectionEnd ?? null;

    setIsResolvingLinks(true);

    try {
      const resolved = await resolveLinkTitles(currentBody);
      if (typeof resolved === "string" && resolved !== currentBody) {
        handleBodyChange(resolved);
      }
    } catch {
      // ignore resolve errors to avoid breaking the editor flow
    } finally {
      setIsResolvingLinks(false);
      requestAnimationFrame(() => {
        if (!textarea) {
          return;
        }
        textarea.focus();
        if (selectionStart !== null && selectionEnd !== null) {
          textarea.setSelectionRange(selectionStart, selectionEnd);
        }
      });
    }
  }, [handleBodyChange, isBodyEmpty, isResolvingLinks, resolveLinkTitles]);

  return (
    <PostEditorLayout
      bodyDropzoneInputProps={getInputProps()}
      bodyDropzoneProps={getRootProps()}
      bodyTextareaRef={bodyTextareaRef}
      bodyValue={body}
      createPullRequestDisabled={createPullRequestIsDisabled}
      createPullRequestIsLoading={isCreatingPullRequest}
      isBodyDragActive={isDragActive}
      isLoading={isUploading || isResolvingLinks || isCreatingPullRequest}
      onBodyChange={handleBodyChange}
      onCreatePullRequest={
        onCreatePullRequest ? handleCreatePullRequest : undefined
      }
      onResolveLinkTitles={handleResolveLinkTitles}
      onTitleChange={onTitleChange}
      previewContent={
        previewSource &&
        "compiledSource" in previewSource &&
        previewSource.compiledSource ? (
          <MdxClientWrapper compiledSource={previewSource.compiledSource} />
        ) : null
      }
      previewIsLoading={isPreviewLoading}
      resolveLinkTitlesDisabled={isBodyEmpty || isUploading || isResolvingLinks}
      resolveLinkTitlesIsLoading={isResolvingLinks}
      titleValue={title}
    />
  );
};
