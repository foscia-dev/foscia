import { execa } from 'execa';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { oraPromise } from 'ora';
import pc from 'picocolors';
import { listFiles, useRootDirname } from './utils.js';

(() => run())();

async function run() {
  try {
    await oraPromise(check, {
      text: 'Checking code...',
      successText: 'Checks OK.',
    });
    await oraPromise(lint, {
      text: 'Linting code...',
      successText: 'Code style OK.',
    });
  } catch {
    process.exit(1);
  }
}

async function lint() {
  await execa('eslint', [
    '--ext',
    ['.ts'],
    'packages',
  ], { stdio: 'inherit' });
}

async function check() {
  let containsErrors = false;

  // Check for external package use with relative path imports.
  const rootDirname = useRootDirname();
  await Promise.all(
    (await listFiles(path.resolve(rootDirname, 'packages'))).map(async (file) => {
      const [_, packageName, context] = file.match(/packages\/([a-z-]+)\/(src|tests)/) ?? [];
      if (packageName) {
        const errors = [];
        const fileContent = await readFile(file, { encoding: 'utf8' });
        const matches = fileContent.match(/from '@foscia\/[a-z-]+(\/index|.)/g) ?? [];
        matches.forEach((match) => {
          const importPackageName = match.substring(14, match.length).replace(/(\/index|.)$/, '');

          if (match.endsWith('/') && (context !== 'src' || packageName !== importPackageName)) {
            errors.push(
              `import of ${pc.red(`@foscia/${importPackageName}`)} must use root package export (instead of inner package export)`,
            );
          }

          if (context === 'src' && packageName === importPackageName && (!match.endsWith('/') || match.endsWith('/index'))) {
            errors.push(
              `import of ${pc.red(`@foscia/${packageName}`)} must use inner package export (instead of root package export)`,
            );
          }
        });

        if (errors.length) {
          containsErrors = true;
          console.error(`${pc.underline(file)}\n${errors.map((e) => `  - ${e}`).join('\n')}`);
        }
      }
    }),
  );

  if (containsErrors) {
    process.exit(1);
  }
}
