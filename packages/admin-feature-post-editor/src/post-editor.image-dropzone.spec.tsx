import { act } from "react";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { useImageDropzone } from "./post-editor.image-dropzone";

const useDropzoneMock = vi.hoisted(() => vi.fn());

vi.mock("react-dropzone", () => ({
  useDropzone: useDropzoneMock,
}));

const setup = async () => {
  const bodyRef = { current: "Hello" };
  const bodyTextareaRef = { current: null } as {
    current: HTMLTextAreaElement | null;
  };
  const onBodyChange = vi.fn();
  const uploadImage = vi.fn().mockResolvedValue({
    url: "https://example.com/image.png",
  });

  const state = {
    dropzoneConfig: null as null | { onDrop?: (files: File[]) => void },
    latest: null as null | ReturnType<typeof useImageDropzone>,
  };

  useDropzoneMock.mockImplementation((config) => {
    state.dropzoneConfig = config;
    return {
      getInputProps: () => ({}),
      getRootProps: () => ({}),
      isDragActive: false,
    };
  });

  const Test = () => {
    state.latest = useImageDropzone({
      bodyRef,
      bodyTextareaRef,
      onBodyChange,
      uploadImage,
    });
    return null;
  };

  await render(<Test />);

  return {
    bodyRef,
    bodyTextareaRef,
    onBodyChange,
    state,
    uploadImage,
  };
};

describe("useImageDropzone", () => {
  it("uploads dropped images and appends markdown", async () => {
    // Arrange
    const { onBodyChange, state, uploadImage } = await setup();
    const file = new File(["dummy"], "sample-image.png", {
      type: "image/png",
    });

    // Act
    await act(async () => {
      await state.dropzoneConfig?.onDrop?.([file]);
    });

    // Assert
    expect(uploadImage).toHaveBeenCalledOnce();
    expect(onBodyChange).toHaveBeenCalledWith(
      "Hello\n\n![sample image](https://example.com/image.png)",
    );
  });

  it("ignores empty drops", async () => {
    // Arrange
    const { onBodyChange, state, uploadImage } = await setup();

    // Act
    await state.dropzoneConfig?.onDrop?.([]);

    // Assert
    expect(uploadImage).not.toHaveBeenCalled();
    expect(onBodyChange).not.toHaveBeenCalled();
  });
});
