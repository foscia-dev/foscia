import promptEnquirer, { PromptOptions } from '@foscia/cli/utils/prompts/promptEnquirer';

export type PromptTextOptions = PromptOptions<string>;

export default async function promptText(options: PromptTextOptions) {
  return promptEnquirer('Input', options);
}
