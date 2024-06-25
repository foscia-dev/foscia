import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

type FindUpMatcher = string | RegExp | ((fileName: string, dir: string) => boolean);
type FindUpOptions = {
  findAll?: boolean;
  directory?: boolean;
};

function isMatch(path: string, fileName: string, matcher: FindUpMatcher) {
  if (typeof matcher === 'string') {
    return fileName === matcher;
  }

  if (matcher instanceof RegExp) {
    return matcher.test(fileName);
  }

  return matcher(fileName, path);
}

async function findInDirectory(path: string, matcher: FindUpMatcher, directory: boolean) {
  const files = await readdir(path, { withFileTypes: true });

  return files
    .filter((file) => (
      (directory ? file.isDirectory() : file.isFile())
      && isMatch(file.parentPath ?? file.path, file.name, matcher)
    ))
    .map((file) => resolve(file.parentPath ?? file.path, file.name));
}

async function findInDirectoryAndParents(
  path: string,
  matcher: FindUpMatcher,
  options?: FindUpOptions,
): Promise<string[][]> {
  const files = await findInDirectory(path, matcher, options?.directory ?? false);
  if (files.length && !options?.findAll) {
    return [files];
  }

  const parentPath = resolve(path, '..');
  if (path === parentPath) {
    return files.length ? [files] : [];
  }

  return [
    ...(files.length ? [files] : []),
    ...(await findInDirectoryAndParents(parentPath, matcher, options)),
  ];
}

export default async function findUp(matcher: FindUpMatcher, options?: FindUpOptions) {
  return findInDirectoryAndParents(resolve('.'), matcher, options);
}
