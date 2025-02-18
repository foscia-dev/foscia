import logger from '@foscia/core/logger/logger';
import makeTransformer from '@foscia/core/transformers/makeTransformer';
import { tap } from '@foscia/shared';

/**
 * Create a number transformer.
 *
 * @category Factories
 */
export default () => makeTransformer((value: unknown) => tap(Number(value), (number) => {
  if (Number.isNaN(number)) {
    logger.warn('Transformer `toNumber` transform resulted in NaN value.', value);
  }
}));
