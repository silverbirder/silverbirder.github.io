import { Actor } from "../Actor";
import { Question } from "../Question";
import { BrowseTheWeb } from "../abilities/BrowseTheWeb";

export class TheCurrentURL implements Question<string> {
  async answeredBy(actor: Actor): Promise<string> {
    const ability = actor.abilityTo(BrowseTheWeb);
    // return await ability.getCurrentURL();
    return "";
  }
}
