import { Given, Then, When } from "@cucumber/cucumber";
import { Actor } from "@serenity-js/core";
import { Navigate } from "@serenity-js/web";

import { Language } from "../screenplay/parameter.steps";
import { ChangeLanguageTo, VerifyPage } from "../screenplay/tasks";

Given(
  "{actor} is on the homepage in the {language} language",
  async (actor: Actor, language: Language) =>
    actor.attemptsTo(Navigate.to(language === "English" ? "/en-US" : "/"))
);

When(
  "{actor} selects {language} from the language menu",
  async (actor: Actor, language: Language) =>
    actor.attemptsTo(
      language === "English"
        ? ChangeLanguageTo.English()
        : ChangeLanguageTo.Japanese()
    )
);

Then(
  "The page is displayed to {pronoun} in the {language}",
  async (pronoun: Actor, language: Language) =>
    pronoun.attemptsTo(
      language === "English" ? VerifyPage.ofEnglish() : VerifyPage.ofJapanese()
    )
);
