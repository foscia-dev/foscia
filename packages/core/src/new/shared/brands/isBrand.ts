import { BRAND, Brand, WITNESS } from '@foscia/core/new/shared/brands/types';

export default function isBrand<T extends Brand<any, unknown>>(
  brandSymbol: T,
  value: unknown,
): value is T[typeof WITNESS] {
  return !!value
    && (typeof value === 'object' || typeof value === 'function')
    && BRAND in value
    && value[BRAND] === brandSymbol;
}
