import isNil from '@foscia/shared/checks/isNil';
import isDescriptorHolder from '@foscia/shared/descriptors/isDescriptorHolder';

export default function eachDescriptors(
  obj: object,
  callback: (key: string, descriptor: PropertyDescriptor) => void,
) {
  Object.entries(Object.getOwnPropertyDescriptors(obj ?? {}))
    .forEach(([key, descriptor]) => {
      if (!isNil(descriptor.value) && isDescriptorHolder(descriptor.value)) {
        callback(key, descriptor.value.descriptor);
      } else {
        callback(key, descriptor);
      }
    });
}
