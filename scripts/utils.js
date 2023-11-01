import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export function useRootDirname() {
  return fileURLToPath(new URL('..', import.meta.url));
}

export async function listFiles(path) {
  const files = await readdir(path, { withFileTypes: true });

  return files.reduce(async (allFilesPromise, file) => {
    const allFiles = await allFilesPromise;

    const fullPath = resolve(file.path, file.name);
    if (file.isDirectory()) {
      allFiles.push(...(await listFiles(fullPath)));
    } else {
      allFiles.push(fullPath);
    }

    return allFiles;
  }, Promise.resolve([]));
}
