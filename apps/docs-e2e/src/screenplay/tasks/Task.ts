import { Actor } from '../actors/Actor';

export interface Task {
  performAs(actor: Actor): Promise<void>;
}
