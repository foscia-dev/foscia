import clsx from 'clsx';
import React from 'react';

export default function Chip({ children, color }) {
  return (
    <span className={clsx('chip', color ? `chip--${color}` : undefined)}>
      {children}
    </span>
  );
}
