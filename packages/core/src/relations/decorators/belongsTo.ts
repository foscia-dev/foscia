import initModelRelationForeignKeyHook
  from '@foscia/core/props/internals/initModelRelationForeignKeyHook';
import makeModelRelationDecoratorFactory
  from '@foscia/core/relations/internals/makeModelRelationDecoratorFactory';
import { SYMBOL_MODEL_RELATION_BELONGS_TO } from '@foscia/core/symbols';

/**
 * Create a belongs to relation decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, belongsTo } from '@foscia/core';
 *
 * @model()
 * class Post extends model.base() {
 *   @belongsTo(() => User) author!: User;
 * }
 * ```
 */
export default /* @__PURE__ */ makeModelRelationDecoratorFactory(
  SYMBOL_MODEL_RELATION_BELONGS_TO,
  initModelRelationForeignKeyHook,
);
