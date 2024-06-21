import promptEnquirer, { PromptOptions } from '@foscia/cli/utils/prompts/promptEnquirer';

export type PromptConfirmOptions = PromptOptions<boolean>;

export default function promptConfirm(options: PromptConfirmOptions) {
  return promptEnquirer('Confirm', options);
}
