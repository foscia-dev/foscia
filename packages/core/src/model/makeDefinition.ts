import isComposable from '@foscia/core/model/checks/isComposable';
import isPropFactory from '@foscia/core/model/checks/isPropFactory';
import { ModelParsedDefinition } from '@foscia/core/model/types';
import { Dictionary, eachDescriptors, makeDescriptorHolder, tap } from '@foscia/shared';

const parseDescriptor = (descriptor: PropertyDescriptor) => (
  descriptor.value && (isComposable(descriptor.value) || isPropFactory(descriptor.value))
    ? descriptor.value
    : makeDescriptorHolder(descriptor)
);

/**
 * Parse each descriptor of a raw definition.
 *
 * @param definition
 *
 * @internal
 */
export default <D extends {} = {}>(definition?: D) => tap({} as Dictionary, (parsedDefinition) => {
  eachDescriptors(definition ?? {}, (key, descriptor) => {
    // eslint-disable-next-line no-param-reassign
    parsedDefinition[key] = parseDescriptor(descriptor);
  });
}) as ModelParsedDefinition<D>;
