import { HasMany, RecordFactory } from '@foscia/core/newModels/types';

export default function hasMany<Schema extends object, ThisSchema extends object>(
  resolver: () => RecordFactory<any>,
): HasMany<Schema, ThisSchema> {
  return {
    __parent: undefined as any,
    __type: undefined as any,
  };
}
