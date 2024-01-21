import { execa } from 'execa';
import minimist from 'minimist';
import process from 'node:process';
import pc from 'picocolors';

(() => run(process.argv))();

async function run(argv) {
  try {
    const args = minimist(argv.slice(2));

    const options = parseOptions(args);

    await releasePackages(options);
    await releaseGithub(options);
  } catch {
    process.exit(1);
  }
}

function parseOptions(args) {
  const options = [
    args.dry ? '--dry-run' : '',
    args.interactive ? '' : '--ci',
  ].filter((o) => o);

  if (['patch', 'minor', 'major'].indexOf(args.increment) !== -1) {
    if (['alpha', 'beta'].indexOf(args.prerelease) !== -1) {
      return [
        `--preRelease=${args.prerelease}`,
        '--npm.tag=next',
        `--increment=${args.increment}`,
        ...options,
      ];
    }

    return [
      `--increment=${args.increment}`,
      ...options,
    ];
  }

  console.error(pc.red(
    `Given increment is invalid, valid targets are: patch, minor, major`,
  ));

  process.exit(1);
}

async function releasePackages(options) {
  await execa('pnpm', [
    '-r',
    '--workspace-concurrency=1',
    'release',
    ...options,
  ], { stdio: 'inherit' });
}

async function releaseGithub(options) {
  await execa('release-it', [
    ...options,
  ], { stdio: 'inherit' });
}
