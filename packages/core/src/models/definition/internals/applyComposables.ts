import makeObjectPropertyDefiner
  from '@foscia/core/models/definition/internals/makeObjectPropertyDefiner';
import { Model, ModelComposableDecorator } from '@foscia/core/models/types';
import { Constructor } from '@foscia/shared/index';

/**
 * Apply composables to a base class.
 *
 * @param composables
 * @param target
 *
 * @internal
 */
export default function applyComposables(
  composables: ModelComposableDecorator[],
  target?: Constructor,
) {
  const targetClass = target ?? class {
  };

  if (!Object.getOwnPropertyDescriptor(targetClass, '$composables')) {
    const defineModelProperty = makeObjectPropertyDefiner<Model>(targetClass);
    defineModelProperty('$composables', new Set());
  }

  return (composables ?? []).reduce((model, composable) => {
    (model as unknown as Pick<Model, '$composables'>).$composables.add(composable);

    return composable(model);
  }, targetClass);
}
