import logger from '@foscia/core/logger/logger';
import makeTransformer from '@foscia/core/transformers/makeTransformer';

function dateFromUnix(unix: number): Date {
  const date = new Date();

  date.setTime(unix);

  return date;
}

export default () => makeTransformer(
  (value: unknown) => {
    const date = dateFromUnix(typeof value === 'string' ? Date.parse(value) : Number.NaN);
    if (Number.isNaN(date.getTime())) {
      logger.warn('Transformer `toDate` transform resulted in NaN date value.', [{ value }]);
    }

    return date;
  },
  (value: Date) => value.toISOString(),
);
