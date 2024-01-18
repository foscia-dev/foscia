import clsx from 'clsx';
import React from 'react';
import TypeSafeSvg from '../../icons/alert-decagram-outline.svg';
import DepsSvg from '../../icons/swap-horizontal.svg';
import ModularSvg from '../../icons/toy-brick-outline.svg';
import styles from './styles.module.css';

const FeatureList = [
  {
    Icon: DepsSvg,
    title: 'REST/JSON:API ready',
    description: (
      <>
        REST or JSON:API backend are already covered and you may
        add your own implementations for any other data sources.
      </>
    ),
  },
  {
    Icon: ModularSvg,
    title: 'Modular',
    description: (
      <>
        Foscia is composed of many independent functions, fully
        tree-shakable and lightweight.
      </>
    ),
  },
  {
    Icon: TypeSafeSvg,
    title: 'Type safe',
    description: (
      <>
        The API provides you a safe typing experience, even with edge cases
        such as dot relations used for eager loading.
      </>
    ),
  },
];

function Feature({ Icon, title, description }) {
  return (
    <div className={`${clsx('col col--4')} padding--md`}>
      <div className={`${styles.feature} text--center padding--md`}>
        <div className={`${styles.featureSvgWrapper} border--primary border--large margin-bottom--md`}>
          <Icon className={styles.featureSvg} />
        </div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={`${styles.features} padding--md`}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
