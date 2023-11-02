import { Actor } from "../Actor";
import { Interaction } from "../Interaction";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";

export class ClickOn implements Interaction {
  constructor(private url: string) {}

  static link(url: string) {
    return new ClickOn(url);
  }

  async performAs(actor: Actor): Promise<void> {
    const ability = actor.abilityTo(BrowseTheWeb);
    await ability.page.getByText("ブログ").click();
  }
}