import { CLIConfig } from '@foscia/cli/utils/config/config';
import listFiles from '@foscia/cli/utils/files/listFiles';
import resolvePath from '@foscia/cli/utils/files/resolvePath';
import { ImportItem } from '@foscia/cli/utils/imports/makeImportsList';
import { camelCase } from 'lodash-es';
import { sep } from 'node:path';

export default async function resolveModels(config: CLIConfig): Promise<ImportItem[]> {
  try {
    const rootPath = resolvePath(config, 'models');
    const files = await listFiles(resolvePath(config, 'models'));

    return files.map((file) => {
      const [fileName, ...dirs] = file.replace(rootPath, '').split(sep).reverse();
      const name = fileName.replace(/\.(ts|js)$/, '');

      return {
        name: camelCase(name),
        from: ['models', ...dirs.reverse().filter((d) => d !== ''), name].join('/'),
        isDefault: true,
      } as ImportItem;
    });
  } catch {
    return [];
  }
}
