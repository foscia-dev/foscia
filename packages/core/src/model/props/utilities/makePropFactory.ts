import makeComposableFactory from '@foscia/core/model/composition/makeComposableFactory';
import {
  ModelComposableFactory,
  ModelPendingComposable,
  ModelPendingProp,
  ModelPendingPropFactory,
  ModelProp,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';

/**
 * Make a property factory.
 *
 * @param pendingProp
 * @param pendingFactory
 *
 * @internal
 */
export default <
  F extends ModelComposableFactory<ModelProp>,
>(
  pendingProp: ModelPendingProp<ReturnType<F['bind']>>,
  pendingFactory: ModelPendingPropFactory<F>,
) => makeComposableFactory({
  composable: {
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP,
    ...pendingProp,
  } as ModelPendingComposable<ReturnType<F['bind']>>,
  bind: (prop) => {
    // eslint-disable-next-line no-param-reassign
    prop.parent.$schema[prop.key] = prop;
  },
  factory: pendingFactory,
}) as unknown as F;
