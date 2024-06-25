import { symbols } from '@foscia/cli/utils/cli/output';
import promptEnquirer, { PromptOptions } from '@foscia/cli/utils/prompts/promptEnquirer';
import {
  convertChoices,
  PromptSelectChoice,
  resolveChoice,
} from '@foscia/cli/utils/prompts/promptSelect';

export type PromptMultiSelectOptions<T> = PromptOptions<T[]> & {
  choices: readonly PromptSelectChoice<T>[];
};

export default async function promptMultiSelect<T>(options: PromptMultiSelectOptions<T>) {
  const value = await promptEnquirer<string[]>('MultiSelect', {
    emptyError: 'no items selected',
    symbols: {
      indicator: {
        on: symbols.checkboxOn,
        off: symbols.checkboxOff,
      },
    },
    ...options,
    choices: convertChoices(options.choices),
    initial: [],
  });

  return value.map((v) => resolveChoice(options.choices, v));
}
