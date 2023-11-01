import makeTransformer from '@foscia/core/transformers/makeTransformer';
import { ObjectTransformer } from '@foscia/core/transformers/types';
import { Awaitable, Transformer } from '@foscia/shared';

function makeValuesMapper<T, S>(transform: Transformer<S, Awaitable<T>>) {
  return (value: S[]) => Promise.all(
    value.map((v) => transform(v)),
  );
}

export default function toArrayOf<T, DS, SR>(transformer: ObjectTransformer<T, DS, SR>) {
  return makeTransformer(
    makeValuesMapper(transformer.deserialize),
    makeValuesMapper(transformer.serialize),
  );
}
