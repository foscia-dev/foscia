import makeHookable from '@foscia/core/hooks/makeHookable';
import { ModelComposable } from '@foscia/core/models/types';
import { SYMBOL_MODEL_COMPOSABLE } from '@foscia/core/symbols';
import { Constructor } from '@foscia/shared';

export default <Composable extends Constructor<{}>>(
  composableClass: Composable,
): ModelComposable<Composable> => makeHookable({
  $FOSCIA_TYPE: SYMBOL_MODEL_COMPOSABLE,
  composable: composableClass,
});
