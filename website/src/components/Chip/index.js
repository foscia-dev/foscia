import clsx from 'clsx';
import React from 'react';
import styles from './styles.module.css';

export default function Chip({ children, color }) {
  return (
    <span className={clsx(styles.chip, styles[`chip--${color}`])}>
      {children}
    </span>
  );
}
