import makeTransformer from '@foscia/core/transformers/makeTransformer';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, Transformer } from '@foscia/shared';

const makeValuesMapper = <T, S>(
  transform: Transformer<S, Awaitable<T>>,
) => (value: S[]) => Promise.all(
  value.map((v) => transform(v)),
);

export default <T, DS, SR>(transformer: ObjectTransformer<T, DS, SR>) => makeTransformer(
  makeValuesMapper(transformer.deserialize),
  makeValuesMapper(transformer.serialize),
);
