import output from '@foscia/cli/utils/cli/output';
import { CLIConfig } from '@foscia/cli/utils/config/config';
import resolveComposables from '@foscia/cli/utils/context/resolveComposables';
import { ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import { checkbox } from '@inquirer/prompts';
import { sortBy } from 'lodash-es';

export default async function promptForComposables(config: CLIConfig, imports: ImportsList) {
  const availableComposables = await resolveComposables(config);
  if (!availableComposables.length) {
    output.info('no composable found, skipping selection');

    return [];
  }

  const composables = sortBy(await checkbox({
    message: 'select composables to use:',
    choices: availableComposables.map((composable) => ({
      name: composable.name,
      value: composable,
    })),
  }), 'name');

  composables.forEach((composable) => {
    imports.add(composable.name, composable.from, { isDefault: true });
  });

  return composables.map((c) => c.name);
}
