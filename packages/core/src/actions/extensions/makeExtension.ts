import { ActionParsedExtension } from '@foscia/core/actions/types';
import { Dictionary, eachDescriptors, makeDescriptorHolder } from '@foscia/shared';

export default function makeExtension<E extends {} = {}>(extension: E) {
  const parsedDefinition: Dictionary = {};

  eachDescriptors(extension ?? {}, (key, descriptor) => {
    parsedDefinition[key] = makeDescriptorHolder(descriptor);
  });

  return parsedDefinition as ActionParsedExtension<E>;
}
