import isModelProp from '@foscia/core/models/old/props/new/isModelProp';
import { Model } from '@foscia/core/models/types';
import { Constructor } from '@foscia/shared';

/**
 * Apply composable static/instances properties to a model.
 *
 * @param model
 * @param composable
 */
export default (model: Model, composable: Constructor<object>) => {
  const ignoredProperties = Object.getOwnPropertyNames(class {
  });

  Object.entries(Object.getOwnPropertyDescriptors(composable)).forEach(([key, descriptor]) => {
    if (ignoredProperties.indexOf(key) === -1) {
      Object.defineProperty(model, key, descriptor);
    }
  });

  // eslint-disable-next-line new-cap
  Object.entries(Object.getOwnPropertyDescriptors(new composable())).forEach(
    ([key, descriptor]) => {
      if (isModelProp(descriptor.value)) {
        // eslint-disable-next-line no-param-reassign
        model.$schema[key] = { ...descriptor.value, parent: model, key };
      } else {
        Object.defineProperty(model.prototype, key, descriptor);
      }
    },
  );
};
