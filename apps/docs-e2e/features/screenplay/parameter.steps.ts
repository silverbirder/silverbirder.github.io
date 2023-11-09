import { defineParameterType } from '@cucumber/cucumber';
import { actorCalled, actorInTheSpotlight } from '@serenity-js/core';

defineParameterType({
    regexp: /Alice|Bob/,
    transformer(name: string) {
        return actorCalled(name);
    },
    name: 'actor',
});

export type Language = 'Japanese' | 'English';
defineParameterType({
    regexp: /Japanese|English/,
    transformer(name: string) {
        return name as Language;
    },
    name: 'language',
});

defineParameterType({
    regexp: /he|she|they|his|her|their/,
    transformer() {
        return actorInTheSpotlight();
    },
    name: 'pronoun',
});
