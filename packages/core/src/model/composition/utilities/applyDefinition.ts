import FosciaError from '@foscia/core/errors/fosciaError';
import isComposable from '@foscia/core/model/composition/checks/isComposable';
import isId from '@foscia/core/model/props/checks/isId';
import { Model, ModelComposable } from '@foscia/core/model/types';
import { eachDescriptors } from '@foscia/shared';

/**
 * Apply the definition to the model.
 *
 * @param parent
 * @param definition
 *
 * @internal
 */
export default (
  parent: Model,
  definition: object,
) => eachDescriptors(definition, (key, descriptor) => {
  let composable: ModelComposable | undefined;
  if (isComposable(descriptor.value)) {
    composable = descriptor.value.bind({ parent, key });
  }

  if ((key === 'id' || key === 'lid') && !isId(composable)) {
    throw new FosciaError(
      `\`id\` and \`lid\` must be defined with \`id()\` factory (found \`${key}\`).`,
    );
  }

  if (composable) {
    parent.$composables.push(composable);
  } else {
    Object.defineProperty(parent.prototype, key, descriptor);
  }
});
