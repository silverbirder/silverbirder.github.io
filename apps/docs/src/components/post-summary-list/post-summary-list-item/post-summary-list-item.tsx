import { component$ } from "@builder.io/qwik";
import { type PostSummary } from "~/models";
import { HStack } from "~/styled-system/jsx";
import { css } from "~/styled-system/css";
import { Tag } from "~/components/tag/tag";

export const PostSummaryListItem = component$(
  ({ title, permalink, description, tags, date, published }: PostSummary) => {
    if (!published) return <></>;
    return (
      <div>
        <a href={permalink}>
          <div class={css({ textStyle: "h4" })}>{title}</div>
        </a>
        <p>{date}</p>
        <HStack
          class={css({
            flexWrap: "wrap",
          })}
        >
          {tags.map((tag) => (
            <Tag url={`/blog/tags/${tag}`} name={tag} key={tag} />
          ))}
        </HStack>

        <p
          class={css({
            backgroundColor: "bg.quote",
            borderColor: "bg.quote",
            borderWidth: "medium",
            borderRadius: "base",
          })}
        >
          {description}...
        </p>
      </div>
    );
  }
);
