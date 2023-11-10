import { execa } from 'execa';
import minimist from 'minimist';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { oraPromise } from 'ora';
import pc from 'picocolors';
import { rimraf } from 'rimraf';
import { useRootDirname } from './utils.js';

const require = createRequire(import.meta.url);

(() => run(process.argv))();

async function run(argv) {
  try {
    const packagesNames = require('./entries.cjs')().map((p) => p.name);

    const args = minimist(argv.slice(2));
    const options = {
      sourceMap: args.sourcemap || args.s,
    };

    const targets = await oraPromise(async (loader) => {
      const targets = args._.length ? args._ : packagesNames;
      if (targets.some((t) => packagesNames.indexOf(t) === -1)) {
        loader.stop();

        console.error(pc.red(
          `Given targets are invalid, valid targets are: ${packagesNames.join(', ')}`,
        ));

        process.exit(1);
      }

      return targets;
    }, {
      text: 'Resolving targets...',
      successText: 'Resolved targets.',
    });

    await oraPromise(async () => {
      await clearDts();
      await clearBuild(targets);
    }, {
      text: 'Clearing dist...',
      successText: 'Cleared dist.',
    });

    await oraPromise(buildDts, {
      text: 'Building DTS...',
      successText: 'Built DTS.',
    });

    await oraPromise(async () => {
      await Promise.all(targets.map((target) => buildTarget(target, options)));
    }, {
      isEnabled: !args.verbose,
      text: `Building: ${targets.join(', ')}...`,
      successText: 'Built.',
    });

    await oraPromise(async () => {
      await Promise.all(targets.map((target) => moveTargetDts(target)));
      await clearDts();
    }, {
      text: 'Moving DTS to packages...',
      successText: 'Moved DTS.',
    });
  } catch {
    process.exit(1);
  }
}

async function clearDts() {
  await rimraf(['dist']);
}

async function clearBuild(targets) {
  await Promise.all(targets.map((target) => rimraf([`packages/${target}/dist`])));
}

async function buildDts() {
  await execa('tsc', [
    '--project',
    ['tsconfig.dts.json'],
  ], { stdio: 'inherit' });

  await execa('tsc-alias', [
    '--project',
    ['tsconfig.dts.json'],
  ], { stdio: 'inherit' });
}

async function buildTarget(target, options) {
  await execa('rollup', [
    '-c',
    '--silent',
    '--environment',
    [
      `TARGET:${target}`,
      options.sourceMap ? 'SOURCE_MAP:true' : '',
    ],
  ], { stdio: 'inherit' });
}

async function moveTargetDts(target) {
  const rootDirname = useRootDirname();

  await execa('cp', [
    '-r',
    path.resolve(rootDirname, `dist/packages/${target}/src/*`),
    path.resolve(rootDirname, `packages/${target}/dist`),
  ], { shell: true, stdio: 'inherit' });
}
