import React from 'react';
import Chip from '@site/src/components/Chip';

export default function FunctionInfo({ children, version, only, requires, provides, deprecated }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {deprecated && <Chip>deprecated: use <code>{deprecated}</code> instead</Chip>}
      {version && <Chip>version: v{version}+</Chip>}
      {only && <Chip color="primary">only: {only}</Chip>}
      {requires && <Chip color="danger">requires: {requires}</Chip>}
      {provides && <Chip color="success">provides: {provides}</Chip>}
      {children}
    </div>
  );
}
