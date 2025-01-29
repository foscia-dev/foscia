import makeTransformer from '@foscia/core/transformers/makeTransformer';

/**
 * Create a boolean transformer.
 *
 * @param options
 *
 * @category Factories
 */
export default (
  options?: { trueValues?: unknown[]; },
) => makeTransformer(
  (value: unknown) => (options?.trueValues ?? [true, 1, '1', 'true', 'yes']).indexOf(value) !== -1,
);
