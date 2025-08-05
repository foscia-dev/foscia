import { BelongsTo, EntityAttributeKey } from '@foscia/core/new/entities/properties/types';
import {
  AnySchemaFragment,
  EntityOf,
  EntityRecordOf,
  FinalEntitySchema,
} from '@foscia/core/new/entities/types';

function belongsTo<
  Name extends string,
  ThisSchema extends AnySchemaFragment,
  Schema extends AnySchemaFragment = ThisSchema,
>(
  resolver: () => EntityOf<Schema> | 'self',
  options?: {
    foreignKey?: EntityAttributeKey<FinalEntitySchema<Schema>>;
    ownerKey?: EntityAttributeKey<FinalEntitySchema<ThisSchema>>;
  },
): (
  target: undefined,
  context: ClassFieldDecoratorContext<
    ThisSchema, BelongsTo<EntityRecordOf<Schema>>> & { name: Name; },
) => void;

export default belongsTo;
