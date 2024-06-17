import Link from '@docusaurus/Link';
import ArrowRightSvg from '@site/src/icons/arrow-right.svg';
import clsx from 'clsx';
import styles from './styles.module.css';

function HomeCardContent({ title, description, action }) {
  return (
    <div className={clsx('col col--6', styles.homeCardTextCol)}>
      <div className={clsx(styles.homeCardText)}>
        <h2>
          {title}
        </h2>
        <p>
          {description}
        </p>
        {action && <div>
          <Link
            className={clsx(`button border--gradient`, styles.homeCardTextAction)}
            to={action.to}
          >
            {action.label}
            <ArrowRightSvg className={styles.homeCardTextActionIcon} />
          </Link>
        </div>}
      </div>
    </div>
  );
}

function HomeCardIllustration({ illustration }) {
  return (
    <div className={clsx('col col--6', styles.homeCardCol)}>
      <div
        className={clsx(styles.homeCard)}
      >
        {illustration}
      </div>
    </div>
  );
}

export default function HomeCard({ title, description, action, illustration, reverse }) {
  return (
    <div className={clsx('row', styles.homeCardWrapper, reverse && styles.homeCardWrapperReverse)}>
      <HomeCardContent
        title={title}
        description={description}
        action={action}
      />
      <HomeCardIllustration
        illustration={illustration}
      />
    </div>
  );
}
