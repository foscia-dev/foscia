// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const path = require('node:path');
const { transpileCodeblocks } = require('remark-typescript-tools');
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const packages = require('../scripts/entries.cjs')();

require('dotenv').config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  favicon: '/img/favicon.ico',
  title: 'Foscia',
  tagline: 'Type safe, modular and intuitive API/data client.',
  url: process.env.URL || 'https://foscia.netlify.app',
  baseUrl: process.env.BASE_URL || '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  organizationName: 'paul-thebaud',
  projectName: 'foscia',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/foscia-dev/foscia/tree/main/website/',
          showLastUpdateTime: true,
          remarkPlugins: [[transpileCodeblocks, {
            compilerSettings: {
              tsconfig: path.resolve(__dirname, '../tsconfig.json'),
              externalResolutions: packages.reduce((resolutions, pkg) => ({
                ...resolutions,
                [pkg.path]: {
                  resolvedPath: path.resolve(__dirname, `../packages/${pkg.name}/dist`),
                  packageId: {
                    name: pkg.path,
                    subModuleName: 'index.d.ts',
                    version: '1.0',
                  },
                },
              }), {}),
            },
          }]],
          exclude: ['reference/api/index.md'],
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    ['docusaurus-plugin-typedoc', {
      id: 'api',
      name: 'API reference',
      readme: 'none',
      out: 'reference/api',
      entryPointStrategy: 'packages',
      entryPoints: packages.map((pkg) => `../packages/${pkg.name}`),
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
      sidebar: { fullNames: true, position: 5, categoryLabel: 'API' },
    }],
  ],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: 'AK1H2HG8VZ',
        apiKey: '5b22541919060b702fe9c7bb5711807c',
        indexName: 'foscia',
      },
      announcementBar: {
        id: 'alpha_stage',
        content: 'Foscia is currently in alpha stage, <a target="_blank" rel="noopener noreferrer" href="https://github.com/foscia-dev/foscia/issues">please fill an issue</a> to give your feedback.',
        backgroundColor: 'var(--ifm-background-surface-color)',
        textColor: 'inherit',
        isCloseable: false,
      },
      navbar: {
        title: 'Foscia',
        logo: {
          src: 'img/icon.svg',
          alt: '',
        },
        items: [
          {
            to: '/docs/about',
            label: 'About',
            position: 'right',
          },
          {
            to: '/docs/getting-started',
            label: 'Documentation',
            position: 'right',
          },
          {
            href: 'https://stackblitz.com/edit/foscia?file=playground.ts',
            label: 'Playground',
            position: 'right',
          },
          {
            href: 'https://github.com/foscia-dev/foscia',
            title: 'GitHub repository (open in new tab)',
            position: 'right',
            className: 'header-github-link',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'About',
                to: '/docs/about',
              },
              {
                label: 'Getting started',
                to: '/docs/getting-started',
              },
              {
                label: 'Core concepts',
                to: '/docs/category/core-concepts',
              },
              {
                label: 'Guides',
                to: '/docs/category/guides',
              },
              {
                label: 'Reference',
                to: '/docs/category/reference',
              },
              {
                label: 'Help',
                to: '/docs/category/help',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Playground',
                href: 'https://stackblitz.com/edit/foscia?file=playground.ts',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/foscia-dev/foscia',
              },
              {
                href: 'https://www.npmjs.com/package/foscia',
                label: 'NPM',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
