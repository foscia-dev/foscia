import type { SYMBOL_DESCRIPTOR_HOLDER } from '@foscia/shared/descriptors/makeDescriptorHolder';
import type { FosciaObject, WritableKeys } from '@foscia/shared/types';

/**
 * Type to hold a property descriptor specificities.
 *
 * @internal
 */
export type DescriptorHolder<T = unknown, R extends boolean = boolean> = {
  descriptor: PropertyDescriptor;
  /**
   * Stores the value typing for type resolution.
   *
   * @ignore
   */
  _type: T;
  /**
   * Stores the readonly state for type resolution.
   *
   * @ignore
   */
  _readOnly: R;
} & FosciaObject<typeof SYMBOL_DESCRIPTOR_HOLDER>;

/**
 * Type a descriptor holder an object property.
 *
 * @internal
 */
export type DescriptorHolderOf<T, K extends keyof T> =
  DescriptorHolder<T[K], K extends WritableKeys<T> ? false : true>;

/**
 * Restore the property typing for a descriptor holder.
 *
 * @internal
 */
export type RestoreDescriptorHolder<D, K extends PropertyKey, U = {}> =
  D extends DescriptorHolder<infer T, infer R>
    ? R extends false ? Record<K, T> : Readonly<Record<K, T>>
    : U;
