import findUp from '@foscia/cli/utils/files/findUp';
import readFile from '@foscia/cli/utils/files/readFile';

async function requireResolveFrom(moduleId: string): Promise<string | null> {
  try {
    return require.resolve(moduleId, {
      paths: (await findUp('node_modules', {
        findAll: true,
        directory: true,
      })).flat(),
    });
  } catch {
    return null;
  }
}

async function resolveVersionFrom(moduleId: string) {
  try {
    const pkgJsonPath = await requireResolveFrom(`${moduleId}/package.json`);

    if (!pkgJsonPath) {
      return null;
    }

    const pkgJsonString = await readFile(pkgJsonPath);
    const pkgJson = JSON.parse(pkgJsonString ?? '{}');

    if (!pkgJson.version) {
      return null;
    }

    return pkgJson.version as string;
  } catch {
    return null;
  }
}

let version = null as string | null;

export const getVersion = () => version ?? '(unknown)';

export const resolveVersion = async () => {
  version = await resolveVersionFrom('@foscia/cli');
};
