import { component$ } from "@builder.io/qwik";
import { type PostSummary } from "~/models";
import { HStack } from "~/styled-system/jsx";
import { css } from "~/styled-system/css";
import { Tag } from "~/components/tag/tag";
import { stringToSlug } from "~/util";
import { Link } from "~/components/link/link";

export const PostSummaryListItem = component$(
  ({ title, permalink, description, tags, date, published }: PostSummary) => {
    if (!published) return <></>;
    return (
      <div>
        <Link href={permalink}>
          <div class={css({ textStyle: "h4" })}>{title}</div>
        </Link>
        <p>{date}</p>
        <HStack
          class={css({
            flexWrap: "wrap",
          })}
        >
          {tags.map((tag) => (
            <Tag url={`/blog/tags/${stringToSlug(tag)}`} name={tag} key={tag} />
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
