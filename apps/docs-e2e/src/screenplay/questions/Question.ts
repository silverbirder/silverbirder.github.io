import { Actor } from '../actors/Actor';

export interface Question<T> {
  answeredBy(actor: Actor): Promise<T>;
}
