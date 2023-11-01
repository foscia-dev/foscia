import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';

export default async function listFiles(path: string) {
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
  }, Promise.resolve([] as string[]));
}
