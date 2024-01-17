import logger from '@foscia/core/logger/logger';
import makeTransformer from '@foscia/core/transformers/makeTransformer';

export default function makeDateTransformer(
  name: string,
  deserializeFn: (value: unknown) => Date,
  serializeFn: (value: Date) => string,
) {
  return () => makeTransformer(
    (value: unknown) => {
      const date = deserializeFn(value);
      if (Number.isNaN(date.getTime())) {
        logger.warn(`Transformer \`${name}\` transform resulted in NaN date value.`, [{ value }]);
      }

      return date;
    },
    (value: Date) => serializeFn(value),
  );
}
