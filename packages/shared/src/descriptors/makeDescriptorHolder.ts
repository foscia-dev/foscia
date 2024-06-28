import type { DescriptorHolder } from '@foscia/shared/descriptors/types';

export const SYMBOL_DESCRIPTOR_HOLDER = Symbol('foscia: descriptor holder');

export default <T>(descriptor: PropertyDescriptor) => ({
  $FOSCIA_TYPE: SYMBOL_DESCRIPTOR_HOLDER,
  descriptor,
}) as DescriptorHolder<T>;
