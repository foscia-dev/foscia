import type { DescriptorHolder } from '@foscia/shared/descriptors/types';

/**
 * Symbol for the descriptor holder.
 *
 * @internal
 */
export const SYMBOL_DESCRIPTOR_HOLDER = Symbol('foscia: descriptor holder');

/**
 * Create a descriptor holder.
 *
 * @param descriptor
 *
 * @internal
 */
export default (descriptor: PropertyDescriptor) => ({
  $FOSCIA_TYPE: SYMBOL_DESCRIPTOR_HOLDER,
  descriptor,
}) as DescriptorHolder;
