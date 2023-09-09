import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";
import { Image } from "@unpic/qwik";
import {
  MaterialSymbolsAccountCircle,
  MaterialSymbolsCalendarMonth,
  MaterialSymbolsDescription,
  MaterialSymbolsShoppingBag,
  MdiOfficeBuilding,
  MdiTagOutline,
} from "~/components/icon/icon";
import { HStack } from "~/styled-system/jsx";

export interface CardProps {
  name: string;
  image: string;
  description?: string;
  date?: string;
  person?: string;
  shopLink?: string;
  office?: string;
  tags?: string[];
  experienceYears?: string;
  usages?: string[];
  width?: number;
  height?: number;
}

export const Card = component$<CardProps>(
  ({
    name,
    image,
    description,
    date,
    person,
    shopLink,
    office,
    tags,
    experienceYears,
    usages,
    width = 200,
    height = 200,
  }) => {
    return (
      <div
        class={css({
          display: "grid",
          gridTemplateRows:
            "minmax(50px, auto) minmax(200px, auto) minmax(50px, auto)",
          backgroundColor: "bg.quote",
          borderRadius: "md",
          padding: "1",
        })}
      >
        <div class={css({ textStyle: "lg", paddingBottom: "1" })}>{name}</div>
        <div
          class={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          {image && <Image src={image} width={width} height={height} />}
        </div>
        <div class={css({ textStyle: "md" })}>
          {date && (
            <HStack gap={1} alignItems={"center"}>
              <MaterialSymbolsCalendarMonth class="icon" />
              <span
                class={css({
                  fontWeight: "light",
                  fontSize: "sm",
                })}
              >
                {date}
              </span>
            </HStack>
          )}
          {person && (
            <HStack gap={1} alignItems={"center"}>
              <MaterialSymbolsAccountCircle class="icon" />
              <span
                class={css({
                  fontWeight: "light",
                  fontSize: "sm",
                })}
              >
                {person}
              </span>
            </HStack>
          )}
          {shopLink && (
            <a href={shopLink}>
              <HStack gap={1} alignItems={"center"}>
                <MaterialSymbolsShoppingBag class="icon" />
                <span
                  class={css({
                    fontWeight: "light",
                    fontSize: "sm",
                  })}
                >
                  Go to shop
                </span>
              </HStack>
            </a>
          )}
          {office && (
            <HStack gap={1} alignItems={"center"}>
              <MdiOfficeBuilding class="icon" />
              <span
                class={css({
                  fontWeight: "light",
                  fontSize: "sm",
                })}
              >
                {office}
              </span>
            </HStack>
          )}
          {tags &&
            tags.map((tag) => (
              <HStack
                key={tag}
                gap="1"
                class={css({
                  alignItems: "center",
                })}
              >
                <MdiTagOutline class="icon" />
                <span
                  class={css({
                    fontWeight: "light",
                    fontSize: "sm",
                  })}
                >
                  {tag}
                </span>
              </HStack>
            ))}
          {experienceYears && (
            <div
              class={css({
                fontWeight: "light",
                fontSize: "sm",
              })}
            >
              経験年数: {experienceYears}
            </div>
          )}
          {usages && (
            <div
              class={css({
                fontWeight: "light",
                fontSize: "sm",
              })}
            >
              利用シーン: {usages.join(", ")}
            </div>
          )}
          {description && (
            <p>
              <MaterialSymbolsDescription class="icon" /> {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);
