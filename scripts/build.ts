import { execa } from 'execa';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { oraPromise } from 'ora';
import { rimraf } from 'rimraf';
import { entries, listFiles, useRootDirname } from './utils';

const rootDirname = useRootDirname();

(() => run())();

async function run() {
  const forEachEntries = (
    callback: (entry: string) => Promise<unknown>,
  ) => Promise.all(entries.map(callback));

  const clearTmp = () => forEachEntries(async (entry) => {
    await rimraf([`packages/${entry}/tmp`]);
  });

  try {

    await oraPromise(async () => {
      await clearTmp();
      await forEachEntries(async (entry) => {
        await rimraf([`packages/${entry}/tmp`]);
      });
    }, {
      text: 'Cleaning dist...',
      successText: 'Cleaned dist.',
    });

    await oraPromise(() => forEachEntries(async (entry) => {
      const tmpPath = path.resolve(rootDirname, `packages/${entry}/tmp`);

      await execa({ shell: true, stdio: 'inherit' })`cp ${[
        '-r',
        path.resolve(rootDirname, `packages/${entry}/src`),
        tmpPath,
      ]}`;

      await Promise.all((await listFiles(tmpPath)).map(async (absoluteFilePath) => {
        const relativeFilePath = absoluteFilePath.replace(tmpPath, '');
        const directoryDepth = (relativeFilePath.match(/\//g) ?? []).length - 1;

        let fileContent = await readFile(absoluteFilePath, 'utf8');

        (fileContent.match(/from '@foscia\/([a-z]+\/)/g) ?? []).forEach((match) => {
          fileContent = fileContent.replaceAll(
            match,
            `from '${directoryDepth < 1 ? './' : '../'.repeat(directoryDepth)}`,
          );
        });

        await writeFile(absoluteFilePath, fileContent);
      }));
    }), {
      text: 'Preparing sources...',
      successText: 'Prepared sources.',
    });

    await oraPromise(async () => {
      await execa({ stdio: 'inherit' })`unbuild`;
    }, {
      text: 'Building dist...',
      successText: 'Built dist.',
    });

    await oraPromise(async () => {
      await rimraf(['packages/cli/dist/index.d.cts']);
      await rimraf(['packages/cli/dist/index.d.mts']);
      await rimraf(['packages/cli/dist/index.mjs']);

      await forEachEntries(async (entry) => {
        await rimraf([`packages/${entry}/tmp`]);
        await rimraf([`packages/${entry}/dist/index.d.ts`]);
      });
    }, {
      text: 'Cleaning sources...',
      successText: 'Cleaned sources.',
    });
  } catch {
    await clearTmp();

    process.exit(1);
  }
}
