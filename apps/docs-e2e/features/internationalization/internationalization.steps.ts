import { Given, Then, When } from '@cucumber/cucumber';
import { Actor } from '@serenity-js/core';
import { Navigate } from '@serenity-js/web';

import { ChangeLanguageTo, VerifyPage } from '../screenplay/tasks';

Given(
    '{actor} navigates to the homepage in the {language} language',
    async (actor: Actor, language: string) =>
        actor.attemptsTo(Navigate.to(language === 'English' ? '/en-US' : '/'))
);

When(
    '{actor} selects {language} from the language menu',
    async (actor: Actor, language: string) =>
        actor.attemptsTo(
            language === 'English'
                ? ChangeLanguageTo.English()
                : ChangeLanguageTo.Japanese()
        )
);

Then(
    'the page is displayed to {actor} in the {language}',
    async (actor: Actor, language: string) =>
        actor.attemptsTo(
            language === 'English' ? VerifyPage.ofEnglish() : VerifyPage.ofJapanese()
        )
);
