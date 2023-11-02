import { Actor } from "../Actor";
import { Interaction } from "../Interaction";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";

export class ClickOn implements Interaction {
  constructor(private selector: string) {}

  static selector(selector: string) {
    return new ClickOn(selector);
  }

  async performAs(actor: Actor): Promise<void> {
    const ability = actor.abilityTo(BrowseTheWeb);
    await ability.click(this.selector);
  }
}
