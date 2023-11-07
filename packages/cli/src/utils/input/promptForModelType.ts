import { CLIConfig } from '@foscia/cli/utils/config/config';
import listFiles from '@foscia/cli/utils/files/listFiles';
import resolvePath from '@foscia/cli/utils/files/resolvePath';
import { ImportItem, ImportsList } from '@foscia/cli/utils/imports/makeImportsList';
import logSymbols from '@foscia/cli/utils/output/logSymbols';
import { select } from '@inquirer/prompts';
import { camelCase, upperFirst } from 'lodash-es';
import { sep } from 'node:path';

async function resolveModels(config: CLIConfig) {
  try {
    const rootPath = resolvePath(config, 'models');
    const files = await listFiles(resolvePath(config, 'models'));

    return files.map((file) => {
      const [fileName, ...dirs] = file.replace(rootPath, '').split(sep).reverse();
      const name = fileName.replace(/\.ts/, '');

      return {
        name: upperFirst(camelCase(name)),
        from: ['models', ...dirs.reverse().filter((d) => d !== ''), name].join('/'),
      } as ImportItem;
    });
  } catch {
    return [];
  }
}

export default async function promptForModelType(config: CLIConfig, imports: ImportsList) {
  const availableModels = await resolveModels(config);
  if (!availableModels.length) {
    console.info(`${logSymbols.info} No model found, skipping related model selection.`);

    return undefined;
  }

  const model = await select({
    message: 'Give a related model:',
    choices: availableModels.map((m) => ({
      name: m.name,
      value: m,
    })),
  });

  if (model) {
    imports.add(model.name, model.from, { isDefault: true });
  }

  return model.name;
}
