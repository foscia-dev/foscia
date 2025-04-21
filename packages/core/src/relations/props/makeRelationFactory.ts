import makePropFactory from '@foscia/core/model/props/utilities/makePropFactory';
import makeValuePropInit, {
  ValuePropOptions,
} from '@foscia/core/model/props/utilities/makeValuePropInit';
import {
  ModelBelongsToFactory,
  ModelHasManyFactory,
  ModelHasOneFactory,
  ModelMorphManyFactory,
  ModelMorphOneFactory,
  ModelMorphToFactory,
  ModelRelation,
  ModelRelationFactoryConfig,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP_KIND_RELATION } from '@foscia/core/symbols';
import { Awaitable } from '@foscia/shared';

type AnyModelRelation =
  | ModelBelongsToFactory<any, any>
  | ModelHasManyFactory<any, any>
  | ModelHasOneFactory<any, any>
  | ModelMorphToFactory<any, any>
  | ModelMorphManyFactory<any, any>
  | ModelMorphOneFactory<any, any>;

/**
 * Make a relation factory.
 *
 * @param kind
 * @param options
 *
 * @internal
 */
export default <R extends ModelRelation>(
  kind: R['$RELATION_KIND'],
  options?: ValuePropOptions<R>,
) => (
  config?: string | string[] | ModelRelationFactoryConfig<any> | (() => Awaitable<any>),
  otherConfig?: ModelRelationFactoryConfig<any>,
) => makePropFactory<AnyModelRelation>({
  $VALUE_PROP_KIND: SYMBOL_MODEL_PROP_KIND_RELATION,
  $RELATION_KIND: kind,
  ...makeValuePropInit(options),
  ...(() => {
    if (typeof config === 'string' || Array.isArray(config)) {
      return { type: config, ...otherConfig };
    }

    return typeof config === 'function'
      ? { model: config, ...otherConfig }
      : config;
  })(),
});
