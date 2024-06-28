import isInstance from '@foscia/core/model/checks/isInstance';
import isModelUsing from '@foscia/core/model/checks/isModelUsing';
import { ModelComposable, ModelInstanceUsing } from '@foscia/core/model/types';

export default <C extends ModelComposable>(
  value: unknown,
  composable: C,
): value is ModelInstanceUsing<C> => isInstance(value) && isModelUsing(value.$model, composable);
