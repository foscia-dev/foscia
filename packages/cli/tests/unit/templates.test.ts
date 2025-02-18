import renderEnhancer from '@foscia/cli/templates/make/renderEnhancer';
import renderRunner from '@foscia/cli/templates/make/renderRunner';
import makeImportsList from '@foscia/cli/utils/imports/makeImportsList';
import { describe, expect, it } from 'vitest';

describe.concurrent('unit: templates', () => {
  const jsProps = () => ({
    config: {
      packageManager: 'npm',
      modules: 'commonjs',
      language: 'js',
      path: '/tmp',
      usage: 'jsonapi',
      tabSize: 4,
    },
    imports: makeImportsList(),
  } as const);

  const tsProps = () => ({
    config: {
      packageManager: 'npm',
      modules: 'esm',
      language: 'ts',
      path: '/tmp',
      alias: '@/data',
      usage: 'jsonapi',
      tabSize: 2,
    },
    imports: makeImportsList(),
  } as const);

  it('should render enhancer (JS)', async () => {
    expect(renderEnhancer({ ...jsProps(), functionName: 'first' }))
      .toStrictEqual(`
const { makeEnhancer } = require('@foscia/core');

modules.export = makeEnhancer('first', (
    // TODO Add enhancer parameters here.
) => async (action) => action(
    // TODO Use other enhancers here, such as \`context\`.
));
`.trim());
  });

  it('should render enhancer (TS)', async () => {
    expect(renderEnhancer({ ...tsProps(), functionName: 'first' }))
      .toStrictEqual(`
import { Action, makeEnhancer } from '@foscia/core';

export default makeEnhancer('first', <C extends {}>(
  // TODO Add enhancer parameters here.
) => async (action: Action<C>) => action(
  // TODO Use other enhancers here, such as \`context\`.
));
`.trim());
  });

  it('should render runner (JS)', async () => {
    expect(renderRunner({ ...jsProps(), functionName: 'first' }))
      .toStrictEqual(`
const { makeRunner } = require('@foscia/core');

modules.export = makeRunner('first', (
    // TODO Add runner parameters here.
) => async (action) => action.run(
    // TODO Use other enhancers and one runner here, such as \`one\`.
));
`.trim());
  });

  it('should render runner (TS)', async () => {
    expect(renderRunner({ ...tsProps(), functionName: 'first' }))
      .toStrictEqual(`
import { Action, makeRunner } from '@foscia/core';

export default makeRunner('first', <C extends {}>(
  // TODO Add runner parameters here.
) => async (action: Action<C>) => action.run(
  // TODO Use other enhancers and one runner here, such as \`one\`.
));
`.trim());
  });
});
