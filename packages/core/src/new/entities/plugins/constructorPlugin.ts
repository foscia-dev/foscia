import makeEntityPlugin from '@foscia/core/new/entities/plugins/makeEntityPlugin';
import { EntityPlugin } from '@foscia/core/new/entities/plugins/types';
import { Entity, EntityRecordOf } from '@foscia/core/new/entities/types';
import { PLUGIN_OUTPUT, PluginInput } from '@foscia/core/new/shared/plugins/types';

export interface ConstructorPlugin extends EntityPlugin<Entity, unknown> {
  [PLUGIN_OUTPUT]: ConstructorPluginOutput<PluginInput<this>>;
}

export interface ConstructorPluginOutput<E extends Entity> {
  new(): EntityRecordOf<E>;
}

/**
 * Entity plugin which adds a constructor on entities, allowing `new` calls.
 *
 * @category Plugins
 */
export default function constructorPlugin(): ConstructorPlugin {
  return makeEntityPlugin((entity) => {
    const constructor: new () => EntityRecordOf<typeof entity> = function Constructor() {
      return entity.make();
    };

    return Object.assign(entity, constructor);
  });
}
