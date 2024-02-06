import isModel from '@foscia/core/model/checks/isModel';
import { ModelComposable, ModelUsing } from '@foscia/core/model/types';

export default function isModelUsing<C extends ModelComposable>(
  value: unknown,
  composable: C,
): value is ModelUsing<C> {
  return isModel(value) && value.$composables.indexOf(composable) !== -1;
}
