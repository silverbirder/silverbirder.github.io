"use client";

import type { ComponentPropsWithoutRef } from "react";

import { Box, Card, HStack, Image, Text } from "@chakra-ui/react";

import { Link } from "./link";

type Props = Omit<ComponentPropsWithoutRef<"div">, "title"> & {
  description?: string;
  faviconSrc?: string;
  siteName?: string;
  thumbnailSrc?: string;
  title: string;
  url: string;
};

const resolveSiteLabel = (siteName: string | undefined, url: string) => {
  if (siteName && siteName.trim().length > 0) {
    return siteName.trim();
  }

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

export const LinkCard = ({
  description,
  faviconSrc,
  siteName,
  thumbnailSrc,
  title,
  url,
  ...props
}: Props) => {
  const siteLabel = resolveSiteLabel(siteName, url);
  const normalizedFaviconSrc =
    typeof faviconSrc === "string" && faviconSrc.length > 0
      ? faviconSrc
      : undefined;
  const normalizedThumbnailSrc =
    typeof thumbnailSrc === "string" && thumbnailSrc.length > 0
      ? thumbnailSrc
      : undefined;

  return (
    <Box className="not-prose" my="var(--notebook-line-height)" {...props}>
      <Link
        _hover={{ textDecoration: "none" }}
        color="fg"
        display="block"
        href={url}
        showExternalIcon={false}
        textDecoration="none"
      >
        <Card.Root
          borderColor="border.muted"
          borderRadius="none"
          borderWidth="1px"
          flexDirection="row"
          h="calc(var(--notebook-line-height) * 4)"
          overflow="hidden"
          variant="outline"
        >
          <Card.Body
            gap="0.25rem"
            minW="0"
            p="calc(var(--notebook-line-height) / 2)"
          >
            <Text
              color="fg"
              fontSize="md"
              fontWeight="600"
              lineClamp={1}
              lineHeight="1.4"
              m="0"
            >
              {title}
            </Text>
            {description ? (
              <Text
                color="fg.muted"
                fontSize="sm"
                lineClamp={1}
                lineHeight="1.4"
                m="0"
              >
                {description}
              </Text>
            ) : null}
            <HStack color="fg.muted" fontSize="xs" gap="0.35rem" mt="auto">
              {normalizedFaviconSrc ? (
                <Image
                  alt=""
                  aria-hidden="true"
                  h="1rem"
                  loading="lazy"
                  src={normalizedFaviconSrc}
                  w="1rem"
                />
              ) : null}
              <Text lineClamp={1}>{siteLabel}</Text>
            </HStack>
          </Card.Body>
          {normalizedThumbnailSrc ? (
            <Box
              alignItems="center"
              bg="white"
              display="flex"
              flexShrink={0}
              h="full"
              justifyContent="center"
              overflow="hidden"
              w={{ base: "6.5rem", md: "10rem", sm: "8rem" }}
            >
              <Image
                alt=""
                aria-hidden="true"
                h="full"
                loading="lazy"
                objectFit="contain"
                src={normalizedThumbnailSrc}
                w="full"
              />
            </Box>
          ) : null}
        </Card.Root>
      </Link>
    </Box>
  );
};
