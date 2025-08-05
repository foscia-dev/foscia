import makeModelFactory from '@foscia/core/models/makeModelFactory';
import { ModelFactory } from '@foscia/core/models/oldTypes';

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
