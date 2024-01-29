import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import styles from './styles.module.css';

const classicExample = `
// This is how you would retrieve posts, show title and author name
// within a zero-dependency project interacting with a JSON:API.
const response = await fetch(
  'https://example.com/api/v1/posts?include=author&page[size]=10&page[number]=1
);

const data = await response.json();

data.data.forEach((post) => {
  const author = data.included.find(({ id }) => post.relationships.author.data.id === id);
  
  console.log(\`\${post.attributes.title} written by \${author.attributes.name}\`);
});
`.trim();

const fosciaExample = `
// This is how you would do the same thing using Foscia.
// Benefits: readability, type safety, shorter code.
const posts = await action()
  .use(
    forModel(Post),
    include('author'),
    paginate({ size: 10, number: 1 }),
  )
  .run(all());

posts.forEach((post) => {
  console.log(\`\${post.title} written by \${post.author.name}\`);
});
`.trim();

export default function HomepageWhyUse() {
  return (
    <section>
      <div className={`${styles.examplesContainer} container text--center`}>
        <h2 className="title-primary">
          <span className="title-primary__text">
            Why using Foscia?
          </span>
        </h2>
        <p className="text--center text--large">
          <strong>
            There are many reasons choosing Foscia.
          </strong>
        </p>
        <ul className="text--left">
          <li>
            You have a <strong>standardized API</strong> (REST, JSON:API)
            you want to interact with, <strong>without taking care of various
            normalized processes</strong>, such as serialization or
            HTTP errors handling.
          </li>
          <li>
            You are searching a <strong>simple and lightweight HTTP
            client</strong> to interact with any HTTP server.
          </li>
          <li>
            You want your <strong>data structure and interactions to be clear, concise
            and type safe</strong>.
          </li>
          <li>
            You want a tool where can <strong>only import what you
            need</strong>, without having tons of useless third-party
            code inside your production build.
          </li>
        </ul>
        <p className="text--center text--large">
          <strong>
            Here is a simple example of what you code without a library may look
            like when interacting with a JSON:API using <code>fetch</code>,
            and how it could be simplier and cleaner with Foscia.
          </strong>
        </p>
      </div>
      <div className="container">
        <div className={styles.examplesTabs}>
          <Tabs>
            <TabItem
              value="without"
              label="Without Foscia"
              default
            >
              <CodeBlock language="ts">{classicExample}</CodeBlock>
            </TabItem>
            <TabItem
              value="with"
              label="With Foscia"
            >
              <CodeBlock language="ts">{fosciaExample}</CodeBlock>
            </TabItem>
          </Tabs>
        </div>
        <div className={styles.examplesInline}>
          <div className={styles.example}>
            <CodeBlock
              title="Without Foscia"
              language="ts"
            >{classicExample}</CodeBlock>
          </div>
          <div className={styles.example}>
            <CodeBlock
              title="With Foscia"
              language="ts"
            >{fosciaExample}</CodeBlock>
          </div>
        </div>
      </div>
    </section>
  );
}
