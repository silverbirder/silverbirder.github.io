declare module "budoux" {
  export type BudouxParser = {
    parse: (text: string) => string[];
  };

  export const jaModel: unknown;

  export class Parser {
    constructor(model: unknown);
    parse(text: string): string[];
  }

  export function loadDefaultJapaneseParser():
    | BudouxParser
    | Promise<BudouxParser>;
}
