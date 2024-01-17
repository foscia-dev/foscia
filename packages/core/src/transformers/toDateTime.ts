import makeDateTransformer from '@foscia/core/transformers/makeDateTransformer';

export default makeDateTransformer(
  'toDateTime',
  (value: unknown) => new Date(typeof value === 'string' ? Date.parse(value) : Number.NaN),
  (value: Date) => value.toISOString(),
);
