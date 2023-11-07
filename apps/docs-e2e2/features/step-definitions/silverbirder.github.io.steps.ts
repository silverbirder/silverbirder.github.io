import { Given, Then, When } from "@cucumber/cucumber";
import { Ensure, isPresent } from "@serenity-js/assertions";
import { Actor, Task } from "@serenity-js/core";
import { By, Click, Navigate, PageElement } from "@serenity-js/web";

export const GoToWebsite = {
  called: (url: string) =>
    Task.where(`#actor goes to ${url}`, Navigate.to(url)),
};

export const ChangeLanguageTo = {
  English: () =>
    Task.where(
      `#actor changes language to English`,
      Click.on(
        PageElement.located(By.css(`[data-testid="en"]`).describedAs("English"))
      )
    ),
};

export const VerifyEnglishPage = Task.where(
  `#actor verifies that the English page is shown`,
  Ensure.that(
    PageElement.located(By.cssContainingText("h2", "Background")),
    isPresent()
  )
);

Given(
  "{actor} goes to the silverbirder.github.io website",
  async (actor: Actor) =>
    actor.attemptsTo(GoToWebsite.called("http://localhost:5173/"))
);

When("{actor} changes the language to English", async (actor: Actor) =>
  actor.attemptsTo(ChangeLanguageTo.English())
);

Then("{actor} shows the English page", async (actor: Actor) =>
  actor.attemptsTo(VerifyEnglishPage)
);
