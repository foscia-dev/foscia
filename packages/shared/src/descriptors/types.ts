import type { SYMBOL_DESCRIPTOR_HOLDER } from '@foscia/shared/descriptors/makeDescriptorHolder';
import { FosciaObject } from '@foscia/shared/types';

/**
 * Type and descriptor holder for custom properties.
 */
export type DescriptorHolder<T = unknown> = {
  descriptor: PropertyDescriptor;
  __type__: T;
} & FosciaObject<typeof SYMBOL_DESCRIPTOR_HOLDER>;
