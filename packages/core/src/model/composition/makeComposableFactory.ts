import { ModelPendingComposable } from '@foscia/core/model/composition/types';
import { ModelComposable, ModelComposableFactory } from '@foscia/core/model/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';

/**
 * Create a fully customizable composable factory.
 *
 * @param config
 *
 * @internal
 */
export default <C extends ModelComposable, U extends {} = {}>(
  config: {
    bind: (composable: C & { factory: ModelComposableFactory<C> & U; }) => void,
    composable?: ModelPendingComposable<C>,
    properties?: U,
  },
) => {
  const factory = {
    ...config.properties,
    $FOSCIA_TYPE: SYMBOL_MODEL_COMPOSABLE,
    bind: ({ parent, key }) => {
      const composable: any = {
        factory,
        parent,
        key,
        ...config.composable,
      };

      config.bind(composable);

      return composable;
    },
  } as ModelComposableFactory<C> & U;

  return factory;
};
