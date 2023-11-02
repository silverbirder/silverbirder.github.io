import { Question } from "./Question";
import { Task } from "./Task";

export class Actor {
  private abilities: any = {};

  constructor(private name: string) {}

  static named(name: string): Actor {
    return new Actor(name);
  }

  can(ability: any): Actor {
    this.abilities[ability.constructor.name] = ability;
    return this;
  }

  abilityTo(ability: any): any {
    return this.abilities[ability.name];
  }

  attemptsTo(...tasks: Task[]): Promise<void[]> {
    return Promise.all(tasks.map((task) => task.performAs(this)));
  }

  async ask<T>(question: Question<T>): Promise<T> {
    return await question.answeredBy(this);
  }
}
