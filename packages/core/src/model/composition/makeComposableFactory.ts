import {
  ModelComposable,
  ModelComposableFactory,
  ModelPendingComposable,
} from '@foscia/core/model/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';

/**
 * Create a fully customizable composable factory.
 *
 * @param config
 *
 * @internal
 */
export default <C extends ModelComposable, F extends {} = {}>(
  config: {
    bind: (composable: C & { factory: ModelComposableFactory<C> & F; }) => void,
    composable?: ModelPendingComposable<C>,
    factory?: F,
  },
): ModelComposableFactory<C> & F => {
  const factory = {
    ...config.factory,
    $FOSCIA_TYPE: SYMBOL_MODEL_COMPOSABLE,
    composable: config.composable ?? {},
    bind({ parent, key }) {
      const composable: any = {
        factory,
        parent,
        key,
        ...this.composable,
      };

      config.bind(composable);

      return composable;
    },
  } as ModelComposableFactory<C> & F;

  return factory;
};
