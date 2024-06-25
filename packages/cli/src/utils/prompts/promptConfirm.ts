import promptEnquirer, { PromptOptions } from '@foscia/cli/utils/prompts/promptEnquirer';

export type PromptConfirmOptions = PromptOptions<boolean>;

export default function promptConfirm(options: PromptConfirmOptions) {
  return promptEnquirer('Confirm', {
    ...options,
    format(this: any, value: unknown) {
      const { styles, state } = this;
      const printValue = this.cast(value) ? 'yes' : 'no';

      return !state.submitted ? styles.primary(printValue) : styles.success(printValue);
    },
  });
}
