import { symbols } from '@foscia/cli/utils/cli/output';
import promptEnquirer, { PromptOptions } from '@foscia/cli/utils/prompts/promptEnquirer';

export type PromptSelectChoice<T> = {
  name: string;
  value: T;
  hint?: string;
  disabled?: boolean;
};

export type PromptSelectOptions<T> = Exclude<PromptOptions<T>, 'initial'> & {
  type?: 'Select' | 'MultiSelect';
  choices: readonly PromptSelectChoice<T>[];
};

export function convertChoices<T>(choices: readonly PromptSelectChoice<T>[]) {
  return choices.map(({ value, name, ...other }) => ({ name, ...other }));
}

export function resolveChoice<T>(choices: readonly PromptSelectChoice<T>[], value: string) {
  return choices.find((choice) => choice.name === value)?.value as T;
}

export default async function promptSelect<T>(options: PromptSelectOptions<T>) {
  const value = await promptEnquirer<string>('Select', {
    symbols: {
      pointer: {
        on: symbols.radioOn,
        off: symbols.radioOff,
      },
    },
    ...options,
    choices: convertChoices(options.choices),
    initials: undefined,
  });

  return resolveChoice(options.choices, value);
}
