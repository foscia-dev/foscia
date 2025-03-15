import makeModelFactory from '@foscia/core/model/makeModelFactory';
import { ModelFactory } from '@foscia/core/model/types';

/**
 * Create a model.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { makeModel } from '@foscia/core';
 *
 * export default class Post extends makeModel('posts', {
 *   // Definition...
 * }) {
 * }
 * ```
 */
export default /* @__PURE__ */ makeModelFactory() as ModelFactory;
