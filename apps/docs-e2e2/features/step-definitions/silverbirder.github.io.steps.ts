import { Given, Then, When } from "@cucumber/cucumber";
import { Ensure, isPresent } from "@serenity-js/assertions";
import { Actor } from "@serenity-js/core";
import { By, Click, Navigate, PageElement } from "@serenity-js/web";

Given(
  "{actor} goes to the silverbirder.github.io website",
  async (actor: Actor) =>
    actor.attemptsTo(Navigate.to("http://localhost:5173/"))
);

When("{actor} changes the language to English", async (actor: Actor) => {
  await actor.attemptsTo(
    Click.on(
      PageElement.located(By.css(`[data-testid="en"]`).describedAs("English"))
    )
  );
});
Then("{actor} shows the English page", async (actor: Actor) => {
  await actor.attemptsTo(
    Ensure.that(
      PageElement.located(By.cssContainingText("h2", "Background")),
      isPresent()
    )
  );
});
