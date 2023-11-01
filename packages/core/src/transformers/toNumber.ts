import logger from '@foscia/core/logger/logger';
import makeTransformer from '@foscia/core/transformers/makeTransformer';

export default () => makeTransformer((value: unknown) => {
  const number = Number(value);
  if (Number.isNaN(number)) {
    logger.warn('Transformer `toNumber` transform resulted in NaN value.', [{ value }]);
  }

  return number;
});
