import isModel from '@foscia/core/model/checks/isModel';
import { ModelComposable, ModelUsing } from '@foscia/core/model/types';

export default <C extends ModelComposable>(
  value: unknown,
  composable: C,
): value is ModelUsing<C> => isModel(value) && value.$composables.indexOf(composable) !== -1;
