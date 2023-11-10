import { Ensure, isPresent } from '@serenity-js/assertions';
import { Task } from '@serenity-js/core';
import { By,PageElement } from '@serenity-js/web';

export const VerifyPage = {
    ofEnglish: () =>
        Task.where(
            `#actor verifies that the English page is shown`,
            Ensure.that(
                PageElement.located(By.cssContainingText('h2', 'Background')),
                isPresent()
            )
        ),
    ofJapanese: () =>
        Task.where(
            `#actor verifies that the Japanese page is shown`,
            Ensure.that(
                PageElement.located(By.cssContainingText('h2', '経歴')),
                isPresent()
            )
        ),
};
