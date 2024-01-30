import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import '@fontsource/fira-mono';
import '@fontsource/poppins';
import HomepageExamples from '@site/src/components/HomepageExamples';
import HomepageWhyUse from '@site/src/components/HomepageWhyUse';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import React from 'react';
import LogoIconSvg from '../../static/img/icon.svg';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.hero__logo__wrapper}>
          <div className={styles.hero__logo__bg} />
          <LogoIconSvg className={styles.hero__logo} />
        </div>
        <div className={styles.hero__content}>
          <h1 className={clsx('hero__title', styles.hero__title)}>
            {siteConfig.title}
          </h1>
          <p className={clsx('hero__subtitle', styles.hero__subtitle)}>
            {siteConfig.tagline}
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--secondary button--lg margin--sm', styles.hero__button)}
              to="/docs/about"
            >
              About
            </Link>
            <Link
              className={clsx('button button--secondary button--lg margin--sm', styles.hero__button)}
              to="/docs/getting-started"
            >
              Getting started
            </Link>
            <Link
              className={clsx('button button--secondary button--lg margin--sm', styles.hero__button)}
              to="https://codesandbox.io/p/sandbox/boring-hoover-9n3ylg?file=%2Fsrc%2Fplayground.ts%3A11%2C42"
            >
              Playground
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description={siteConfig.tagline}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageWhyUse />
        <HomepageExamples />
      </main>
    </Layout>
  );
}
