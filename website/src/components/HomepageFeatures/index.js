import clsx from 'clsx';
import React from 'react';
import TypeSafeSvg from '../../icons/alert-decagram-outline.svg';
import ConsoleSvg from '../../icons/console.svg';
import CacheSvg from '../../icons/database-outline.svg';
import ChangesTrackingSvg from '../../icons/history.svg';
import HooksSvg from '../../icons/magnify-scan.svg';
import LightweightSvg from '../../icons/package-variant-closed.svg';
import ImplementationsSvg from '../../icons/swap-horizontal.svg';
import ModularSvg from '../../icons/toy-brick-outline.svg';
import styles from './styles.module.css';

const FeatureList = [
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

function Feature({ Icon, title, description }) {
  return (
    <div className={`${styles.featureCol} ${clsx('col col--3')}`}>
      <div className={`${styles.feature} text--center`}>
        <div className={`${styles.featureSvgWrapper} border--primary border--large margin-bottom--md`}>
          <Icon className={styles.featureSvg} />
        </div>
        <h3 className={styles.featureTitle}>{title}</h3>
        <p className={styles.featureText}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section>
      <div className={`${styles.presentationContainer} container text--center`}>
        <h2 className="title-primary">
          <span className="title-primary__text">
            What's Foscia?
          </span>
        </h2>
        <p className="text--large">
          <strong>Foscia acts as an intermediary layer</strong> between
          your application and your data source (API, database).
        </p>
        <ul className="text--left">
          <li>
            It keeps your <strong>data structure clear and type
            safe</strong> with simple models definition and provide a lot of
            useful tools to make common tasks easier (changes tracking, hooks,
            serialization, etc.), allowing you to focus on your features!
          </li>
          <li>
            It is built with <strong>functional programming</strong> in mind,
            has a clear and complete API and is <strong>fully tree-shakable</strong>.
          </li>
          <li>
            It is <strong>framework agnostic</strong> and can integrate inside
            any app using JavaScript or TypeScript, and with any data source,
            with already implemented HTTP/REST/JSON:API exchanges.
          </li>
        </ul>
        <p className="text--large">
          <strong>
            Foscia provides all features you would expect from an ORM/data client.
          </strong>
        </p>
      </div>
      <div className="container text--center">
        <div className={`${styles.featuresRow} row`}>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
