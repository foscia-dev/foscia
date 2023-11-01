import isPendingPropDef from '@foscia/core/model/checks/isPendingPropDef';
import isPropDef from '@foscia/core/model/checks/isPropDef';
import { ModelParsedDefinition } from '@foscia/core/model/types';
import { Dictionary, eachDescriptors, makeDescriptorHolder } from '@foscia/shared';

function parseDescriptor(key: string, descriptor: PropertyDescriptor) {
  if (descriptor.value) {
    if (isPropDef(descriptor.value)) {
      return { ...descriptor.value, key };
    }

    if (isPendingPropDef(descriptor.value)) {
      return { ...descriptor.value.definition, key };
    }
  }

  return makeDescriptorHolder(descriptor);
}

export default function makeDefinition<D extends {} = {}>(definition?: D) {
  const parsedDefinition: Dictionary = {};

  eachDescriptors(definition ?? {}, (key, descriptor) => {
    parsedDefinition[key] = parseDescriptor(key, descriptor);
  });

  return parsedDefinition as ModelParsedDefinition<D>;
}
