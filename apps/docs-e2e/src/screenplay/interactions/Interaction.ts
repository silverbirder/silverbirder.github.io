import { Actor } from '../actors/Actor';

export interface Interaction {
  performAs(actor: Actor): Promise<void>;
}
