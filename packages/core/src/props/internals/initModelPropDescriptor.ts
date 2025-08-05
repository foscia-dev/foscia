import { ModelProp } from '@foscia/core/models/types';

/**
 * Init a model property descriptor with reading and writing hooks.
 *
 * @param prop
 *
 * @internal
 */
export default function initModelPropDescriptor<T, This extends object>(
  prop: ModelProp<T, This>,
) {
  Object.defineProperty(prop.parent.prototype, prop.key, {
    configurable: false,
    enumerable: true,
    get(this: This) {
      return prop.get(this);
    },
    set(this: This, next: T) {
      prop.set(this, next);
    },
  });
}
