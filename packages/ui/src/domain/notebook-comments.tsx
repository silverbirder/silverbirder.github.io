"use client";

import {
  AbsoluteCenter,
  Box,
  Button,
  Heading,
  HStack,
  ProgressCircle,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { formatJapaneseDateTime } from "@repo/util";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type CommentItem = {
  body: string;
  createdAt: string;
  id: number;
  mine: boolean;
};

type Props = {
  slug: string;
};

const API_URL = `${process.env.NEXT_PUBLIC_LIKES_API_URL}/api/comments`;
const ANON_ID_STORAGE_KEY = "comments:anon-id";
const COMMENT_MAX_LENGTH = 255;

export const NotebookComments = ({ slug }: Props) => {
  const t = useTranslations("ui.notebook");
  const [anonId, setAnonId] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<null | number>(null);
  const progress = Math.min((body.length / COMMENT_MAX_LENGTH) * 100, 100);

  useEffect(() => {
    const stored = window.localStorage.getItem(ANON_ID_STORAGE_KEY);
    if (stored) {
      setAnonId(stored);
      return;
    }
    const newId = crypto.randomUUID();
    window.localStorage.setItem(ANON_ID_STORAGE_KEY, newId);
    setAnonId(newId);
  }, []);

  useEffect(() => {
    if (!anonId) return;
    setLoading(true);
    void fetch(
      `${API_URL}?slug=${encodeURIComponent(slug)}&anonId=${encodeURIComponent(anonId)}`,
    )
      .then(
        (response) => response.json() as Promise<{ comments?: CommentItem[] }>,
      )
      .then((payload) => {
        setComments(payload.comments ?? []);
      })
      .catch(() => {
        setComments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [anonId, slug]);

  const handleSubmit = async () => {
    if (!body || body.length > COMMENT_MAX_LENGTH || !anonId) {
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch(API_URL, {
        body: JSON.stringify({ anonId, body, slug }),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      });
      const payload = (await response.json()) as { comment?: CommentItem };
      if (response.ok && payload.comment) {
        setComments((prev) => [...prev, payload.comment as CommentItem]);
        setBody("");
      }
    } catch {
      return;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!anonId) return;
    setDeletingId(commentId);
    try {
      const response = await fetch(API_URL, {
        body: JSON.stringify({ anonId, commentId }),
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      });
      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment.id !== commentId),
        );
      }
    } catch {
      return;
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Box as="section">
      <Heading as="h2">{t("commentsHeading")}</Heading>
      <VStack alignItems="flex-start" gap={0}>
        <Textarea
          _focus={{
            boxShadow: "inset 0 0 0 1px var(--chakra-colors-green-focus-ring)",
          }}
          _focusVisible={{
            boxShadow: "inset 0 0 0 1px var(--chakra-colors-green-focus-ring)",
            outline: "none",
          }}
          autoresize
          bg="bg.muted"
          borderRadius="none"
          borderWidth="0"
          lineHeight="var(--notebook-line-height)"
          maxLength={COMMENT_MAX_LENGTH}
          minHeight="calc(var(--notebook-line-height) * 3)"
          onChange={(event) => setBody(event.currentTarget.value)}
          placeholder={t("commentsTextareaPlaceholder")}
          px={2}
          py={0}
          value={body}
        />
        <HStack alignSelf="flex-end" gap={1}>
          <ProgressCircle.Root
            aria-label={t("commentsCharacterCount", {
              count: body.length,
              max: COMMENT_MAX_LENGTH,
            })}
            size="sm"
            value={progress}
          >
            <ProgressCircle.Circle>
              <ProgressCircle.Track />
              <ProgressCircle.Range />
            </ProgressCircle.Circle>
            <AbsoluteCenter>
              <Text fontSize="10px" m={0}>
                {body.length}
              </Text>
            </AbsoluteCenter>
          </ProgressCircle.Root>
          <Button
            borderRadius="none"
            disabled={submitting || loading || body.length === 0}
            height="var(--notebook-line-height)"
            onClick={handleSubmit}
            variant="solid"
          >
            {submitting ? t("commentsSubmitting") : t("commentsSubmit")}
          </Button>
        </HStack>
      </VStack>
      {loading ? (
        <Text>{t("commentsLoading")}</Text>
      ) : comments.length === 0 ? (
        <Text>{t("commentsEmpty")}</Text>
      ) : (
        <VStack
          alignItems="flex-start"
          gap="var(--notebook-line-height)"
          mt="var(--notebook-line-height)"
        >
          {comments.map((comment) => (
            <VStack alignItems="flex-start" gap={0} key={comment.id} w="full">
              <VStack
                alignItems="flex-start"
                bg="bg.muted"
                gap={0}
                px={2}
                w="full"
              >
                <Text my={0} whiteSpace="pre-wrap">
                  {comment.body}
                </Text>
                <Text
                  alignSelf="flex-end"
                  color="text.muted"
                  fontSize="xs"
                  lineHeight="var(--notebook-line-height)"
                  my={0}
                >
                  {formatJapaneseDateTime(comment.createdAt)}
                </Text>
              </VStack>
              {comment.mine && (
                <Button
                  alignSelf="flex-end"
                  borderRadius="none"
                  disabled={deletingId === comment.id}
                  height="var(--notebook-line-height)"
                  onClick={() => handleDelete(comment.id)}
                  variant="solid"
                >
                  {t("commentsDeleteAction")}
                </Button>
              )}
            </VStack>
          ))}
        </VStack>
      )}
    </Box>
  );
};
