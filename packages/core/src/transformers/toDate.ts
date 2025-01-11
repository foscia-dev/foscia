import makeDateTransformer from '@foscia/core/transformers/makeDateTransformer';
import { removeTimezoneOffset, using } from '@foscia/shared';

/**
 * Create a date transformer.
 *
 * @category Factories
 */
export default /* @__PURE__ */ makeDateTransformer(
  'toDate',
  (value: unknown) => using(
    typeof value === 'string' ? value.split('-') : [],
    ([y, m, d]) => new Date(
      Number.parseInt(y, 10),
      Number.parseInt(m, 10) - 1,
      Number.parseInt(d, 10),
      0,
      0,
      0,
      0,
    ),
  ),
  // Removing timezone offset prevent date to shift on another day
  // when serializing to ISO UTC format.
  (value: Date) => removeTimezoneOffset(value).toISOString().split('T')[0],
);
