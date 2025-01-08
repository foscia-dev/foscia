import makeDateTransformer from '@foscia/core/transformers/makeDateTransformer';

/**
 * Create a date time transformer.
 *
 * @category Factories
 */
export default /* @__PURE__ */ makeDateTransformer(
  'toDateTime',
  (value: unknown) => new Date(typeof value === 'string' ? Date.parse(value) : Number.NaN),
  (value: Date) => value.toISOString(),
);
