import c from 'ansi-colors';
import { execa } from 'execa';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { oraPromise } from 'ora';
import { listFiles, useRootDirname } from './utils';

(() => run())();

async function run() {
  try {
    await oraPromise(check, {
      text: 'Checking code...',
      successText: 'Checks OK.',
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }

  try {
    await oraPromise(lint, {
      text: 'Linting code...',
      successText: 'Code style OK.',
    });
  } catch {
    process.exit(1);
  }
}

async function check() {
  const errors = [] as string[];

  // Check for external package use with relative path imports.
  const rootDirname = useRootDirname();
  await Promise.all(
    (await listFiles(path.resolve(rootDirname, 'packages'))).map(async (file) => {
      const [_, packageName, context] = file.match(/packages\/([a-z-]+)\/(src|tests)/) ?? [];
      if (packageName && (packageName !== 'cli' || context !== 'tests')) {
        const fileErrors = [] as string[];
        const fileContent = await readFile(file, { encoding: 'utf8' });
        const matches = fileContent.matchAll(/[^\n]+(from '@foscia\/[a-z-]+(\/index|.))/g);
        [...matches].forEach((match) => {
          const importPackageName = match[1].substring(14, match[1].length).replace(/(\/index|.)$/, '');
          if (match[0].match(/^\s+\*/)) {
            return;
          }

          if (match[1].endsWith('/') && (context !== 'src' || packageName !== importPackageName)) {
            fileErrors.push(
              `import of ${c.red(`@foscia/${importPackageName}`)} must use root package export (instead of inner package export)`,
            );
          }

          if (context === 'src' && packageName === importPackageName && (!match[1].endsWith('/') || match[1].endsWith('/index'))) {
            fileErrors.push(
              `import of ${c.red(`@foscia/${packageName}`)} must use inner package export (instead of root package export)`,
            );
          }
        });

        if (fileErrors.length) {
          errors.push(`${c.underline(file)}\n${fileErrors.map((e) => `  - ${e}`).join('\n')}`);
        }
      }
    }),
  );

  if (errors.length) {
    throw new Error(errors.join('\n'));
  }
}

async function lint() {
  await execa({ stdio: 'inherit' })`eslint ${[
    '--ext',
    '.ts',
    'packages',
  ]}`;
}
