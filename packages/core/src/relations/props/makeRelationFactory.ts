import makePropFactory from '@foscia/core/model/props/utilities/makePropFactory';
import makeValuePropInit from '@foscia/core/model/props/utilities/makeValuePropInit';
import makeValuePropModifiers from '@foscia/core/model/props/utilities/makeValuePropModifiers';
import buildPropFactoryModifiers
  from '@foscia/core/model/props/utilities/buildPropFactoryModifiers';
import {
  ModelHasManyFactory,
  ModelHasOneFactory,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/types';
import {
  SYMBOL_MODEL_PROP_KIND_RELATION,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
} from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

/**
 * Make a relation factory.
 *
 * @param kind
 *
 * @internal
 */
export default (
  kind: typeof SYMBOL_MODEL_RELATION_HAS_ONE | typeof SYMBOL_MODEL_RELATION_HAS_MANY,
) => (
  config?: string | string[] | ModelRelationFactoryConfig<any, boolean> | (() => Awaitable<any>),
  otherConfig?: ModelRelationFactoryConfig<any, boolean>,
) => makePropFactory<ModelHasOneFactory<any, any> | ModelHasManyFactory<any, any>>({
  $VALUE_PROP_KIND: SYMBOL_MODEL_PROP_KIND_RELATION,
  $RELATION_KIND: kind,
  ...makeValuePropInit(),
  ...(() => {
    if (typeof config === 'string' || Array.isArray(config)) {
      return { type: config, ...otherConfig };
    }

    return typeof config === 'function'
      ? { model: config, ...otherConfig }
      : config;
  })(),
}, {
  ...buildPropFactoryModifiers<ModelHasOneFactory<any, any> | ModelHasManyFactory<any, any>>({
    ...makeValuePropModifiers(),
    inverse: (inverse) => ({ inverse }),
    include: (include) => ({ include }),
    query: (query) => ({ query }),
    path: (path) => ({ path }),
  }),
});
