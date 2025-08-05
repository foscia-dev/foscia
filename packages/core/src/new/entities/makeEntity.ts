import { ENTITY, ENTITY_RECORD } from '@foscia/core/new/entities/consts';
import { ENTITY_SCHEMA_PLUGIN } from '@foscia/core/new/entities/plugins/consts';
import { EntitySchemaPlugin } from '@foscia/core/new/entities/plugins/types';
import {
  Entity,
  EntitySchema,
  SchemaFragment,
  FinalEntitySchema,
} from '@foscia/core/new/entities/types';
import identify from '@foscia/core/new/shared/identity/identify';
import isIdentifiedBy from '@foscia/core/new/shared/identity/isIdentifiedBy';
import applyPlugins from '@foscia/core/new/shared/plugins/applyPlugins';

export default function makeEntity<Schema extends EntitySchema>(
  SchemaConstructor: new () => Schema,
): Entity<FinalEntitySchema<Schema>> {
  const schema = new SchemaConstructor();
  const enhancedSchema = applyPlugins(
    schema,
    (schema.$plugins ?? []).filter(
      (plugin) => isIdentifiedBy<EntitySchemaPlugin<Schema, SchemaFragment>>(
        plugin,
        ENTITY_SCHEMA_PLUGIN,
      ),
    ),
  );

  const { $connection, $type, $plugins, ...props } = enhancedSchema;

  // TODO Ensure no props starts with `$`.

  // TODO Apply plugins.
  const entity = identify(ENTITY, {
    schema: enhancedSchema,
    // TODO Apply plugins.
    make: () => identify(ENTITY_RECORD, {
      // TODO Parse props.
      $entity: entity,
    }),
  });

  return entity;
}
