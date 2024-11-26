import makeTransformer from '@foscia/core/transformers/makeTransformer';

/**
 * Create a string transformer.
 *
 * @category Factories
 */
export default () => makeTransformer((value: unknown) => String(value));
