import isComposable from '@foscia/core/model/checks/isComposable';
import isPropFactory from '@foscia/core/model/checks/isPropFactory';
import { ModelParsedDefinition } from '@foscia/core/model/types';
import { Dictionary, eachDescriptors, makeDescriptorHolder } from '@foscia/shared';

const parseDescriptor = (descriptor: PropertyDescriptor) => {
  if (descriptor.value && (isComposable(descriptor.value) || isPropFactory(descriptor.value))) {
    return descriptor.value;
  }

  return makeDescriptorHolder(descriptor);
};

export default <D extends {} = {}>(definition?: D) => {
  const parsedDefinition: Dictionary = {};

  eachDescriptors(definition ?? {}, (key, descriptor) => {
    parsedDefinition[key] = parseDescriptor(descriptor);
  });

  return parsedDefinition as ModelParsedDefinition<D>;
};
