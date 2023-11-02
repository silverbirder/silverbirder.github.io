import { Task } from "../Task";
import { Actor } from "../Actor";
import { ClickOn } from "../interactions/ClickOn";

export class ChangeLanguage implements Task {
  constructor() {}

  static toEnglish() {
    return new ChangeLanguage();
  }

  async performAs(actor: Actor): Promise<void> {
    actor.attemptsTo(ClickOn.link(""));
  }
}
