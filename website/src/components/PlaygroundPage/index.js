import PlaygroundIframe from '@site/src/components/PlaygroundIframe';
import Layout from '@theme/Layout';
import styles from './styles.module.css';

export default function PlaygroundPage({ name, stackblitzId, stackblitzOptions }) {
  return (
    <Layout
      title={`${name} playground`}
      description={`Try Foscia capabilities with ${name} in a Stackblitz playground!`}
    >
      <main>
        <div className={styles.playgroundContainer}>
          <PlaygroundIframe
            id={stackblitzId}
            title={`${name} playground`}
            options={stackblitzOptions}
          />
        </div>
      </main>
    </Layout>
  );
}
