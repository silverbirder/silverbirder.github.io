import { component$ } from "@builder.io/qwik";
import data from "../index.json";
import { stringToSlug } from "~/util";
import { Link } from "~/components/link/link";

export default component$(() => {
  const tags = data.map(({ tags }) => tags).flat();
  const tagCount = tags.reduce((acc, cur) => {
    acc[cur] = (acc[cur] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
  return (
    <ul>
      {Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => {
          return (
            <li key={tag}>
              <Link href={`/blog/tags/${stringToSlug(tag)}`}>
                {tag} ({count})
              </Link>
            </li>
          );
        })}
    </ul>
  );
});
