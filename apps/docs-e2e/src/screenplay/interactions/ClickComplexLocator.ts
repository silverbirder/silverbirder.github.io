import { Interaction } from './Interaction';
import { Actor } from '../actors/Actor';
import { Locator } from '@playwright/test';

export class ClickComplexLocator implements Interaction {
  private constructor(private locator: Locator) {}

  static onComplexLocator(locator: Locator): ClickComplexLocator {
    return new ClickComplexLocator(locator);
  }

  async performAs(actor: Actor): Promise<void> {
    actor.name;
    await this.locator.click();
  }
}
