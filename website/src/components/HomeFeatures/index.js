import Link from '@docusaurus/Link';
import HomeCard from '@site/src/components/HomeCard';
import ShellCommand from '@site/src/components/ShellCommand';
import TypeSafeSvg from '@site/src/icons/alert-decagram-outline.svg';
import ConsoleSvg from '@site/src/icons/console.svg';
import CacheSvg from '@site/src/icons/database-outline.svg';
import ChangesTrackingSvg from '@site/src/icons/history.svg';
import HooksSvg from '@site/src/icons/hook.svg';
import LightweightSvg from '@site/src/icons/package-variant-closed.svg';
import ImplementationsSvg from '@site/src/icons/swap-horizontal.svg';
import ModularSvg from '@site/src/icons/toy-brick-outline.svg';
import LogoExamples from '@site/static/img/logo-examples.svg';
import LogoPlayground from '@site/static/img/logo-playground.svg';
import CodeBlock from '@theme/CodeBlock';
import clsx from 'clsx';
import styles from './styles.module.css';

function HomeActionsPresentation() {
  const title = <>
    Searching an <span className={clsx('text--gradient')}>ORM alike tool</span>
    <br />
    for your <span className={clsx('text--gradient')}>APIs interactions?</span>
  </>;

  const description = <>
    <strong>Foscia is like an ORM, but for APIs consumption.</strong> You can
    easily get started and interact with your standardized APIs without thinking
    about serialization and error handling complexity.
  </>;

  const example = `
const posts = await action(
  query(Post),
  include('author'),
  all(),
);

const post = fill(new Post(), {
  title: 'Hello World!',
});

await action(create(post), one());
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
    <span className={clsx('text--gradient')}>Readable</span> data models
    <br />
    <span className={clsx('text--gradient')}>Type safety</span> with TypeScript
  </>;

  const description = <>
    <strong>Foscia provides an elegant way to define your data models.</strong> It
    gives your data structure readability and type safety across
    all your data interactions, even across nested relations.
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
          Simple but complete config, framework-agnostic.
        </>
      ),
    },
    {
      Icon: LightweightSvg,
      title: 'Lightweight',
      description: (
        <>
          Zero-dependencies and tree-shakable for optimal build size.
        </>
      ),
    },
    {
      Icon: TypeSafeSvg,
      title: 'Type safe',
      description: (
        <>
          Across all your data interactions, thanks to TS.
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
      <span className={clsx('text--gradient')}>Modular, lightweight</span>,
      and more...
    </h2>
    <div className={clsx('row')}>
      {features.map(({ Icon, title, description }, idx) => (
        <div
          key={idx}
          className={clsx(styles.homeFeatureCol, 'col col--3')}
        >
          <div className={clsx(styles.homeFeatureCard, 'text--center')}>
            <div className={clsx(styles.homeFeatureCardSvgWrapper, 'border--gradient border--large margin-bottom--md')}>
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
    Get started now,&nbsp;
    <span className={clsx('text--gradient')}>
      install the CLI
    </span>
  </>;

  const description = <>
    <Link to="/docs/digging-deeper/usages/cli">
      <code>
        @foscia/cli
      </code>
    </Link>
    <strong>&nbsp;provide quick setup and management of Foscia in your project.</strong>
    &nbsp;It detects your environment, installs Foscia packages and provides files
    generation commands.
  </>;

  return <HomeCard
    title={title}
    description={description}
    illustration={<div>
      <ShellCommand
        command={['add dev @foscia/cli', 'foscia init']}
        join
      />
    </div>}
    reverse
  />;
}

function HomeExamples() {
  return <>
    <h2 className={clsx('text--center')}>
      Discover through <span className={clsx('text--gradient')}>examples</span>
    </h2>
    <div className={clsx(styles.homeExamplesRow, 'row')}>
      <div className={clsx(styles.homeExamplesCol, 'col col--5')}>
        <Link
          to="/playgrounds"
          className={clsx(styles.homeExamplesLink, 'blur--gradient')}
        >
          <div className={clsx(styles.homeExamplesCard, 'text--center')}>
            <LogoPlayground className={styles.homeExamplesIcon} />
            <p className={styles.homeExamplesText}>
              Discover Foscia in your browser thanks to multiple StackBlitz playgrounds.
            </p>
          </div>
        </Link>
      </div>
      <div className={clsx(styles.homeExamplesCol, 'col col--5')}>
        <a
          href="https://github.com/foscia-dev/foscia-examples"
          target="_blank"
          rel="noopener"
          className={clsx(styles.homeExamplesLink, 'blur--gradient')}
        >
          <div className={clsx(styles.homeExamplesCard, 'text--center')}>
            <LogoExamples className={styles.homeExamplesIcon} />
            <p className={styles.homeExamplesText}>
              Discover Foscia using Docker through a set of ready-to-run projects.
            </p>
          </div>
        </a>
      </div>
    </div>
  </>;
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
      <section className={clsx(styles.homeFeatureSection)}>
        <HomeExamples />
      </section>
    </div>
  );
}
