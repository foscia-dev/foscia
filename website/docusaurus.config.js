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
        apiKey: '216b2058f40470b073a59c2867d9d51a',
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
            position: 'left',
            label: 'Installation',
            to: '/docs/installation',
          },
          {
            position: 'left',
            label: 'Getting started',
            to: '/docs/getting-started',
          },
          {
            position: 'left',
            label: 'API',
            to: '/docs/category/reference',
          },
          {
            position: 'right',
            label: 'Documentation',
            to: '/docs/category/core-concepts',
            className: 'button border--primary',
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
            title: 'Documentation',
            items: [
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
            ],
          },
          {
            title: 'Getting help',
            items: [
              {
                label: 'FAQ',
                to: '/docs/help/faq',
              },
              {
                label: 'GitHub issues',
                href: 'https://github.com/foscia-dev/foscia/issues',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                href: 'https://www.npmjs.com/package/foscia',
                label: 'NPM',
              },
              {
                label: 'GitHub repository',
                href: 'https://github.com/foscia-dev/foscia',
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
