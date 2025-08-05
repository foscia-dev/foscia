import isComposable from '@foscia/core/models/old/composition/checks/isComposable';
import { ModelParsedDefinition } from '@foscia/core/models/oldTypes';
import { Dictionary, eachDescriptors, makeDescriptorHolder, tap } from '@foscia/shared';

/**
 * Parse each descriptor of a raw definition.
 *
 * @param definition
 *
 * @internal
 */
export default <D extends {} = {}>(definition?: D) => tap(
  {} as Dictionary<unknown>,
  (parsedDefinition) => {
    eachDescriptors(definition ?? {}, (key, descriptor) => {
      // eslint-disable-next-line no-param-reassign
      parsedDefinition[key] = (
        descriptor.value && isComposable(descriptor.value)
          ? descriptor.value
          : makeDescriptorHolder(descriptor)
      );
    });
  },
) as ModelParsedDefinition<D>;
