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
                    to={`/playground/${playground.id}`}
                    className={clsx(styles.playgroundCard)}
                  >
                    <Icon className={clsx(styles.playgroundIcon)} />
                    <h2>{playground.name}</h2>
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
