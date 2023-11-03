import { ICustomWorld } from '../support/custom-world';
import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('Go to the silverbirder.github.io website', async function (this: ICustomWorld) {
  const page = this.page!;
  await page.goto('https://silverbirder.github.io/');
});

When('Change the language to English', async function (this: ICustomWorld) {
  const page = this.page!;
  await page
    .locator('div')
    .filter({ hasText: /^ブログ$/ })
    .getByRole('img')
    .nth(1)
    .click();
});

Then('Show the English page', async function (this: ICustomWorld) {
  const page = this.page!;
  const text = await page.getByRole('heading', { name: 'Background' }).textContent();
  expect(text).toEqual('Background');
});
