import { Task } from "../Task";
import { Actor } from "../Actor";
import { ClickOn } from "../interactions/ClickOn";

export class VisitWebsite implements Task {
  constructor(private url: string) {}

  static at(url: string) {
    return new VisitWebsite(url);
  }

  async performAs(actor: Actor): Promise<void> {
    actor.attemptsTo(ClickOn.selector(""));
  }
}
