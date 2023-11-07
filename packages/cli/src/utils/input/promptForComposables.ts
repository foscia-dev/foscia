import { CLIConfig } from '@foscia/cli/utils/config/config';
import listFiles from '@foscia/cli/utils/files/listFiles';
import resolvePath from '@foscia/cli/utils/files/resolvePath';
import { ImportItem, ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { checkbox } from '@inquirer/prompts';
import { camelCase, sortBy } from 'lodash-es';
import { sep } from 'node:path';

async function resolveComposables(config: CLIConfig) {
  try {
    const rootPath = resolvePath(config, 'composables');
    const files = await listFiles(resolvePath(config, 'composables'));

    return files.map((file) => {
      const [fileName, ...dirs] = file.replace(rootPath, '').split(sep).reverse();
      const name = fileName.replace(/\.ts/, '');

      return {
        name: camelCase(name),
        from: ['composables', ...dirs.reverse().filter((d) => d !== ''), name].join('/'),
      } as ImportItem;
    });
  } catch {
    return [];
  }
}

export default async function promptForComposables(config: CLIConfig, imports: ImportsList) {
  const availableComposables = await resolveComposables(config);
  if (!availableComposables.length) {
    console.info(`${logSymbols.info} No composable found, skipping composables selection.`);

    return [];
  }

  const composables = sortBy(await checkbox({
    message: 'Give composables to use:',
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
