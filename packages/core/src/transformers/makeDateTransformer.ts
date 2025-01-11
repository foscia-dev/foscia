import logger from '@foscia/core/logger/logger';
import makeTransformer from '@foscia/core/transformers/makeTransformer';
import { tap } from '@foscia/shared';

/**
 * Create a date transformer.
 *
 * @param name
 * @param deserializeFn
 * @param serializeFn
 *
 * @internal
 */
export default (
  name: string,
  deserializeFn: (value: unknown) => Date,
  serializeFn: (value: Date) => string,
) => () => makeTransformer(
  (value: unknown) => tap(deserializeFn(value), (date) => {
    if (Number.isNaN(date.getTime())) {
      logger.warn(`Transformer \`${name}\` transform resulted in NaN date value.`, [{ value }]);
    }
  }),
  serializeFn,
);
