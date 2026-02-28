"use client";

import { MdxClientWrapper, PostEditorLayout } from "@repo/ui";

import type { Props } from "./post-editor.presenter";

import { usePostEditorPresenter } from "./post-editor.presenter";

export const PostEditor = (props: Props) => {
  const {
    autoSaveStatus,
    body,
    bodyTextareaRef,
    createPullRequestIsDisabled,
    getInputProps,
    getRootProps,
    hatenaEnabled,
    hidePreviewGlobalNavigation,
    isCreatingPullRequest,
    isDragActive,
    isLoading,
    isPreviewLoading,
    onBodyChange,
    onCreatePullRequest,
    onHatenaEnabledChange,
    onPreviewRequest,
    onPublishedAtChange,
    onResolveLinkTitles,
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
    showPullRequestFlowNotice,
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
      autoSaveStatus={autoSaveStatus}
      bodyDropzoneInputProps={getInputProps()}
      bodyDropzoneProps={getRootProps()}
      bodyTextareaRef={bodyTextareaRef}
      bodyValue={body}
      createPullRequestDisabled={createPullRequestIsDisabled}
      createPullRequestIsLoading={isCreatingPullRequest}
      hatenaEnabledValue={hatenaEnabled}
      isBodyDragActive={isDragActive}
      isLoading={isLoading}
      onBodyChange={onBodyChange}
      onCreatePullRequest={onCreatePullRequest}
      onHatenaEnabledChange={onHatenaEnabledChange}
      onPreviewRequest={onPreviewRequest}
      onPublishedAtChange={onPublishedAtChange}
      onResolveLinkTitles={onResolveLinkTitles}
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
      previewShowGlobalNavigation={!hidePreviewGlobalNavigation}
      previewTags={tags}
      publishedAtValue={publishedAt}
      resolveLinkTitlesDisabled={resolveLinkTitlesDisabled}
      resolveLinkTitlesIsLoading={resolveLinkTitlesIsLoading}
      showPullRequestFlowNotice={showPullRequestFlowNotice}
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
