import makeComposableFactory from '@foscia/core/models/old/composition/makeComposableFactory';
import {
  ModelComposableFactory,
  ModelPendingComposable,
  ModelProp,
} from '@foscia/core/models/oldTypes';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';

/**
 * Make a property factory.
 *
 * @param prop
 *
 * @internal
 */
export default <
  F extends ModelComposableFactory<ModelProp>,
>(
  prop: Omit<ReturnType<F['bind']>, '$FOSCIA_TYPE' | 'factory' | 'parent' | 'key' | '_type' | '_propType'>,
) => makeComposableFactory({
  composable: {
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP,
    ...prop,
  } as ModelPendingComposable<ReturnType<F['bind']>>,
  bind: (realProp) => {
    // eslint-disable-next-line no-param-reassign
    realProp.parent.$schema[realProp.key] = realProp;
  },
  factory: {},
}) as unknown as F;
