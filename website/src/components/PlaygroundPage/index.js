import PlaygroundIframe from '@site/src/components/PlaygroundIframe';
import Layout from '@theme/Layout';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export default function PlaygroundPage({ name, stackblitzId, stackblitzOptions }) {
  const [playgroundHeight, setPlaygroundHeight] = useState(undefined);

  useEffect(() => {
    const announcementEl = document.querySelector('[class^=announcementBar]');
    const navEl = document.querySelector('nav.navbar');
    if (announcementEl && navEl) {
      const totalHeight = announcementEl.clientHeight + navEl.clientHeight;

      setPlaygroundHeight(`calc(100vh - ${totalHeight}px)`);
    }
  }, []);

  return (
    <Layout
      title={`${name} playground`}
      description={`Try Foscia capabilities with ${name} in a Stackblitz playground!`}
    >
      <main>
        <div
          className={styles.playgroundContainer}
          style={{ '--playground-height': playgroundHeight }}
        >
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
