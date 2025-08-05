import makeModelRelationDecoratorFactory
  from '@foscia/core/relations/internals/makeModelRelationDecoratorFactory';
import { SYMBOL_MODEL_RELATION_HAS_MANY } from '@foscia/core/symbols';

/**
 * Create a has many relation decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, hasMany } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @hasMany(() => Comment) comments!: Comment[];
 * }
 * ```
 */
export default /* @__PURE__ */ makeModelRelationDecoratorFactory(
  SYMBOL_MODEL_RELATION_HAS_MANY,
);
