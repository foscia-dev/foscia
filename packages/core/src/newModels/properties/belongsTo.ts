import { Attribute, BelongsTo, EntityRecord, FinalEntitySchema } from '@foscia/core/newModels/types';

type ForeignKey<Schema extends FinalEntitySchema> = {
  [K in keyof Schema]: Schema[K] extends Attribute<any, any>
    ? K : never;
}[keyof Schema];

export default function belongsTo<Record extends EntityRecord<{ $type: any }>, Schema extends FinalEntitySchema>(
  related: () => Record['$entity'],
  options?: { foreignKey?: ForeignKey<Record['$entity']['schema']>; },
) {
  return (
    target: undefined,
    context: ClassFieldDecoratorContext<Schema, BelongsTo<Record, Schema>>,
  ): void => undefined;
}
