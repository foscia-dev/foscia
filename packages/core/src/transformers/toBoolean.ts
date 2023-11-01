import makeTransformer from '@foscia/core/transformers/makeTransformer';

type ToBooleanOptions = {
  trueValues?: unknown[];
};

const DEFAULT_TRUE_VALUES = [true, 1, '1', 'true', 'yes'];

export default function toBoolean(options?: ToBooleanOptions) {
  return makeTransformer(
    (value: unknown) => (options?.trueValues ?? DEFAULT_TRUE_VALUES).indexOf(value) !== -1,
  );
}
