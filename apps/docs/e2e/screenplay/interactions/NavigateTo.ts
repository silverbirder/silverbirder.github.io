import { Actor } from "../Actor";
import { Interaction } from "../Interaction";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";

export class NavigateTo implements Interaction {
  constructor(private url: string) {}

  static url(url: string) {
    return new NavigateTo(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const ability = actor.abilityTo(BrowseTheWeb);
    await ability.page.goto(this.url);
  }
}
