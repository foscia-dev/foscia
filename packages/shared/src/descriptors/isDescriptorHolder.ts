import isFosciaType from '@foscia/shared/checks/isFosciaType';
import { SYMBOL_DESCRIPTOR_HOLDER } from '@foscia/shared/descriptors/makeDescriptorHolder';
import { DescriptorHolder } from '@foscia/shared/descriptors/types';

/**
 * Check if value is a descriptor holder.
 *
 * @param value
 *
 * @internal
 */
export default (
  value: unknown,
): value is DescriptorHolder => isFosciaType(value, SYMBOL_DESCRIPTOR_HOLDER);
