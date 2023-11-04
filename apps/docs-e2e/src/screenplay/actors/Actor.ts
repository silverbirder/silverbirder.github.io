import { Ability } from '../abilities/Ability';
import { Question } from '../questions/Question';
import { Task } from '../tasks/Task';

export class Actor {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  private abilities: Map<Ability, any> = new Map();

  private constructor(public readonly name: string) {}

  static named(name: string): Actor {
    return new Actor(name);
  }

  can(ability: Ability): Actor {
    this.abilities.set(ability.constructor, ability);
    return this;
  }

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  abilityTo<T>(AbilityType: { new (...args: any[]): T }): T {
    const ability = this.abilities.get(AbilityType);
    if (!ability) {
      throw new Error(`The actor ${this.name} does not have the ability to ${AbilityType.name}`);
    }
    return ability;
  }

  attemptsTo(...tasks: Task[]): Promise<void> {
    return tasks.reduce(
      (promise, task) => promise.then(() => task.performAs(this)),
      Promise.resolve(),
    );
  }

  asksFor<T>(question: Question<T>): Promise<T> {
    return question.answeredBy(this);
  }
}
