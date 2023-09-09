import { test, expect } from "@playwright/test";

test("homepage has title and links to flower page", async ({ page }) => {
  await page.goto("/blog/");

  // Expect a title "to contain" a substring.
  // await expect(page).toHaveTitle(/blog/);

  // create a locator
  const anchor = page.locator("a");

  // Expect an attribute "to be strictly equal" to the value.
  await expect(anchor).toHaveAttribute(
    "href",
    "/blog/contents/writing_efficiency_tool_introducing_ai_ghostwriter/"
  );
});
