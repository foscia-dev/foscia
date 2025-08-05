import makeModelRelationDecoratorFactory
  from '@foscia/core/relations/internals/makeModelRelationDecoratorFactory';
import { SYMBOL_MODEL_RELATION_MORPH_MANY } from '@foscia/core/symbols';

/**
 * Create a morph many relation decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, morphMany } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @morphMany(() => Comment) comments!: Comment[];
 * }
 * ```
 */
export default /* @__PURE__ */ makeModelRelationDecoratorFactory(
  SYMBOL_MODEL_RELATION_MORPH_MANY,
);
