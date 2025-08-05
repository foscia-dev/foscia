import { EntityComposablePlugin, ParsedEntitySchema, PendingEntitySchema } from '@foscia/core/newModels/types';

export default function makeComposable<const Schema extends PendingEntitySchema>(
  schema: new () => Schema,
): EntityComposablePlugin<ParsedEntitySchema<Schema>> {
  return { schema };
}
