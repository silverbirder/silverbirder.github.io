import { Task } from '@serenity-js/core';
import { By, Click, PageElement } from '@serenity-js/web';

export const ChangeLanguageTo = {
    English: () =>
        Task.where(
            `#actor changes language to English`,
            Click.on(
                PageElement.located(By.css(`[data-testid="en"]`).describedAs('English'))
            )
        ),
    Japanese: () =>
        Task.where(
            `#actor changes language to Japanese`,
            Click.on(
                PageElement.located(
                    By.css(`[data-testid="ja"]`).describedAs('Japanese')
                )
            )
        ),
};
