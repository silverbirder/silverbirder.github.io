import { Ability } from './Ability';
import { Page } from '@playwright/test';

export class PlaywrightAbility implements Ability {
  constructor(public readonly page: Page) {}

  static using(page: Page) {
    return new PlaywrightAbility(page);
  }
}
