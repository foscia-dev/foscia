import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import LogoIconSvg from '@site/static/img/icon.svg';
import clsx from 'clsx';
import styles from './style.module.css';

export default function HomeHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.heroLogoWrapper}>
          <div className={styles.heroLogoBg} />
          <LogoIconSvg className={styles.heroLogo} />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            {siteConfig.title}
          </h1>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button button--secondary button--lg margin--sm', styles.heroButton)}
              to="/docs/about"
            >
              What's Foscia?
            </Link>
            <Link
              className={clsx('button button--secondary button--lg margin--sm', styles.heroButton)}
              to="/docs/getting-started"
            >
              Getting started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
