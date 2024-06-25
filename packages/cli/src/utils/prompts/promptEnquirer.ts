import c from 'ansi-colors';
import { prompt } from 'enquirer';

export type PromptOptions<T> = {
  name: string;
  message: string;
  initial?: T;
  [K: string]: unknown;
};

export type PromptResponse<K extends string, T> = {
  [k in K]: T;
};

export default async function promptEnquirer<T>(type: string, options: PromptOptions<T>) {
  return (await prompt<PromptResponse<typeof options['name'], T>>({
    type,
    ...options,
    styles: {
      danger: c.red,
      ...(options.styles ?? {}),
    },
  } as any))[options.name];
}
