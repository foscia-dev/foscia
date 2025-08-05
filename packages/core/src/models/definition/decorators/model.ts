import makeModelDecorator from '@foscia/core/models/definition/decorators/makeModel';

/**
 * Default model decorator.
 *
 * @param sharedConfig
 *
 * @category Factories
 * @since 0.13.0
 *
 * @example
 * ```typescript
 * import { model } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 * }
 * ```
 */
export default /* @__PURE__ */ makeModelDecorator();
