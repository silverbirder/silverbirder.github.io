import { Given, Then, When } from "@cucumber/cucumber";
import { Ensure, equals } from "@serenity-js/assertions";
import { Actor, notes } from "@serenity-js/core";
import { By, Navigate, PageElement, PageElements } from "@serenity-js/web";

Given("{actor} is on the blog list page", async (actor: Actor) =>
  actor.attemptsTo(Navigate.to("/blog"))
);

When("{pronoun} selects first blog post", async (pronoun: Actor) =>
  pronoun.attemptsTo(
    notes().set(
      "firstBlogPostTitle",
      await PageElements.located(By.css(`[data-testid="blog-title"]`))
        .first()
        .text()
    ),
    PageElements.located(By.css(`[data-testid="blog-title"]`)).first().click()
  )
);

Then("{actor} should see the selected blog post", async (actor: Actor) =>
  actor.attemptsTo(
    Ensure.that(
      await PageElement.located(By.tagName("h1")).text(),
      equals(notes().get("firstBlogPostTitle"))
    )
  )
);
