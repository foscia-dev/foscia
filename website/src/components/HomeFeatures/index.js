import HomeCard from '@site/src/components/HomeCard';
import ShellCommand from '@site/src/components/ShellCommand';
import TypeSafeSvg from '@site/src/icons/alert-decagram-outline.svg';
import ConsoleSvg from '@site/src/icons/console.svg';
import CacheSvg from '@site/src/icons/database-outline.svg';
import ChangesTrackingSvg from '@site/src/icons/history.svg';
import HooksSvg from '@site/src/icons/magnify-scan.svg';
import LightweightSvg from '@site/src/icons/package-variant-closed.svg';
import ImplementationsSvg from '@site/src/icons/swap-horizontal.svg';
import ModularSvg from '@site/src/icons/toy-brick-outline.svg';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './style.module.css';

function HomeActionsPresentation() {
  const title = <>
    Searching an <span className={clsx('text--primary')}>ORM alike tool</span>
    <br />
    for your <span className={clsx('text--primary')}>APIs interactions?</span>
  </>;

  const description = <>
    <strong>Foscia is like an ORM, but for APIs consumption.</strong> You can
    easily get started and interact with your standardized APIs without thinking
    about serialization and error handling complexity.
  </>;

  const example = `
const posts = await action()
  .use(query(Post), include('author'))
  .run(all());

const post = fill(new Post(), {
  title: 'Hello World!',
});

await action()
  .use(create(post))
  .run(one());
  `.trim();

  return <HomeCard
    title={title}
    description={description}
    action={{ to: '/docs/core-concepts/actions', label: 'Discovers actions' }}
    illustration={<CodeBlock language="ts">{example}</CodeBlock>}
    reverse
  />;
}

function HomeModelsPresentation() {
  const title = <>
    <span className={clsx('text--primary')}>Readable</span> data models
    <br />
    <span className={clsx('text--primary')}>Type safety</span> with TypeScript
  </>;

  const description = <>
    <strong>Foscia provides an elegant way to define your data models.</strong> It
    gives your data structure readability and type safety across
    all your data interactions, even accros nested relations.
  </>;

  const example = `
export default class Post
  extends makeModel('posts', {
    publishable,
    title: attr<string>(),
    body: attr<string>(),
    author: hasOne(() => User),
    tags: hasMany(() => Tag),
  }) {
}
  `.trim();

  return <HomeCard
    title={title}
    description={description}
    action={{ to: '/docs/core-concepts/models', label: 'Discovers models' }}
    illustration={<CodeBlock language="ts">{example}</CodeBlock>}
  />;
}

function HomeFeaturesPresentation() {
  const features = [
    {
      Icon: ImplementationsSvg,
      title: 'HTTP·REST·JSON:API',
      description: (
        <>
          Exchange with any HTTP, REST or JSON:API backend.
        </>
      ),
    },
    {
      Icon: ModularSvg,
      title: 'Modular',
      description: (
        <>
          Simple configuration and framework-agnostic.
        </>
      ),
    },
    {
      Icon: LightweightSvg,
      title: 'Lightweight',
      description: (
        <>
          Fully tree-shakable for optimal build size.
        </>
      ),
    },
    {
      Icon: TypeSafeSvg,
      title: 'Type safe',
      description: (
        <>
          Strong type your data structure with TS.
        </>
      ),
    },
    {
      Icon: ChangesTrackingSvg,
      title: 'Changes tracking',
      description: (
        <>
          Record changes on data during lifecycle.
        </>
      ),
    },
    {
      Icon: HooksSvg,
      title: 'Hooks',
      description: (
        <>
          Register hooks, such as saving or deleting.
        </>
      ),
    },
    {
      Icon: CacheSvg,
      title: 'Cache',
      description: (
        <>
          Never re-fetch data thanks to the cache system.
        </>
      ),
    },
    {
      Icon: ConsoleSvg,
      title: 'CLI',
      description: (
        <>
          Get started quickly with the built-in CLI.
        </>
      ),
    },
  ];

  return <>
    <h2 className={clsx('text--center')}>
      <span className={clsx('text--primary')}>Modular</span>, <span className={clsx('text--primary')}>lightweight</span>,
      and more...
    </h2>
    <div className={clsx('row')}>
      {features.map(({ Icon, title, description }, idx) => (
        <div
          key={idx}
          className={clsx(styles.homeFeatureCol, 'col col--3')}
        >
          <div className={clsx(styles.homeFeatureCard, 'text--center')}>
            <div className={clsx(styles.homeFeatureCardSvgWrapper, 'border--primary border--large margin-bottom--md')}>
              <Icon className={styles.homeFeatureCardSvg} />
            </div>
            <h3 className={styles.homeFeatureCardTitle}>{title}</h3>
            <p className={styles.homeFeatureCardDescription}>{description}</p>
          </div>
        </div>
      ))}
    </div>
  </>;
}

function HomeGetStarted() {
  const title = <>
    Get started <span className={clsx('text--primary')}>now</span>
    <br />
    Install <span className={clsx('text--primary')}>Foscia CLI</span>
  </>;

  const description = <>
    <strong>Foscia CLI allow you to quickly setup Foscia on your project.</strong> It
    will automatically detect your environment and install required Foscia packages.
    Once installed, just run <code>init</code> command with your destination directory.
  </>;

  return <HomeCard
    title={title}
    description={description}
    action={{ to: '/docs/getting-started', label: 'Get started' }}
    illustration={<div className={styles.homeFeatureGettingStartedCommands}>
      <ShellCommand command="add dev @foscia/cli" />
      <ShellCommand command="foscia init" />
    </div>}
    reverse
  />;
}

export default function HomeFeatures() {
  return (
    <div className={clsx('container')}>
      <section className={clsx(styles.homeFeatureSection)}>
        <HomeActionsPresentation />
      </section>
      <section className={clsx(styles.homeFeatureSection)}>
        <HomeModelsPresentation />
      </section>
      <section className={clsx(styles.homeFeatureSection)}>
        <HomeFeaturesPresentation />
      </section>
      <section className={clsx(styles.homeFeatureSection)}>
        <HomeGetStarted />
      </section>
    </div>
  );
}
