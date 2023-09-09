import { component$ } from "@builder.io/qwik";
import data from "../index.json";

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
              <a href={`/blog/tags/${tag}`}>
                {tag} ({count})
              </a>
            </li>
          );
        })}
    </ul>
  );
});
