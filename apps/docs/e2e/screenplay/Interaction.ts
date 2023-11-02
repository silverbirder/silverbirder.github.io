import { Actor } from "./Actor";

export interface Interaction {
  performAs(actor: Actor): Promise<void>;
}
