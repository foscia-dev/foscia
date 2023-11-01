import findUp from '@foscia/cli/utils/files/findUp';
import { readFile } from 'node:fs/promises';

type RawPkg = {
  type?: string;
  dependencies?: { [k: string]: string };
  devDependencies?: { [k: string]: string };
};

type ParsedPkg = {
  type?: string;
  findDependency: (dependency: string) => string | null;
  findDevDependency: (dependency: string) => string | null;
};

function parsePkg(rawPkg: RawPkg): ParsedPkg {
  const findDependencyIn = (
    dependencies: { [k: string]: string } | undefined,
    dependency: string,
  ) => (dependencies ?? {})[dependency] ?? null;

  return {
    type: rawPkg.type,
    findDependency: (dependency: string) => findDependencyIn(rawPkg.dependencies, dependency),
    findDevDependency: (dependency: string) => findDependencyIn(rawPkg.dependencies, dependency),
  };
}

async function loadPkg() {
  const [pkgPath] = (await findUp('package.json')).flat();
  if (pkgPath) {
    const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));

    return pkg && typeof pkg === 'object' ? pkg : {};
  }

  return {};
}

let cachedPkg: ParsedPkg | undefined;

export default async function usePkg() {
  if (!cachedPkg) {
    cachedPkg = parsePkg(await loadPkg());
  }

  return cachedPkg;
}
