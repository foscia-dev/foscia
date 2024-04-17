import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ArrowRightSvg from '@site/src/icons/arrow-right.svg';
import LogoIconSvg from '@site/static/img/icon.svg';
import clsx from 'clsx';
import styles from './style.module.css';

export default function HomeHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <LogoIconSvg className={styles.heroLogo} />
        <div>
          <h1 className={styles.heroTitle}>
            <span className="text--gradient">
              {siteConfig.title}
            </span>
          </h1>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
          </p>
          <div className={styles.heroButtons}>
            <Link
              className={clsx('button border--gradient button--lg margin--sm', styles.heroButton)}
              to="/docs/about"
            >
              What's Foscia?
            </Link>
            <Link
              className={clsx('button border--gradient button--lg margin--sm', styles.heroButton)}
              to="/docs/getting-started"
            >
              Getting started
              <ArrowRightSvg className={styles.heroButtonArrow} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
