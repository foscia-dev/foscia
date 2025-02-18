import makeComposableFactory from '@foscia/core/model/composition/makeComposableFactory';
import { ModelPendingComposable, ModelPendingProp, ModelProp } from '@foscia/core/model/types';
import { SYMBOL_MODEL_PROP } from '@foscia/core/symbols';

/**
 * Make a property factory.
 *
 * @param pendingProp
 * @param properties
 *
 * @internal
 */
export default <P extends ModelProp, U extends {} = {}>(
  pendingProp: ModelPendingProp<P>,
  properties?: U,
) => makeComposableFactory({
  composable: {
    $FOSCIA_TYPE: SYMBOL_MODEL_PROP,
    ...pendingProp,
  } as ModelPendingComposable<P>,
  bind: (prop) => {
    // eslint-disable-next-line no-param-reassign
    (prop.parent.$schema[prop.key] as any) = prop;
  },
  properties,
});
