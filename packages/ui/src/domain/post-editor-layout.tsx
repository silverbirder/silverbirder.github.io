"use client";

import type {
  HTMLAttributes,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from "react";

import {
  chakra,
  CloseButton,
  Combobox,
  createListCollection,
  Drawer,
  Portal,
  RadioGroup,
  Tabs,
} from "@chakra-ui/react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

import { Notebook } from "./notebook";
import { NOTEBOOK_LINE_HEIGHT } from "./notebook-prose";
import { Tag } from "./tag";

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
  hatenaEnabledValue?: boolean;
  initialTab?: "input" | "preview";
  isBodyDragActive?: boolean;
  isLoading?: boolean;
  lintFixDisabled?: boolean;
  lintFixIsLoading?: boolean;
  onBodyChange: (value: string) => void;
  onCreatePullRequest?: () => void;
  onFixMarkdownLint?: () => void;
  onHatenaEnabledChange?: (value: boolean) => void;
  onPreviewRequest?: () => void;
  onPublishedAtChange: (value: string) => void;
  onResolveLinkTitles?: () => void;
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
    justifyContent: "flex-end",
  },
});

const HeaderActions = chakra("div", {
  base: {
    display: "flex",
    gap: "0.75rem",
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

const EditorPanel = chakra("section", {
  base: {
    background: "bg",
    borderRadius: 0,
    borderWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
    padding: 0,
  },
});

const PreviewPanel = chakra("section", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
});

const PreviewPlaceholder = chakra("p", {
  base: {
    color: "muted",
    fontSize: "0.95rem",
    margin: 0,
  },
});

const DrawerBodyStack = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
});

const DrawerActionStack = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
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
    "--notebook-line-height": "2rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
});

const Input = chakra("input", {
  base: {
    _focusVisible: {
      outline: "none",
    },
    background: "bg",
    borderRadius: "0.75rem",
    borderWidth: 0,
    boxShadow: "none",
    color: "fg",
    fontSize: "1rem",
    paddingBlock: "0.75rem",
    paddingInline: "0.9rem",
    width: "100%",
  },
});

const RadioRow = chakra("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
  },
});

const Textarea = chakra("textarea", {
  base: {
    _focusVisible: {
      outline: "none",
    },
    background: "bg",
    borderRadius: "0.75rem",
    borderWidth: 0,
    boxShadow: "none",
    color: "fg",
    fontSize: "1rem",
    minHeight: "36rem",
    paddingBlock: "0.85rem",
    paddingInline: "0.9rem",
    resize: "vertical",
    width: "100%",
  },
});

const IntegrationGroup = chakra("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },
});

const CheckboxLabel = chakra("label", {
  base: {
    alignItems: "center",
    color: "fg",
    display: "flex",
    fontSize: "0.95rem",
    fontWeight: "600",
    gap: "0.6rem",
  },
});

const CheckboxInput = chakra("input", {
  base: {
    accentColor: "green.solid",
    height: "1rem",
    width: "1rem",
  },
});

export const PostEditorLayout = ({
  bodyDropzoneInputProps,
  bodyDropzoneProps,
  bodyTextareaRef,
  bodyValue,
  createPullRequestDisabled = false,
  createPullRequestIsLoading = false,
  hatenaEnabledValue = false,
  initialTab = "input",
  isBodyDragActive = false,
  isLoading = false,
  lintFixDisabled = false,
  lintFixIsLoading = false,
  onBodyChange,
  onCreatePullRequest,
  onFixMarkdownLint,
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
  previewContent,
  previewIsLoading,
  previewTags,
  publishedAtValue,
  resolveLinkTitlesDisabled = false,
  resolveLinkTitlesIsLoading = false,
  tagInputValue,
  tagSuggestions,
  tagsValue,
  titleValue,
  zennEnabledValue = false,
  zennTypeValue = "",
}: Props) => {
  const t = useTranslations("admin.postEditor");
  const [activeTab, setActiveTab] = useState<"input" | "preview">(initialTab);
  const previewDate = publishedAtValue || "2025-01-12";
  const previewTitle = titleValue || t("titlePlaceholder");
  const isPreviewLoading = previewIsLoading ?? false;
  const shouldShowPreviewEmpty = !isPreviewLoading && previewContent == null;
  const hasDrawerActions =
    Boolean(onResolveLinkTitles) ||
    Boolean(onCreatePullRequest) ||
    Boolean(onFixMarkdownLint);
  const hasIntegrationSection =
    Boolean(onHatenaEnabledChange) || Boolean(onZennEnabledChange);
  const filteredTagSuggestions = useMemo(() => {
    if (!tagInputValue) {
      return tagSuggestions;
    }
    const query = tagInputValue.toLowerCase();
    return tagSuggestions.filter((tag) => tag.toLowerCase().includes(query));
  }, [tagInputValue, tagSuggestions]);
  const tagCollection = useMemo(
    () =>
      createListCollection({
        items: filteredTagSuggestions.map((tag) => ({
          label: tag,
          value: tag,
        })),
      }),
    [filteredTagSuggestions],
  );

  return (
    <Main>
      <Header>
        <HeaderRow>
          <HeaderActions>
            <Drawer.Root placement="end">
              <Drawer.Trigger asChild>
                <ActionButton
                  data-testid="post-editor-drawer-trigger"
                  type="button"
                >
                  {t("drawerTrigger")}
                </ActionButton>
              </Drawer.Trigger>
              <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                  <Drawer.Content
                    background="bg"
                    borderColor="green.muted"
                    borderRadius="1rem"
                    borderWidth="1px"
                    color="fg"
                    data-testid="post-editor-drawer"
                  >
                    <Drawer.Header>
                      <Drawer.Title>{t("drawerTitle")}</Drawer.Title>
                      <Drawer.CloseTrigger asChild>
                        <CloseButton aria-label={t("drawerCloseLabel")} />
                      </Drawer.CloseTrigger>
                    </Drawer.Header>
                    <Drawer.Body>
                      <DrawerBodyStack>
                        <FieldGroup>
                          {t("publishedAtLabel")}
                          <Input
                            disabled={isLoading}
                            name="publishedAt"
                            onChange={(event) =>
                              onPublishedAtChange(event.target.value)
                            }
                            type="date"
                            value={publishedAtValue}
                          />
                        </FieldGroup>
                        <FieldGroup>
                          {t("tagsLabel")}
                          <TagInputRow>
                            <Combobox.Root
                              closeOnSelect
                              collection={tagCollection}
                              inputValue={tagInputValue}
                              onInputValueChange={(details) =>
                                onTagInputChange(details.inputValue)
                              }
                              onValueChange={(details) => {
                                const value = details.value?.[0];
                                if (value) {
                                  onTagSuggestionClick(value);
                                }
                              }}
                              openOnClick
                              selectionBehavior="clear"
                              width="100%"
                            >
                              <Combobox.Control
                                background="bg"
                                borderRadius="0.75rem"
                                borderWidth="0"
                                paddingBlock="0.25rem"
                                paddingInline="0.75rem"
                              >
                                <Combobox.Input
                                  aria-label={t("tagsLabel")}
                                  disabled={isLoading}
                                  name="tags"
                                  onBlur={onTagInputBlur}
                                  onKeyDown={onTagInputKeyDown}
                                  placeholder={t("tagsPlaceholder")}
                                />
                                <Combobox.IndicatorGroup>
                                  <Combobox.Trigger />
                                </Combobox.IndicatorGroup>
                              </Combobox.Control>
                              <Portal>
                                <Combobox.Positioner>
                                  <Combobox.Content>
                                    <Combobox.Empty>
                                      {t("tagsEmpty")}
                                    </Combobox.Empty>
                                    {tagCollection.items.map((item) => (
                                      <Combobox.Item
                                        item={item}
                                        key={item.value}
                                      >
                                        {item.label}
                                        <Combobox.ItemIndicator />
                                      </Combobox.Item>
                                    ))}
                                  </Combobox.Content>
                                </Combobox.Positioner>
                              </Portal>
                            </Combobox.Root>
                            {tagsValue.length > 0 ? (
                              <TagList data-testid="post-editor-tags">
                                {tagsValue.map((tag) => (
                                  <Tag
                                    aria-label={t("tagsRemoveAriaLabel", {
                                      tag,
                                    })}
                                    data-testid="post-editor-tag"
                                    href="#"
                                    iconType="tag"
                                    isSelected
                                    key={tag}
                                    onClick={(event) => {
                                      event.preventDefault();
                                      onTagRemove(tag);
                                    }}
                                    tag={tag}
                                  />
                                ))}
                              </TagList>
                            ) : null}
                          </TagInputRow>
                        </FieldGroup>
                        {hasIntegrationSection ? (
                          <>
                            <SectionTitle>
                              {t("integrationSectionTitle")}
                            </SectionTitle>
                            <IntegrationGroup>
                              {onHatenaEnabledChange ? (
                                <CheckboxLabel>
                                  <CheckboxInput
                                    checked={hatenaEnabledValue}
                                    disabled={isLoading}
                                    name="hatenaEnabled"
                                    onChange={(event) =>
                                      onHatenaEnabledChange(
                                        event.target.checked,
                                      )
                                    }
                                    type="checkbox"
                                  />
                                  {t("hatenaEnabledLabel")}
                                </CheckboxLabel>
                              ) : null}
                              {onZennEnabledChange ? (
                                <CheckboxLabel>
                                  <CheckboxInput
                                    checked={zennEnabledValue}
                                    disabled={isLoading}
                                    name="zennEnabled"
                                    onChange={(event) =>
                                      onZennEnabledChange(event.target.checked)
                                    }
                                    type="checkbox"
                                  />
                                  {t("zennEnabledLabel")}
                                </CheckboxLabel>
                              ) : null}
                              {onZennEnabledChange && zennEnabledValue ? (
                                <FieldGroup>
                                  {t("zennTypeLabel")}
                                  <RadioGroup.Root
                                    disabled={isLoading}
                                    name="zennType"
                                    onValueChange={(details) => {
                                      if (details.value) {
                                        onZennTypeChange?.(details.value);
                                      }
                                    }}
                                    value={zennTypeValue}
                                  >
                                    <RadioRow>
                                      <RadioGroup.Item value="tech">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>
                                          {t("zennTypeOptionTech")}
                                        </RadioGroup.ItemText>
                                      </RadioGroup.Item>
                                      <RadioGroup.Item value="idea">
                                        <RadioGroup.ItemHiddenInput />
                                        <RadioGroup.ItemIndicator />
                                        <RadioGroup.ItemText>
                                          {t("zennTypeOptionIdea")}
                                        </RadioGroup.ItemText>
                                      </RadioGroup.Item>
                                    </RadioRow>
                                  </RadioGroup.Root>
                                </FieldGroup>
                              ) : null}
                            </IntegrationGroup>
                          </>
                        ) : null}
                      </DrawerBodyStack>
                    </Drawer.Body>
                    {hasDrawerActions ? (
                      <Drawer.Footer>
                        <DrawerActionStack>
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
                          {onFixMarkdownLint ? (
                            <ActionButton
                              data-testid="post-editor-markdownlint-fix"
                              disabled={lintFixDisabled}
                              onClick={onFixMarkdownLint}
                              type="button"
                            >
                              {lintFixIsLoading
                                ? t("lintFixLoading")
                                : t("lintFixAction")}
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
                        </DrawerActionStack>
                      </Drawer.Footer>
                    ) : null}
                  </Drawer.Content>
                </Drawer.Positioner>
              </Portal>
            </Drawer.Root>
          </HeaderActions>
        </HeaderRow>
      </Header>
      <Tabs.Root
        aria-label={t("contentLabel")}
        onValueChange={(details) => {
          const value = details.value as "input" | "preview";
          if (!value) {
            return;
          }
          setActiveTab(value);
          if (value === "preview") {
            onPreviewRequest?.();
          }
        }}
        value={activeTab}
      >
        <Tabs.List>
          <Tabs.Trigger data-testid="post-editor-tab-input" value="input">
            {t("editorTabInput")}
          </Tabs.Trigger>
          <Tabs.Trigger data-testid="post-editor-tab-preview" value="preview">
            {t("editorTabPreview")}
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="input">
          <EditorPanel aria-busy={isLoading} data-testid="post-editor">
            <FieldGroup>
              <Input
                aria-label={t("titleLabel")}
                disabled={isLoading}
                name="title"
                onChange={(event) => onTitleChange(event.target.value)}
                placeholder={t("titlePlaceholder")}
                type="text"
                value={titleValue}
              />
            </FieldGroup>
            <FieldGroup>
              <BodyDropzone
                {...bodyDropzoneProps}
                data-testid="post-editor-body-dropzone"
              >
                {bodyDropzoneInputProps ? (
                  <input {...bodyDropzoneInputProps} hidden />
                ) : null}
                <Textarea
                  aria-label={t("contentLabel")}
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
        </Tabs.Content>
        <Tabs.Content pt={NOTEBOOK_LINE_HEIGHT} value="preview">
          <PreviewPanel
            aria-busy={isPreviewLoading}
            data-testid="post-editor-preview-panel"
          >
            <Notebook
              aria-busy={isPreviewLoading}
              data-testid="post-editor-preview"
              navigation={{}}
              publishedAt={previewDate}
              relatedPosts={[]}
              tags={previewTags ?? []}
              title={previewTitle}
            >
              {previewContent ??
                (shouldShowPreviewEmpty ? (
                  <PreviewPlaceholder>{t("previewEmpty")}</PreviewPlaceholder>
                ) : null)}
            </Notebook>
          </PreviewPanel>
        </Tabs.Content>
      </Tabs.Root>
    </Main>
  );
};
