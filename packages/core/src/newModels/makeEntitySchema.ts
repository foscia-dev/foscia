import { FinalEntitySchema } from '@foscia/core/newModels/types';

export default function makeEntitySchema<Schema extends new () => FinalEntitySchema>(
  schema: Schema,
) {
  abstract class BaseEntitySchema implements FinalEntitySchema {
    readonly $extends = schema;

    decline() {

    }
  }

  return BaseEntitySchema;
}
