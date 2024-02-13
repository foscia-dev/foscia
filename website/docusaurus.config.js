// @ts-check
import dotenv from 'dotenv';
import { createRequire } from 'node:module';
// Note: type annotations allow type checking and IDEs autocompletion
import path from 'node:path';
import { themes } from 'prism-react-renderer';

const require = createRequire(import.meta.url);

const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const packages = require('../scripts/entries.cjs')();

dotenv.config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  favicon: '/img/favicon.ico',
  title: 'Foscia',
  tagline: 'Type safe, modular and intuitive API/data client for JS/TS.',
  url: process.env.URL || 'https://foscia.dev',
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
      includeExtension: false,
      entryPointStrategy: 'packages',
      entryPoints: packages
        .filter((pkg) => pkg.name !== 'cli')
        .map((pkg) => `../packages/${pkg.name}`),
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
      sidebar: { fullNames: true, position: 1000, categoryLabel: 'API' },
    }],
  ],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        appId: '4ARIHUOKRG',
        apiKey: '6d3fe07374328ce4bff0593085a71797',
        indexName: 'fosciadev',
      },
      announcementBar: {
        id: '0.1.0-announcement',
        content: 'First stable version released! <a target="_blank" rel="noopener noreferrer" href="https://github.com/foscia-dev/foscia/issues">Give your feedback</a>',
        backgroundColor: 'var(--ifm-background-surface-color)',
        textColor: 'inherit',
        isCloseable: false,
      },
      navbar: {
        title: 'Foscia',
        logo: {
          src: 'img/icon.svg',
          srcDark: 'img/icon--dark.svg',
          alt: '',
        },
        items: [
          {
            type: 'dropdown',
            label: 'Documentation',
            position: 'left',
            items: [
              {
                to: '/docs/about',
                label: 'About',
              },
              {
                label: 'Installation',
                to: '/docs/installation',
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
                label: 'Digging deeper',
                to: '/docs/category/digging-deeper',
              },
              {
                label: 'Examples',
                to: '/docs/category/examples',
              },
              {
                label: 'Reference',
                to: '/docs/category/reference',
              },
            ],
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
                label: 'Digging deeper',
                to: '/docs/category/digging-deeper',
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
        additionalLanguages: ['bash', 'json', 'diff'],
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

export default config;
