import c from 'ansi-colors';
import { execa } from 'execa';
import minimist from 'minimist';
import { stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import process from 'node:process';
import { oraPromise } from 'ora';
import { rimraf } from 'rimraf';
import { useRootDirname } from './utils.js';

const require = createRequire(import.meta.url);
const rootDirname = useRootDirname();

(() => run(process.argv))();

async function run(argv) {
  try {
    const packagesNames = require('./entries.cjs')().map((p) => p.name);

    const args = minimist(argv.slice(2));
    const options = {
      stat: args.stat || false,
      minify: args.minify || false,
      sourceMap: args.sourcemap || false,
      noDts: args.nodts || false,
    };

    const targets = await oraPromise(async (loader) => {
      const targets = args._.length ? args._ : packagesNames;
      if (targets.some((t) => packagesNames.indexOf(t) === -1)) {
        loader.stop();

        console.error(c.red(
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

    if (!options.noDts) {
      await oraPromise(buildDts, {
        text: 'Building DTS...',
        successText: 'Built DTS.',
      });
    }

    await oraPromise(async () => {
      await Promise.all(targets.map((target) => buildTarget(target, options)));
    }, {
      isEnabled: !args.verbose,
      text: `Building: ${targets.join(', ')}...`,
      successText: 'Built.',
    });

    if (!options.noDts) {
      await oraPromise(async () => {
        await Promise.all(targets.map((target) => moveTargetDts(target)));
        await clearDts();
      }, {
        text: 'Moving DTS to packages...',
        successText: 'Moved DTS.',
      });
    }

    if (options.stat) {
      targets.reduce((promise, target) => promise.then(async () => {
        console.log(`${c.green('✔')} Size ${c.bold(target)}`);
        await logBuildSize(target, 'cjs');
        await logBuildSize(target, 'mjs');
      }), Promise.resolve());
    }
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
  await execa({ stdio: 'inherit' })`tsc ${[
    '--project',
    'tsconfig.dts.json',
  ]}`;
  await execa({ stdio: 'inherit' })`tsc-alias ${[
    '--project',
    'tsconfig.dts.json',
  ]}`;
}

async function buildTarget(target, options) {
  await execa({ stdio: 'inherit' })`rollup ${[
    '-c',
    '--silent',
    '--environment',
    `TARGET:${target},${options.sourceMap ? 'SOURCE_MAP:true' : ''},${options.minify ? 'MINIFY:true' : ''}`,
  ]}`;
}

async function moveTargetDts(target) {
  await execa({ shell: true, stdio: 'inherit' })`cp ${[
    '-r',
    path.resolve(rootDirname, `dist/packages/${target}/src/*`),
    path.resolve(rootDirname, `packages/${target}/dist`),
  ]}`;
}

async function logBuildSize(target, format) {
  const filePath = path.resolve(rootDirname, `packages/${target}/dist/index.${format}`);
  try {
    const { size } = await stat(filePath);
    console.log(`  ${format}: ${c.yellow(`${(size / 1024).toFixed(2)} KB`)}`);
  } catch {
    // Ignore error, format not built.
  }
}
