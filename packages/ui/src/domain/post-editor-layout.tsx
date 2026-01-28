"use client";

import type {
  HTMLAttributes,
  InputHTMLAttributes,
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
  isBodyDragActive?: boolean;
  isLoading?: boolean;
  onBodyChange: (value: string) => void;
  onCreatePullRequest?: () => void;
  onResolveLinkTitles?: () => void;
  onTitleChange: (value: string) => void;
  previewContent: null | ReactNode;
  previewIsLoading?: boolean;
  resolveLinkTitlesDisabled?: boolean;
  resolveLinkTitlesIsLoading?: boolean;
  titleValue: string;
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

export const PostEditorLayout = ({
  bodyDropzoneInputProps,
  bodyDropzoneProps,
  bodyTextareaRef,
  bodyValue,
  createPullRequestDisabled = false,
  createPullRequestIsLoading = false,
  isBodyDragActive = false,
  isLoading = false,
  onBodyChange,
  onCreatePullRequest,
  onResolveLinkTitles,
  onTitleChange,
  previewContent,
  previewIsLoading,
  resolveLinkTitlesDisabled = false,
  resolveLinkTitlesIsLoading = false,
  titleValue,
}: Props) => {
  const t = useTranslations("admin.postEditor");
  const previewDate = "2025-01-12";
  const previewTitle = titleValue || t("titlePlaceholder");
  const isPreviewLoading = previewIsLoading ?? previewContent == null;
  const hasHeaderActions =
    Boolean(onResolveLinkTitles) || Boolean(onCreatePullRequest);

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
            tags={[]}
            title={previewTitle}
          >
            {previewContent ?? <p>{t("previewTitle")}</p>}
          </Notebook>
        </PreviewPanel>
      </EditorGrid>
    </Main>
  );
};
