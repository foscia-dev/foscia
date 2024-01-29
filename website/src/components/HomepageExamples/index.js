import Link from '@docusaurus/Link';
import CodeBlock from '@theme/CodeBlock';
import TabItem from '@theme/TabItem';
import Tabs from '@theme/Tabs';
import React from 'react';
import ArrowRightSvg from '../../icons/arrow-right.svg';
import styles from './styles.module.css';

const definitionExampleMeta = {
  title: 'Define your models and action',
  link: { to: '/docs/core-concepts/models', text: 'Learn more about models' },
  description: (
    <>
      Foscia provides a simple and expressive way to define your models,
      which may combine attributes, relations, custom properties/methods and
      even composable definitions.
      Models can be used through an action factory allowing to run actions
      (e.g. CRUD).
    </>
  ),
};

const modelExampleCode = `
import { makeModel, attr, hasOne } from '@foscia/core';
import publishable from './publishable';
import User from './user';
import Tag from './tag';

export default class Post extends makeModel('posts', {
  ...publishable,
  title: attr<string>(),
  content: attr<string>(),
  tags: hasMany(() => Tag),
  author: hasOne(() => User).readOnly(),
}) {
  get fullTitle() {
    return \`\${this.title} by \${this.author.name} on \${this.publishedAt}\`;
  },
}
`.trim();

const composableExampleCode = `
import { makeComposable, attr, toDate } from '@foscia/core';

export default makeComposable({
  publishedAt: attr(toDate()).nullable(),
});
`.trim();

const actionExampleCode = `
import { makeActionFactory, makeCache } from '@foscia/core';
import {
  makeJsonApiAdapter,
  makeJsonApiDeserializer,
  makeJsonApiSerializer,
} from '@foscia/jsonapi';

export default makeActionFactory({
  ...makeCache(),
  ...makeJsonApiDeserializer(),
  ...makeJsonApiSerializer(),
  ...makeJsonApiAdapter({
    baseURL: '/api/v1',
  }),
});
`.trim();

const playExampleMeta = {
  title: 'Discover actions\' capabilities',
  link: { to: '/docs/core-concepts/actions', text: 'Learn more about actions' },
  description: (
    <>
      The <code>action()</code> factory provides an easy way to
      interact with any data source.
      Possibilities are endless and provided set of functions is wide.
      Not a fan of functional programming?
      You can even plug functional capabilities onto your actions to get a
      class alike call style!
    </>
  ),
};

const playFunctionalExampleCode = `
import { find, update, include, all, oneOrFail, none } from '@foscia/core';
import Post from './post';
import action from './action';

// List posts.
const posts = await action()
  .use(
    forModel(Post),
    filterBy('published', true),
    paginate({ size: 10, number: 1 }),
  )
  .run(all());

// Retrieve a post.
const post = await action()
  .use(find(Post, 1), include('author', 'tags'))
  .run(oneOrFail());

// Update it.
fill(post, { title: 'Hello World!' });

// Save it.
await action().use(update(post)).run(none());
`.trim();

const playBuilderExampleCode = `
import Post from './post';
import action from './action';

// List posts.
const posts = await action()
  .forModel(Post)
  .filterBy('published', true)
  .paginate({ size: 10, number: 1 })
  .all();

// Retrieve a post.
const post = await action()
  .find(Post, 123)
  .include('author', 'tags')
  .oneOrFail();

// Update it.
fill(post, { title: 'Hello World!' });

// Save it.
await action().update(post).none();
`.trim();

function Example({ title, description, link, children }) {
  return (
    <div className="margin-bottom--lg">
      <div className="text--center">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      {children}
      <div className="text--right">
        <Link
          className={`button border--primary ${styles.examplesBtn}`}
          to={link.to}
        >
          {link.text}
          <ArrowRightSvg className={styles.examplesBtnSvg} />
        </Link>
      </div>
    </div>
  );
}

export default function HomepageExamples() {
  return (
    <section>
      <div className={`${styles.examples} container`}>
        <h2 className="title-primary text--center">
          <span className="title-primary__text">
            Discover Foscia
          </span>
        </h2>
        <div>
          <Example {...definitionExampleMeta}>
            <Tabs>
              <TabItem
                value="post"
                label="post.ts"
                default
              >
                <CodeBlock language="ts">{modelExampleCode}</CodeBlock>
              </TabItem>
              <TabItem
                value="composable"
                label="publishable.ts"
              >
                <CodeBlock language="ts">{composableExampleCode}</CodeBlock>
              </TabItem>
              <TabItem
                value="action"
                label="action.ts"
              >
                <CodeBlock language="ts">{actionExampleCode}</CodeBlock>
              </TabItem>
            </Tabs>
          </Example>
          <Example {...playExampleMeta}>
            <Tabs groupId="actionStyle">
              <TabItem
                value="functional"
                label="Functional style"
                default
              >
                <CodeBlock language="ts">{playFunctionalExampleCode}</CodeBlock>
              </TabItem>
              <TabItem
                value="builder"
                label="Builder pattern style"
              >
                <CodeBlock language="ts">{playBuilderExampleCode}</CodeBlock>
              </TabItem>
            </Tabs>
          </Example>
        </div>
      </div>
    </section>
  );
}
