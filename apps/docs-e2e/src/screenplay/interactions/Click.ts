import { PlaywrightAbility } from '../abilities/PlaywightAbility';
import { Actor } from '../actors/Actor';
import { Interaction } from '../interactions/Interaction';

export class Click implements Interaction {
  constructor(private selector: string) {}

  static on(selector: string): Click {
    return new Click(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(PlaywrightAbility).page;
    await page.locator(this.selector).click();
  }
}
