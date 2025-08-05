import { EntitySchemaPlugin } from '@foscia/core/new/entities/plugins/types';
import { Attribute, EntityProperty } from '@foscia/core/new/entities/properties/types';
import { SchemaFragment } from '@foscia/core/new/entities/types';
import { PLUGIN_OUTPUT, PluginInput } from '@foscia/core/new/shared/plugins/types';
import { OmitNever } from '@foscia/shared';

export interface AttributesPlugin extends EntitySchemaPlugin<SchemaFragment, unknown> {
  [PLUGIN_OUTPUT]: AttributesPluginOutput<PluginInput<this>>;
}

// TODO Do not use omit never!
export type AttributesPluginOutput<Schema extends SchemaFragment> = OmitNever<{
  [K in keyof Required<Schema>]: K extends `$${string}`
    ? never
    : Required<Schema>[K] extends EntityProperty<any>
      ? never
      : Attribute<Required<Schema>[K]>;
}>;

/**
 * Entity plugin which parse decorator-less schema properties as attributes.
 *
 * @category Plugins
 */
export default function attributesPlugin(): AttributesPlugin {

}
