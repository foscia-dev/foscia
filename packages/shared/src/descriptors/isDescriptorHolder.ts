import isFosciaType from '@foscia/shared/checks/isFosciaType';
import { SYMBOL_DESCRIPTOR_HOLDER } from '@foscia/shared/descriptors/makeDescriptorHolder';
import { DescriptorHolder } from '@foscia/shared/descriptors/types';

export default function isDescriptorHolder(
  value: unknown,
): value is DescriptorHolder {
  return isFosciaType(value, SYMBOL_DESCRIPTOR_HOLDER);
}
