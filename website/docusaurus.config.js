// @ts-check
import dotenv from 'dotenv';
import { createRequire } from 'node:module';
// Note: type annotations allow type checking and IDEs autocompletion
import path from 'node:path';
import { themes } from 'prism-react-renderer';
import packageJson from '../package.json';

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
  organizationName: 'foscia-dev',
  projectName: 'foscia',
  markdown: {
    format: 'detect',
  },
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
      out: 'docs/reference/api',
      entryPointStrategy: 'packages',
      entryPoints: packages
        .filter((pkg) => pkg.name !== 'cli')
        .map((pkg) => `../packages/${pkg.name}`),
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    }],
  ],
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        respectPrefersColorScheme: true,
      },
      algolia: {
        appId: '4ARIHUOKRG',
        apiKey: '216b2058f40470b073a59c2867d9d51a',
        indexName: 'fosciadev',
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      announcementBar: process.env.VERSION ? {
        // Dev/next version announcement.
        id: `${process.env.VERSION}-announcement`,
        content: '<strong>Warning</strong>: you are browsing an upcoming version of Foscia. <a target="_blank" rel="noopener noreferrer" href="https://foscia.dev">Get back to stable docs</a>',
        backgroundColor: 'var(--ifm-color-warning-contrast-background)',
        textColor: 'var(--ifm-color-warning-contrast-foreground)',
        isCloseable: false,
      } : {
        // Production announcement.
        id: '0.9.0-announcement',
        content: '<code>v0.9.0</code> released with new <code>@foscia/cli</code> features! <a target="_blank" rel="noopener noreferrer" href="https://github.com/foscia-dev/foscia/issues">Give your feedback</a>',
        backgroundColor: 'var(--ifm-background-surface-color)',
        textColor: 'inherit',
        isCloseable: false,
      },
      navbar: {
        logo: {
          src: 'img/logo.svg',
          srcDark: 'img/logo--dark.svg',
          alt: 'Foscia Home',
        },
        items: [
          {
            position: 'left',
            label: 'Installation',
            to: '/docs/installation',
          },
          {
            position: 'left',
            label: 'Docs',
            to: '/docs/getting-started',
          },
          {
            position: 'left',
            label: 'Playgrounds',
            to: '/playgrounds',
          },
          {
            position: 'left',
            label: 'Examples',
            to: '/docs/category/examples',
          },
          {
            position: 'left',
            label: 'API',
            to: '/docs/category/reference',
          },
          {
            position: 'right',
            label: process.env.VERSION
              ? `${process.env.VERSION} v${packageJson.version}`
              : `v${packageJson.version}`,
            to: '/docs/upgrade/changelog',
            className: 'header-version-link button',
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
                label: 'Examples',
                href: 'https://github.com/foscia-dev/foscia-examples',
              },
              {
                label: 'GitHub issues',
                href: 'https://github.com/foscia-dev/foscia/issues',
              },
              {
                label: 'GitHub discussions',
                href: 'https://github.com/foscia-dev/foscia/discussions',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                href: 'https://www.npmjs.com/search?q=%40foscia',
                label: 'NPM packages',
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
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
          {
            className: 'code-block-addition-line',
            line: 'highlight.addition',
          },
          {
            className: 'code-block-deletion-line',
            line: 'highlight.deletion',
          },
        ],
      },
    }),
};

export default config;
