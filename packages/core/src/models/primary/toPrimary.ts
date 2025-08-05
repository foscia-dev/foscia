import { ModelPrimary } from '@foscia/core/models/types';

export default function toPrimary<T>(value: T) {
  return value as ModelPrimary<T>;
}
