import { beforeEach, describe, expect, it, vi } from "vitest";

const init = vi.fn();

vi.mock("@microsoft/clarity", () => ({
  default: {
    init,
  },
}));

vi.mock("react", async () => {
  const actual = await vi.importActual<typeof import("react")>("react");

  return {
    ...actual,
    useEffect: (effect: () => void) => {
      effect();
    },
  };
});

describe("ClarityScript", () => {
  beforeEach(() => {
    init.mockClear();
  });

  it("initializes Clarity when project id is present", async () => {
    // Arrange
    const { ClarityScript } = await import("./clarity");

    // Act
    const result = ClarityScript({ projectId: "clarity-project-id" });

    // Assert
    expect(result).toBeNull();
    expect(init).toHaveBeenCalledWith("clarity-project-id");
  });

  it("does not initialize Clarity when project id is not present", async () => {
    // Arrange
    const { ClarityScript } = await import("./clarity");

    // Act
    const result = ClarityScript({});

    // Assert
    expect(result).toBeNull();
    expect(init).not.toHaveBeenCalled();
  });
});
