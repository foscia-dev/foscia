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
      <br />
      Models can be used through an action factory allowing to run actions
      (e.g. CRUD).
    </>
  ),
};

const modelExampleCode = `
import { makeModel, attr, hasOne } from '@foscia/core';
import publishable from './publishable';
import type User from './user';
import type Tag from './tag';

export default class Post extends makeModel('posts', {
    ...publishable,
    title: attr<string>(),
    content: attr<string>(),
    author: hasOne<User>(),
    tags: hasMany<Tag>(),
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
import { makeJsonApi } from '@foscia/jsonapi';
import Post from './post';
import User from './user';
import Tag from './tag';

const { action } = makeJsonApi({
  models: [Post, User, Tag],
  http: {
    baseURL: '/api/v1',
  },
});

export default action;
`.trim();

const playExampleMeta = {
  title: 'Discover actions\' capabilities',
  link: { to: '/docs/core-concepts/actions', text: 'Learn more about actions' },
  description: (
    <>
      The <code>action()</code> factory provides an easy way to
      interact with any data source.
      Possibilities are endless and provided set of functions is wide.
      <br />
      Not a fan of functional programming?
      You can even plug functional capabilities onto your actions to get a
      class alike call style!
    </>
  ),
};

const playFunctionalExampleCode = `
import { find, update, include, oneOrFail, oneOrCurrent } from '@foscia/core';
import Post from './post';
import action from './action';

// The functional way!
const post = await action()
    .use(
      find(Post, 123),
      include('author', 'tags'),
    )
    .run(oneOrFail());

fill(post, { title: 'Hello World!' });

const updatedPost = await action()
    .use(update(post))
    .run(oneOrCurrent());
`.trim();

const playBuilderExampleCode = `
import Post from './post';
import action from './action';

// The good old builder pattern way!
const post = await action()
    .find(Post, 123)
    .include('author', 'tags')
    .oneOrFail();

fill(post, { title: 'Hello World!' });

const updatedPost = await action()
    .update(post)
    .oneOrCurrent();
`.trim();

function Example({ title, description, link, children }) {
  return (
    <div className="margin-bottom--lg">
      <div className="text--center">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
      <div className="text--right">
        <Link
          className={`button bg--primary ${styles.examplesBtn}`}
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
        <div className="padding-horiz--md">
          <Example {...definitionExampleMeta}>
            <Tabs groupId="actionStyle">
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
                value="builder"
                label="Builder pattern style"
                default
              >
                <CodeBlock language="ts">{playBuilderExampleCode}</CodeBlock>
              </TabItem>
              <TabItem
                value="functional"
                label="Functional style"
              >
                <CodeBlock language="ts">{playFunctionalExampleCode}</CodeBlock>
              </TabItem>
            </Tabs>
          </Example>
        </div>
      </div>
    </section>
  );
}
