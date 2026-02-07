import type { KeyboardEvent } from "react";

import { act } from "react";
import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { usePostEditorTags } from "./post-editor.tags";

type HookState = ReturnType<typeof usePostEditorTags>;

const renderHook = async (args: {
  initialTags?: string[];
  tagSuggestions?: string[];
}): Promise<{ getState: () => HookState }> => {
  const stateRef = { current: null as HookState | null };

  const Test = () => {
    stateRef.current = usePostEditorTags(args);
    return null;
  };

  await render(<Test />);

  const getState = () => {
    if (!stateRef.current) {
      throw new Error("Hook state not initialized");
    }
    return stateRef.current;
  };

  return { getState };
};

describe("usePostEditorTags", () => {
  it("filters tag suggestions to exclude selected tags", async () => {
    // Arrange
    const { getState } = await renderHook({
      initialTags: ["React"],
      tagSuggestions: ["react", "TypeScript"],
    });

    // Act
    const result = getState().normalizedTagSuggestions;

    // Assert
    expect(result).toEqual(["TypeScript"]);
  });

  it("adds tags from input and clears the input value", async () => {
    // Arrange
    const { getState } = await renderHook({ initialTags: ["React"] });

    // Act
    await act(async () => {
      getState().onTagInputKeyDown({
        currentTarget: { value: "React,Next.js" },
        key: "Enter",
        preventDefault: () => undefined,
      } as unknown as KeyboardEvent<HTMLInputElement>);
    });

    // Assert
    expect(getState().tags).toEqual(["React", "Next.js"]);
    expect(getState().tagInputValue).toBe("");
  });

  it("removes tags when requested", async () => {
    // Arrange
    const { getState } = await renderHook({
      initialTags: ["React", "Next.js"],
    });

    // Act
    act(() => {
      getState().onTagRemove("React");
    });

    // Assert
    expect(getState().tags).toEqual(["Next.js"]);
  });
});
