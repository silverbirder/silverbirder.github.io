import { describe, expect, it } from "vitest";
import { render } from "vitest-browser-react";

import { Provider } from "./provider";

describe("Provider", () => {
  it("renders children", async () => {
    const { container } = await render(
      <Provider>
        <div data-testid="child">Hello</div>
      </Provider>,
    );

    expect(container.querySelector('[data-testid="child"]')).not.toBeNull();
  });
});
