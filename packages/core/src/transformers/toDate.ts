import makeDateTransformer from '@foscia/core/transformers/makeDateTransformer';
import { removeTimezoneOffset } from '@foscia/shared';

export default makeDateTransformer(
  'toDate',
  (value: unknown) => {
    const [y, m, d] = typeof value === 'string' ? value.split('-') : [];

    return new Date(
      Number.parseInt(y, 10),
      Number.parseInt(m, 10) - 1,
      Number.parseInt(d, 10),
      0,
      0,
      0,
      0,
    );
  },
  // Removing timezone offset prevent date to shift on another day
  // when serializing to ISO UTC format.
  (value: Date) => removeTimezoneOffset(value).toISOString().split('T')[0],
);
