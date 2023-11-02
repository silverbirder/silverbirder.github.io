import { Task } from "../Task";
import { Actor } from "../Actor";
import { NavigateTo } from "../interactions/NavigateTo";

export class VisitWebsite implements Task {
  constructor(private url: string) {}

  static at(url: string) {
    return new VisitWebsite(url);
  }

  async performAs(actor: Actor): Promise<void> {
    actor.attemptsTo(NavigateTo.url(this.url));
  }
}
