"use client";

import { MdxClientWrapper, PostEditorLayout } from "@repo/ui";

import type { Props } from "./post-editor.presenter";

import { usePostEditorPresenter } from "./post-editor.presenter";

export const PostEditor = (props: Props) => {
  const {
    body,
    bodyTextareaRef,
    createPullRequestIsDisabled,
    getInputProps,
    getRootProps,
    hatenaEnabled,
    isCreatingPullRequest,
    isDragActive,
    isLoading,
    isPreviewLoading,
    isSavingDraft,
    lintFixDisabled,
    lintFixIsLoading,
    onBodyChange,
    onCreatePullRequest,
    onFixMarkdownLint,
    onHatenaEnabledChange,
    onPreviewRequest,
    onPublishedAtChange,
    onResolveLinkTitles,
    onSaveDraft,
    onTagInputBlur,
    onTagInputChange,
    onTagInputKeyDown,
    onTagRemove,
    onTagSuggestionClick,
    onTitleChange,
    onZennEnabledChange,
    onZennTypeChange,
    previewSource,
    publishedAt,
    resolveLinkTitlesDisabled,
    resolveLinkTitlesIsLoading,
    summary,
    tagInputValue,
    tags,
    tagSuggestions,
    title,
    zennEnabled,
    zennType,
  } = usePostEditorPresenter(props);

  return (
    <PostEditorLayout
      bodyDropzoneInputProps={getInputProps()}
      bodyDropzoneProps={getRootProps()}
      bodyTextareaRef={bodyTextareaRef}
      bodyValue={body}
      createPullRequestDisabled={createPullRequestIsDisabled}
      createPullRequestIsLoading={isCreatingPullRequest}
      hatenaEnabledValue={hatenaEnabled}
      isBodyDragActive={isDragActive}
      isLoading={isLoading}
      lintFixDisabled={lintFixDisabled}
      lintFixIsLoading={lintFixIsLoading}
      onBodyChange={onBodyChange}
      onCreatePullRequest={onCreatePullRequest}
      onFixMarkdownLint={onFixMarkdownLint}
      onHatenaEnabledChange={onHatenaEnabledChange}
      onPreviewRequest={onPreviewRequest}
      onPublishedAtChange={onPublishedAtChange}
      onResolveLinkTitles={onResolveLinkTitles}
      onSaveDraft={onSaveDraft}
      onTagInputBlur={onTagInputBlur}
      onTagInputChange={onTagInputChange}
      onTagInputKeyDown={onTagInputKeyDown}
      onTagRemove={onTagRemove}
      onTagSuggestionClick={onTagSuggestionClick}
      onTitleChange={onTitleChange}
      onZennEnabledChange={onZennEnabledChange}
      onZennTypeChange={onZennTypeChange}
      previewContent={
        previewSource &&
        "compiledSource" in previewSource &&
        previewSource.compiledSource ? (
          <MdxClientWrapper compiledSource={previewSource.compiledSource} />
        ) : null
      }
      previewIsLoading={isPreviewLoading}
      previewTags={tags}
      publishedAtValue={publishedAt}
      resolveLinkTitlesDisabled={resolveLinkTitlesDisabled}
      resolveLinkTitlesIsLoading={resolveLinkTitlesIsLoading}
      saveDraftIsLoading={isSavingDraft}
      summaryValue={summary}
      tagInputValue={tagInputValue}
      tagSuggestions={tagSuggestions}
      tagsValue={tags}
      titleValue={title}
      zennEnabledValue={zennEnabled}
      zennTypeValue={zennType}
    />
  );
};
