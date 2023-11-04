import { ICustomWorld } from '../support/custom-world';
import { PlaywrightAbility } from '../screenplay/abilities/PlaywightAbility';
import { Actor } from '../screenplay/actors/Actor';
import { NavigateTo } from '../screenplay/tasks/NavigateTo';
import { ClickComplexLocator } from '../screenplay/interactions/ClickComplexLocator';
import { TextContent } from '../screenplay/questions/TextContent';
import { expect } from '@playwright/test';
import { Given, When, Then } from '@cucumber/cucumber';

Given('Go to the silverbirder.github.io website', async function (this: ICustomWorld) {
  const actor = Actor.named('The User').can(PlaywrightAbility.using(this.page!));
  await actor.attemptsTo(NavigateTo.the('https://silverbirder.github.io/'));
});

When('Change the language to English', async function (this: ICustomWorld) {
  const actor = Actor.named('The User').can(PlaywrightAbility.using(this.page!));
  await actor.attemptsTo(
    ClickComplexLocator.onComplexLocator(
      this.page!.locator('div')
        .filter({ hasText: /^ブログ$/ })
        .getByRole('img')
        .nth(1),
    ),
  );
});

Then('Show the English page', async function (this: ICustomWorld) {
  const actor = Actor.named('The User').can(PlaywrightAbility.using(this.page!));
  const text = await actor.asksFor(TextContent.ofRoleWithName('heading', 'Background'));
  expect(text).toEqual('Background');
});
