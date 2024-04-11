import PlaygroundIframe from '@site/src/components/PlaygroundIframe';
import Layout from '@theme/Layout';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import styles from './styles.module.css';

export default function Playground() {
  const editorTabs = [
    {
      id: 'ts-rest',
      name: 'TS + REST',
      stackblitzId: 'foscia-ts-rest',
      stackblitzOptions: {
        file: 'src/playground.ts',
        terminalHeight: '40',
      },
    },
    {
      id: 'vue-ts-rest',
      name: 'Vue + TS + REST',
      stackblitzId: 'foscia-vue-ts-rest',
      stackblitzOptions: {
        file: 'src/components/Playground.vue',
        terminalHeight: '0',
      },
    },
    {
      id: 'react-ts-rest',
      name: 'React + TS + REST',
      stackblitzId: 'foscia-react-ts-rest',
      stackblitzOptions: {
        file: 'src/components/Playground.tsx',
        terminalHeight: '0',
      },
    },
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
                <PlaygroundIframe
                  id={tab.stackblitzId}
                  title={tab.name}
                  options={tab.stackblitzOptions}
                />
              </TabItem>
            ))}
          </Tabs>
        </div>
      </main>
    </Layout>
  );
}
