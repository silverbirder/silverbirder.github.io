import { Task } from './Task';
import { Actor } from '../actors/Actor';
import { Click } from '../interactions/Click';

export class ChangeLanguageToEnglish implements Task {
  async performAs(actor: Actor): Promise<void> {
    await actor.attemptsTo(Click.on(''));
  }
}
