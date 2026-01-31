"use client";

import type {
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from "react";

import { chakra } from "@chakra-ui/react";
import { useTranslations } from "next-intl";

import { Notebook } from "./notebook";

type Props = {
  bodyDropzoneInputProps?: InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>;
  };
  bodyDropzoneProps?: HTMLAttributes<HTMLDivElement> & {
    ref?: Ref<HTMLDivElement>;
  };
  bodyTextareaRef?: Ref<HTMLTextAreaElement>;
  bodyValue: string;
  createPullRequestDisabled?: boolean;
  createPullRequestIsLoading?: boolean;
  indexValue: boolean;
  isBodyDragActive?: boolean;
  isLoading?: boolean;
  onBodyChange: (value: string) => void;
  onCreatePullRequest?: () => void;
  onIndexChange: (value: boolean) => void;
  onPublishedAtChange: (value: string) => void;
  onResolveLinkTitles?: () => void;
  onSummaryChange: (value: string) => void;
  onTagInputBlur: () => void;
  onTagInputChange: (value: string) => void;
  onTagInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onTagRemove: (tag: string) => void;
  onTagSuggestionClick: (tag: string) => void;
  onTitleChange: (value: string) => void;
  onZennEnabledChange?: (value: boolean) => void;
  onZennTypeChange?: (value: string) => void;
  previewContent: null | ReactNode;
  previewIsLoading?: boolean;
  previewTags?: string[];
  publishedAtValue: string;
  resolveLinkTitlesDisabled?: boolean;
  resolveLinkTitlesIsLoading?: boolean;
  summaryValue: string;
  tagInputValue: string;
  tagSuggestions: string[];
  tagsValue: string[];
  titleValue: string;
  zennEnabledValue?: boolean;
  zennTypeValue?: string;
};

const Main = chakra("main", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    marginInline: "auto",
    maxWidth: "1200px",
    paddingBlock: { base: "2rem", md: "3rem" },
    paddingInline: { base: "1.5rem", md: "3rem" },
  },
});

const Header = chakra("header", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
});

const HeaderRow = chakra("div", {
  base: {
    alignItems: "center",
    display: "flex",
    gap: "1rem",
    justifyContent: "space-between",
  },
});

const HeaderActions = chakra("div", {
  base: {
    display: "flex",
    gap: "0.75rem",
  },
});

const Title = chakra("h1", {
  base: {
    color: "green.fg",
    fontSize: { base: "2rem", md: "2.5rem" },
    fontWeight: "700",
    letterSpacing: "-0.02em",
  },
});

const Description = chakra("p", {
  base: {
    color: "fg.muted",
    fontSize: "md",
    maxWidth: "60ch",
  },
});

const ActionButton = chakra("button", {
  base: {
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.5,
    },
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "green.focusRing",
      outlineOffset: "2px",
    },
    _hover: {
      background: "green.muted",
    },
    alignItems: "center",
    background: "green.subtle",
    borderColor: "green.muted",
    borderRadius: "999px",
    borderWidth: "1px",
    color: "green.fg",
    display: "inline-flex",
    fontSize: "0.85rem",
    fontWeight: "600",
    paddingBlock: "0.4rem",
    paddingInline: "1rem",
    transition: "background 0.2s ease",
  },
});

const EditorGrid = chakra("div", {
  base: {
    display: "grid",
    gap: "2rem",
    gridTemplateColumns: { base: "1fr", lg: "1fr 1fr" },
  },
});

const EditorPanel = chakra("section", {
  base: {
    background: "bg",
    borderColor: "green.muted",
    borderRadius: "1rem",
    borderWidth: "1px",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    padding: "1.5rem",
  },
});

const PreviewPanel = chakra("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
});

const PanelTitle = chakra("h2", {
  base: {
    color: "green.fg",
    fontSize: "0.7rem",
    fontWeight: "700",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  },
});

const SectionTitle = chakra("h3", {
  base: {
    color: "green.fg",
    fontSize: "0.7rem",
    fontWeight: "700",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
  },
});

const FieldGroup = chakra("label", {
  base: {
    color: "fg",
    display: "flex",
    flexDirection: "column",
    fontSize: "0.9rem",
    fontWeight: "600",
    gap: "0.5rem",
  },
});

const BodyDropzone = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const TagInputRow = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
});

const TagList = chakra("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
});

const TagItem = chakra("span", {
  base: {
    alignItems: "center",
    background: "green.muted",
    borderRadius: "999px",
    color: "green.fg",
    display: "inline-flex",
    fontSize: "0.85rem",
    fontWeight: "600",
    gap: "0.4rem",
    paddingBlock: "0.25rem",
    paddingInline: "0.75rem",
  },
});

const TagRemoveButton = chakra("button", {
  base: {
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "green.focusRing",
      outlineOffset: "2px",
    },
    _hover: {
      color: "green.solid",
    },
    background: "transparent",
    border: "none",
    color: "green.fg",
    cursor: "pointer",
    fontSize: "0.9rem",
    lineHeight: 1,
    padding: 0,
  },
});

const Input = chakra("input", {
  base: {
    _focusVisible: {
      borderColor: "green.solid",
      outline: "none",
    },
    background: "bg",
    borderColor: "green.muted",
    borderRadius: "0.75rem",
    borderWidth: "1px",
    color: "fg",
    fontSize: "1rem",
    paddingBlock: "0.75rem",
    paddingInline: "0.9rem",
    width: "100%",
  },
});

const Select = chakra("select", {
  base: {
    _focusVisible: {
      borderColor: "green.solid",
      outline: "none",
    },
    background: "bg",
    borderColor: "green.muted",
    borderRadius: "0.75rem",
    borderWidth: "1px",
    color: "fg",
    fontSize: "1rem",
    paddingBlock: "0.75rem",
    paddingInline: "0.9rem",
    width: "100%",
  },
});

const Textarea = chakra("textarea", {
  base: {
    _focusVisible: {
      borderColor: "green.solid",
      outline: "none",
    },
    background: "bg",
    borderColor: "green.muted",
    borderRadius: "0.75rem",
    borderWidth: "1px",
    color: "fg",
    fontSize: "1rem",
    minHeight: "36rem",
    paddingBlock: "0.85rem",
    paddingInline: "0.9rem",
    resize: "vertical",
    width: "100%",
  },
});

const SummaryTextarea = chakra("textarea", {
  base: {
    _focusVisible: {
      borderColor: "green.solid",
      outline: "none",
    },
    background: "bg",
    borderColor: "green.muted",
    borderRadius: "0.75rem",
    borderWidth: "1px",
    color: "fg",
    fontSize: "0.95rem",
    minHeight: "6.5rem",
    paddingBlock: "0.75rem",
    paddingInline: "0.9rem",
    resize: "vertical",
    width: "100%",
  },
});

const HelperText = chakra("span", {
  base: {
    color: "fg.muted",
    fontSize: "0.8rem",
    fontWeight: "500",
  },
});

const SuggestionList = chakra("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
});

const SuggestionButton = chakra("button", {
  base: {
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "green.focusRing",
      outlineOffset: "2px",
    },
    _hover: {
      background: "green.subtle",
    },
    background: "green.muted",
    border: "1px solid",
    borderColor: "green.muted",
    borderRadius: "999px",
    color: "green.fg",
    cursor: "pointer",
    fontSize: "0.8rem",
    fontWeight: "600",
    paddingBlock: "0.2rem",
    paddingInline: "0.7rem",
  },
});

export const PostEditorLayout = ({
  bodyDropzoneInputProps,
  bodyDropzoneProps,
  bodyTextareaRef,
  bodyValue,
  createPullRequestDisabled = false,
  createPullRequestIsLoading = false,
  indexValue,
  isBodyDragActive = false,
  isLoading = false,
  onBodyChange,
  onCreatePullRequest,
  onIndexChange,
  onPublishedAtChange,
  onResolveLinkTitles,
  onSummaryChange,
  onTagInputBlur,
  onTagInputChange,
  onTagInputKeyDown,
  onTagRemove,
  onTagSuggestionClick,
  onTitleChange,
  onZennEnabledChange,
  onZennTypeChange,
  previewContent,
  previewIsLoading,
  previewTags,
  publishedAtValue,
  resolveLinkTitlesDisabled = false,
  resolveLinkTitlesIsLoading = false,
  summaryValue,
  tagInputValue,
  tagSuggestions,
  tagsValue,
  titleValue,
  zennEnabledValue = false,
  zennTypeValue = "",
}: Props) => {
  const t = useTranslations("admin.postEditor");
  const previewDate = publishedAtValue || "2025-01-12";
  const previewTitle = titleValue || t("titlePlaceholder");
  const isPreviewLoading = previewIsLoading ?? previewContent == null;
  const hasHeaderActions =
    Boolean(onResolveLinkTitles) || Boolean(onCreatePullRequest);
  const tagRemoveSymbol = t("tagsRemoveSymbol");

  return (
    <Main>
      <Header>
        <HeaderRow>
          <Title>{t("title")}</Title>
          {hasHeaderActions ? (
            <HeaderActions>
              {onCreatePullRequest ? (
                <ActionButton
                  data-testid="post-editor-create-pull-request"
                  disabled={createPullRequestDisabled}
                  onClick={onCreatePullRequest}
                  type="button"
                >
                  {createPullRequestIsLoading
                    ? t("createPullRequestLoading")
                    : t("createPullRequestAction")}
                </ActionButton>
              ) : null}
              {onResolveLinkTitles ? (
                <ActionButton
                  data-testid="post-editor-resolve-links"
                  disabled={resolveLinkTitlesDisabled}
                  onClick={onResolveLinkTitles}
                  type="button"
                >
                  {resolveLinkTitlesIsLoading
                    ? t("linkUpdateLoading")
                    : t("linkUpdateAction")}
                </ActionButton>
              ) : null}
            </HeaderActions>
          ) : null}
        </HeaderRow>
        <Description>{t("description")}</Description>
      </Header>
      <EditorGrid>
        <EditorPanel aria-busy={isLoading} data-testid="post-editor">
          <PanelTitle>{t("editorTitle")}</PanelTitle>
          <FieldGroup>
            {t("titleLabel")}
            <Input
              disabled={isLoading}
              name="title"
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder={t("titlePlaceholder")}
              type="text"
              value={titleValue}
            />
          </FieldGroup>
          <FieldGroup>
            {t("publishedAtLabel")}
            <Input
              disabled={isLoading}
              name="publishedAt"
              onChange={(event) => onPublishedAtChange(event.target.value)}
              type="date"
              value={publishedAtValue}
            />
            <HelperText>{t("publishedAtHelp")}</HelperText>
          </FieldGroup>
          <FieldGroup>
            {t("indexLabel")}
            <Select
              disabled={isLoading}
              name="index"
              onChange={(event) => onIndexChange(event.target.value === "true")}
              value={String(indexValue)}
            >
              <option value="true">{t("indexOptionTrue")}</option>
              <option value="false">{t("indexOptionFalse")}</option>
            </Select>
            <HelperText>{t("indexHelp")}</HelperText>
          </FieldGroup>
          <FieldGroup>
            {t("summaryLabel")}
            <SummaryTextarea
              disabled={isLoading}
              name="summary"
              onChange={(event) => onSummaryChange(event.target.value)}
              placeholder={t("summaryPlaceholder")}
              value={summaryValue}
            />
            <HelperText>{t("summaryHelp")}</HelperText>
          </FieldGroup>
          <FieldGroup>
            {t("tagsLabel")}
            <TagInputRow>
              <Input
                disabled={isLoading}
                name="tags"
                onBlur={onTagInputBlur}
                onChange={(event) => onTagInputChange(event.target.value)}
                onKeyDown={onTagInputKeyDown}
                placeholder={t("tagsPlaceholder")}
                type="text"
                value={tagInputValue}
              />
              {tagSuggestions.length > 0 ? (
                <>
                  <HelperText>{t("tagsSuggestionsLabel")}</HelperText>
                  <SuggestionList data-testid="post-editor-tag-suggestions">
                    {tagSuggestions.map((tag) => (
                      <SuggestionButton
                        key={tag}
                        onClick={() => onTagSuggestionClick(tag)}
                        type="button"
                      >
                        {tag}
                      </SuggestionButton>
                    ))}
                  </SuggestionList>
                </>
              ) : null}
              {tagsValue.length > 0 ? (
                <TagList data-testid="post-editor-tags">
                  {tagsValue.map((tag) => (
                    <TagItem data-testid="post-editor-tag" key={tag}>
                      {tag}
                      <TagRemoveButton
                        aria-label={t("tagsRemoveAriaLabel", { tag })}
                        onClick={() => onTagRemove(tag)}
                        type="button"
                      >
                        {tagRemoveSymbol}
                      </TagRemoveButton>
                    </TagItem>
                  ))}
                </TagList>
              ) : null}
              <HelperText>{t("tagsHelp")}</HelperText>
            </TagInputRow>
          </FieldGroup>
          {onZennEnabledChange ? (
            <>
              <SectionTitle>{t("zennSectionTitle")}</SectionTitle>
              <FieldGroup>
                {t("zennEnabledLabel")}
                <Select
                  disabled={isLoading}
                  name="zennEnabled"
                  onChange={(event) =>
                    onZennEnabledChange(event.target.value === "true")
                  }
                  value={String(zennEnabledValue)}
                >
                  <option value="false">{t("zennEnabledOptionFalse")}</option>
                  <option value="true">{t("zennEnabledOptionTrue")}</option>
                </Select>
                <HelperText>{t("zennEnabledHelp")}</HelperText>
              </FieldGroup>
              {zennEnabledValue ? (
                <>
                  <FieldGroup>
                    {t("zennTypeLabel")}
                    <Select
                      disabled={isLoading}
                      name="zennType"
                      onChange={(event) =>
                        onZennTypeChange?.(event.target.value)
                      }
                      value={zennTypeValue}
                    >
                      <option value="tech">{t("zennTypeOptionTech")}</option>
                      <option value="idea">{t("zennTypeOptionIdea")}</option>
                    </Select>
                    <HelperText>{t("zennTypeHelp")}</HelperText>
                  </FieldGroup>
                </>
              ) : null}
            </>
          ) : null}
          <FieldGroup>
            {t("contentLabel")}
            <BodyDropzone
              {...bodyDropzoneProps}
              data-testid="post-editor-body-dropzone"
            >
              {bodyDropzoneInputProps ? (
                <input {...bodyDropzoneInputProps} hidden />
              ) : null}
              <Textarea
                borderColor={isBodyDragActive ? "fg" : undefined}
                data-testid="post-editor-body"
                disabled={isLoading}
                name="body"
                onChange={(event) => onBodyChange(event.target.value)}
                placeholder={t("contentPlaceholder")}
                ref={bodyTextareaRef}
                value={bodyValue}
              />
            </BodyDropzone>
          </FieldGroup>
        </EditorPanel>
        <PreviewPanel>
          <PanelTitle>{t("previewTitle")}</PanelTitle>
          <Notebook
            aria-busy={isPreviewLoading}
            data-testid="post-editor-preview"
            navigation={{}}
            publishedAt={previewDate}
            relatedPosts={[]}
            tags={previewTags ?? []}
            title={previewTitle}
          >
            {previewContent ?? <p>{t("previewTitle")}</p>}
          </Notebook>
        </PreviewPanel>
      </EditorGrid>
    </Main>
  );
};
