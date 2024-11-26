import makeValuePropFactory from '@foscia/core/model/props/builders/makeValuePropFactory';
import {
  ModelRelationFactory,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/props/builders/types';
import { ModelInstance, ModelRelation, ModelRelationType } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_RELATION } from '@foscia/core/symbols';

export default (
  relationType: ModelRelationType,
  config?: ModelRelationFactoryConfig,
) => {
  const resolveConfig = (configValue: ModelRelationFactoryConfig) => {
    if (typeof configValue === 'string' || Array.isArray(configValue)) {
      return { type: configValue };
    }

    if (typeof configValue === 'function') {
      return { model: configValue };
    }

    return { ...configValue };
  };

  return makeValuePropFactory({
    $VALUE_PROP_TYPE: SYMBOL_MODEL_PROP_KIND_RELATION,
    $RELATION_TYPE: relationType,
    ...resolveConfig(config ?? {}),
  } as ModelRelation, {
    config: resolveConfig,
  }) as ModelRelationFactory<ModelInstance | ModelInstance[] | null, false>;
};
