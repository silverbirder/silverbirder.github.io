import { Page } from "playwright";

export class BrowseTheWeb {
  private constructor(private _page: Page) {}

  static using(page: Page) {
    return new BrowseTheWeb(page);
  }

  get page(): Page {
    return this._page;
  }
}
