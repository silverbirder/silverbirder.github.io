"use client";

import { Box, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { Notebook, LinkCard as UiLinkCard } from "@repo/ui";

type CardItem = {
  description?: string;
  faviconSrc?: string;
  siteName?: string;
  thumbnailSrc?: string;
  title: string;
  url: string;
};

type Props = {
  cards?: CardItem[];
  description: string;
  empty: string;
  title: string;
};

export const LinkCards = ({ cards = [], description, empty, title }: Props) => {
  return (
    <Box w="full">
      <Notebook navigation={{}} relatedPosts={[]} tags={[]} title={title}>
        <VStack align="stretch" gap={0}>
          <Text my={0}>{description}</Text>

          {cards.length === 0 ? (
            <Text color="fg.muted" mt="var(--notebook-line-height)">
              {empty}
            </Text>
          ) : (
            <SimpleGrid
              columns={{ base: 1, lg: 2 }}
              gap={6}
              mt="var(--notebook-line-height)"
            >
              {cards.map((card) => (
                <Box key={card.url}>
                  <UiLinkCard {...card} />
                  <Text
                    color="fg.subtle"
                    fontSize="sm"
                    mt={2}
                    wordBreak="break-all"
                  >
                    {card.url}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Notebook>
    </Box>
  );
};
