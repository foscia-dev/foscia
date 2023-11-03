import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';

export default function ShellCommand({ command }) {
  const commands = Array.isArray(command) ? command : [command];
  const code = (runPrefix, installPrefix, devSuffix) => commands.map((c) => (
    c.startsWith('#') ? c : [
      c.startsWith('add') ? installPrefix : runPrefix,
      c.startsWith('add dev') ? devSuffix : '',
      c.replace(/^add( dev)?/, ''),
    ].join(' ').replace(/\s+/g, ' ')
  )).join('\n');

  return (
    <Tabs groupId="packageManager">
      <TabItem
        value="npm"
        label="NPM"
        default
      >
        <CodeBlock language="shell">
          {code('npx', 'npm install', '--save-dev')}
        </CodeBlock>
      </TabItem>
      <TabItem
        value="yarn"
        label="YARN"
      >
        <CodeBlock language="shell">
          {code('yarn', 'yarn add', '-D')}
        </CodeBlock>
      </TabItem>
      <TabItem
        value="pnpm"
        label="PNPM"
      >
        <CodeBlock language="shell">
          {code('pnpm', 'pnpm add', '-D')}
        </CodeBlock>
      </TabItem>
      <TabItem
        value="bun"
        label="Bun"
      >
        <CodeBlock language="shell">
          {code('bun', 'bun add', '-D')}
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}
