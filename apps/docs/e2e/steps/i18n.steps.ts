import { Given, When, Then } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { expect } from "@playwright/test";
import { Actor } from "../screenplay/Actor";
import { BrowseTheWeb } from "../screenplay/abilities/BrowseTheWeb";
import { VisitWebsite } from "../screenplay/tasks/VisitWebsite";
import { TheCurrentURL } from "../screenplay/questions/TheCurrentURL";

let actors: { [name: string]: Actor } = {};

Given(
  "ユーザー {string} は日本のトップページを開いている",
  async function (this, actorName: string) {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    const actor = Actor.named(actorName).can(BrowseTheWeb.using(page));
    await actor.attemptsTo(VisitWebsite.at("https://example.com/jp"));
    actors[actorName] = actor;
  }
);

When("{string} は英語に切り替える", async function (this, actorName: string) {
  await actors[actorName].attemptsTo(VisitWebsite.at(""));
});

Then(
  "{string} は英語のBackgroundの文字が見える",
  async function (this, actorName: string) {
    const currentUrl = await actors[actorName].ask(new TheCurrentURL());
    expect(currentUrl).toBe("");
  }
);
