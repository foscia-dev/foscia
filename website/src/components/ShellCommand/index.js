import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';

export default function ShellCommand({ command, join, ...props }) {
  const commands = Array.isArray(command) ? command : [command];
  const code = (runPrefix, installPrefix, upgradePrefix, devSuffix) => commands.map((c) => (
    c.startsWith('#') ? c : [
      c.startsWith('add')
        ? installPrefix
        : c.startsWith('upgrade') ? upgradePrefix : runPrefix,
      c.startsWith('add dev') ? devSuffix : '',
      c.replace(/^(add|upgrade)( dev)?/, ''),
    ].join(' ').replace(/\s+/g, ' ')
  )).join(join ? ' && ' : '\n');

  return (
    <Tabs groupId="packageManager" {...props}>
      <TabItem
        value="npm"
        label="NPM"
        default
      >
        <CodeBlock language="shell">
          {code('npx', 'npm install', 'npm update', '-D')}
        </CodeBlock>
      </TabItem>
      <TabItem
        value="yarn"
        label="YARN"
      >
        <CodeBlock language="shell">
          {code('yarn', 'yarn add', 'yarn upgrade', '-D')}
        </CodeBlock>
      </TabItem>
      <TabItem
        value="pnpm"
        label="PNPM"
      >
        <CodeBlock language="shell">
          {code('pnpm', 'pnpm add', 'pnpm upgrade', '-D')}
        </CodeBlock>
      </TabItem>
      <TabItem
        value="bun"
        label="Bun"
      >
        <CodeBlock language="shell">
          {code('bun', 'bun add', 'bun update', '-D')}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}
