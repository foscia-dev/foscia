import promptSelect from '@foscia/cli/utils/prompts/promptSelect';

export type RelationsLoader = typeof RELATIONS_LOADERS[number]['value'];

export const RELATIONS_LOADERS = [
  {
    value: 'refresh.include',
    name: 'query passed model and include relations',
    defaultName: 'WithRefresh',
  },
  {
    value: 'query.model',
    name: 'query related models indexes and include nested relations',
    defaultName: 'WithModelQuery',
  },
  {
    value: 'query.relation',
    name: 'query relations indexes and include nested relations',
    defaultName: 'WithRelationQuery',
  },
] as const;

export default async function promptForLoader(): Promise<RelationsLoader> {
  return promptSelect({
    name: 'loader',
    message: 'what kind of loader would you like?',
    choices: RELATIONS_LOADERS,
  });
}
