import makeTransformer from '@foscia/core/transformers/makeTransformer';

export default () => makeTransformer((value: unknown) => String(value));
