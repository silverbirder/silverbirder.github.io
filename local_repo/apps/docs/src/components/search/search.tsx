import {
  component$,
  $,
  useSignal,
  noSerialize,
  useOnDocument,
} from "@builder.io/qwik";
import search from "~/search.json";
import Fuse from "fuse.js";
import { css } from "~/styled-system/css";
import { HStack, VStack } from "~/styled-system/jsx";
import { MdiMagnify } from "../icon/icon";

export interface SearchProps {}

const fuse = noSerialize(new Fuse(search, { keys: ["c"] }));

export const Search = component$<SearchProps>(() => {
  const keyword = useSignal<string>("");
  const contents = useSignal<{ title: string; link: string }[]>([]);
  const isContentsVisible = useSignal<boolean>(false);
  const inputRef = useSignal<Element>();
  const contentsRef = useSignal<Element>();

  const onClick = $(() => {
    const results = fuse?.search(keyword.value);
    contents.value =
      results?.slice(0, 5).map((r) => {
        let newPath = r.item.f.replace("src/routes/", "");
        newPath = newPath.substring(0, newPath.lastIndexOf("/"));
        return {
          title: r.item.t,
          link: newPath,
        };
      }) || [];
    isContentsVisible.value = true;
  });
  useOnDocument(
    "click",
    $((event: Event) => {
      const target = event.target as Node;
      if (
        inputRef.value &&
        !inputRef.value.contains(target) &&
        contentsRef.value &&
        !contentsRef.value.contains(target)
      ) {
        isContentsVisible.value = false;
      }
    })
  );

  return (
    <div>
      <HStack gap={1}>
        <input
          ref={inputRef}
          name="keyword"
          class={css({
            backgroundColor: "white",
            borderColor: "black",
            borderWidth: "thin",
            borderRadius: "base",
          })}
          bind:value={keyword}
        />
        <button onClick$={onClick}>
          <MdiMagnify />
        </button>
      </HStack>
      <div
        ref={contentsRef}
        class={css({
          position: "absolute",
          top: "100%",
          left: "10%",
          width: "80%",
          backgroundColor: "bg.quote",
          whiteSpace: "normal",
          overflowWrap: "break-word",
        })}
      >
        {isContentsVisible.value && (
          <VStack gap={1} alignItems={"flex-start"}>
            {contents.value.map(({ title, link }, index) => (
              <div
                key={index}
                class={css({
                  padding: "1",
                })}
              >
                <a href={link}>{title}</a>
              </div>
            ))}
          </VStack>
        )}
      </div>
    </div>
  );
});
