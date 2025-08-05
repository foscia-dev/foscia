import { Model } from '@foscia/core/models/types';
import { Constructor } from '@foscia/shared';

export default (model: Model, composable: Constructor<{}>) => {
  Object.assign(model, composable);
};
