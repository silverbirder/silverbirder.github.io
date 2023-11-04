import { Task } from './Task';
import { PlaywrightAbility } from '../abilities/PlaywightAbility';
import { Actor } from '../actors/Actor';

export class NavigateTo implements Task {
  constructor(private url: string) {}

  static the(url: string): NavigateTo {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const page = actor.abilityTo(PlaywrightAbility).page;
    await page.goto(this.url);
  }
}
