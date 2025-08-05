import initModelRelationForeignKeyHook
  from '@foscia/core/props/internals/initModelRelationForeignKeyHook';
import initModelRelationForeignTypeKeyHook
  from '@foscia/core/props/internals/initModelRelationForeignTypeKeyHook';
import makeModelRelationDecoratorFactory
  from '@foscia/core/relations/internals/makeModelRelationDecoratorFactory';
import { SYMBOL_MODEL_RELATION_MORPH_TO } from '@foscia/core/symbols';

/**
 * Create a morph to relation decorator.
 *
 * @category Factories
 *
 * @example
 * ```typescript
 * import { model, morphTo } from '@foscia/core';
 *
 * @model()
 * class Tag extends model.base() {
 *   @morphTo(() => [Post, Product]) taggable!: Post | Product;
 * }
 * ```
 */
export default /* @__PURE__ */ makeModelRelationDecoratorFactory(
  SYMBOL_MODEL_RELATION_MORPH_TO,
  (prop) => {
    initModelRelationForeignKeyHook(prop);
    initModelRelationForeignTypeKeyHook(prop);
  },
);
