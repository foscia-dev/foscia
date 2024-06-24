import Link from '@docusaurus/Link';
import playgrounds from '@site/src/utilities/playgrounds';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './styles.module.css';

export default function Playground() {
  return (
    <Layout
      title="Playground"
      description="Try Foscia capabilities in a Stackblitz playground!"
    >
      <main>
        <div className={clsx('container')}>
          <h1 className={clsx('text--center')}>
            Try Foscia in <span className={clsx('text--gradient')}>your browser</span>
          </h1>
          <p className={clsx('text--center')}>
            Choose the tool you want to try Foscia in to open a ready-to-run example in Stackblitz.
          </p>
          <div className={clsx('row')}>
            {Object.values(playgrounds).map((playground) => {
              const Icon = playground.icon;

              return (
                <div className={clsx(styles.playgroundCol, 'text--center col col--4')}>
                  <Link
                    to={`/playgrounds/${playground.id}`}
                    className={clsx(styles.playgroundCard, 'blur--gradient')}
                  >
                    <div className={clsx(styles.playgroundIconWrapper, 'theme--dark')}>
                      <Icon className={clsx(styles.playgroundIcon)} />
                    </div>
                    <div className={clsx(styles.playgroundTitle)}>{playground.name}</div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}
