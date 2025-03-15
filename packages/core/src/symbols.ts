/**
 * Unique symbol for a model property transformer.
 *
 * @internal
 */
export const SYMBOL_MODEL_PROP_TRANSFORMER: unique symbol = Symbol('foscia:prop transformer');

/**
 * Unique symbol for a model property.
 *
 * @internal
 */
export const SYMBOL_MODEL_PROP: unique symbol = Symbol('foscia:prop');

/**
 * Unique symbol for a model ID property.
 *
 * @internal
 */
export const SYMBOL_MODEL_PROP_KIND_ID: unique symbol = Symbol('foscia:prop:id');

/**
 * Unique symbol for a model attribute property factory.
 *
 * @internal
 */
export const SYMBOL_MODEL_PROP_KIND_ATTRIBUTE: unique symbol = Symbol('foscia:prop:attribute');

/**
 * Unique symbol for a model relation property factory.
 *
 * @internal
 */
export const SYMBOL_MODEL_PROP_KIND_RELATION: unique symbol = Symbol('foscia:prop:relation');

/**
 * Unique symbol for a model "has one" relation.
 *
 * @internal
 */
export const SYMBOL_MODEL_RELATION_HAS_ONE: unique symbol = Symbol('foscia:rel:has-one');

/**
 * Unique symbol for a model "has one" relation.
 *
 * @internal
 */
export const SYMBOL_MODEL_RELATION_HAS_MANY: unique symbol = Symbol('foscia:rel:has-many');

/**
 * Unique symbol for a model class.
 *
 * @internal
 */
export const SYMBOL_MODEL_CLASS: unique symbol = Symbol('foscia:model');

/**
 * Unique symbol for a model instance.
 *
 * @internal
 */
export const SYMBOL_MODEL_INSTANCE: unique symbol = Symbol('foscia:instance');

/**
 * Unique symbol for a model composable.
 *
 * @internal
 */
export const SYMBOL_MODEL_COMPOSABLE: unique symbol = Symbol('foscia:composable');

/**
 * Unique symbol for an instance snapshot.
 *
 * @internal
 */
export const SYMBOL_MODEL_SNAPSHOT: unique symbol = Symbol('foscia:snapshot');

/**
 * Unique symbol for an action.
 *
 * @internal
 */
export const SYMBOL_ACTION: unique symbol = Symbol('foscia:action');

/**
 * Unique symbol for an action "when" context function.
 *
 * @internal
 */
export const SYMBOL_ACTION_WHEN: unique symbol = Symbol('foscia:action:when');

/**
 * Unique symbol for an action enhancer context function.
 *
 * @internal
 */
export const SYMBOL_ACTION_ENHANCER: unique symbol = Symbol('foscia:action:enhancer');

/**
 * Unique symbol for an action runner context function.
 *
 * @internal
 */
export const SYMBOL_ACTION_RUNNER: unique symbol = Symbol('foscia:action:runner');
