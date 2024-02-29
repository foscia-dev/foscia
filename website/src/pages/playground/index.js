import Layout from '@theme/Layout';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import styles from './styles.module.css';

export default function Playground() {
  const makeTabItem = ({ id, name, help, stackblitzId, stackblitzOptions }) => ({
    id,
    name,
    help,
    stackblitzURL: `https://stackblitz.com/edit/${stackblitzId}?${new URLSearchParams({
      file: stackblitzOptions.files.join(','),
      embed: '1',
      devToolsHeight: '50',
      hideNavigation: '1',
      terminalHeight: '0',
    })}`,
  });

  const editorTabs = [
    makeTabItem({
      id: 'ts-rest',
      name: 'TS + REST',
      stackblitzId: 'foscia-ts-rest',
      stackblitzOptions: {
        files: ['action.ts', 'models/post.ts', 'playground.ts'],
      },
    }),
    /*
     * FIXME Not working for now due to Stackblitz.
    makeTabItem({
      id: 'js-rest',
      name: 'JS + REST',
      stackblitzId: 'foscia-js-rest',
      stackblitzOptions: {
        files: ['action.js', 'models/post.js', 'playground.js'],
      },
    }),
     */
  ];

  return (
    <Layout
      title="Playground"
      description="Try Foscia capabilities in a Stackblitz playground!"
    >
      <main>
        <div className={styles.playgroundContainer}>
          <Tabs groupId="stackblitzPlayground">
            {editorTabs.map((tab) => (
              <TabItem
                key={tab.id}
                value={tab.id}
                label={tab.name}
                className={styles.playgroundTab}
              >
                <iframe
                  src={tab.stackblitzURL}
                  className={styles.playgroundIframe}
                  loading="lazy"
                  width="900"
                  height="600"
                ></iframe>
              </TabItem>
            ))}
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}
