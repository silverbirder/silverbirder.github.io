import { Actor } from './Actor';

export interface Task {
    performAs(actor: Actor): Promise<void>;
}