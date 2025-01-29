import makeValuePropFactory from '@foscia/core/model/props/builders/makeValuePropFactory';
import {
  ModelPendingProp,
  ModelRelationFactory,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelInstance, ModelRelation, ModelRelationType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_RELATION } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

/**
 * Make a relation property definition factory.
 *
 * @param relationType
 *
 * @internal
 */
export default (
  relationType: ModelRelationType,
) => (
  config?: string | string[] | ModelRelationFactoryConfig<any, boolean> | (() => Awaitable<any>),
  otherConfig?: ModelRelationFactoryConfig<any, boolean>,
) => makeValuePropFactory({
  $VALUE_PROP_TYPE: SYMBOL_MODEL_PROP_KIND_RELATION,
  $RELATION_TYPE: relationType,
  ...(() => {
    if (typeof config === 'string' || Array.isArray(config)) {
      return { type: config, ...otherConfig };
    }

    return typeof config === 'function'
      ? { model: config, ...otherConfig }
      : config;
  })(),
} as ModelPendingProp<ModelRelation>, {
  inverse: (inverse) => ({ inverse }),
  path: (path) => ({ path }),
}) as ModelRelationFactory<ModelInstance | ModelInstance[] | null, false>;
