import { Entity, FinalEntitySchema, ParsedEntitySchema } from '@foscia/core/newModels/types';

export default function makeEntity<const Schema extends FinalEntitySchema>(
  schema: new () => Schema,
): Entity<ParsedEntitySchema<Schema>>;
