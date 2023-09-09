import { parseFile } from "@orama/plugin-parsedoc";
import { globby } from "globby";
import { readFileSync, writeFileSync } from "fs";

async function parseDoc() {
  const files = await globby("src/routes/blog/contents/**/*.mdx");
  const textForSearch = await Promise.all(
    files.map(async (file) => {
      const readFileData = readFileSync(file, "utf8");
      const parsedData = await parseFile(readFileData, "md");
      const contents = parsedData
        .filter((d) => d.type !== "a" && d.type !== "code")
        .map((item) => {
          if (
            item.path === "root[1].html[1].body[1]" &&
            item.content.startsWith("title:")
          ) {
            return item.content.split("title:")[1].split("published")[0].trim();
          } else {
            return item.content;
          }
        });
      const titles = parsedData
        .filter((item) => {
          return (
            item.path === "root[1].html[1].body[1]" &&
            item.content.startsWith("title:")
          );
        })
        .map((item) => {
          return item.content.split("title:")[1].split("published")[0].trim();
        });
      return {
        f: file,
        c: Array.from(new Set(contents)),
        t: titles.length ? titles[0] : "",
      };
    })
  );
  writeFileSync("./src/search.json", JSON.stringify(textForSearch));
}

parseDoc();
