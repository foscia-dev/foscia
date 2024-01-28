const fs = require('node:fs');
const path = require('node:path');

const headerPartial = fs.readFileSync(
  path.resolve(__dirname, 'scripts/changelog/header.hbs'),
).toString();

module.exports = {
  hooks: {
    'after:bump': 'pnpm install --no-frozen-lockfile',
    'after:release': 'echo Successfully released ${name} v${version} to ${repo.repository}.',
  },
  npm: {
    publish: false,
  },
  git: {
    requireBranch: 'main',
    commitMessage: 'chore: release v${version}',
    tagName: 'v${version}',
    tagAnnotation: 'Release v${version}',
    requireCleanWorkingDir: false,
  },
  github: {
    release: true,
    releaseName: 'v${version}',
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md',
      header: '# Changelog',
      writerOpts: {
        headerPartial,
      },
    },
  },
};
