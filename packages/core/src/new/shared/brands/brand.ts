import { BRAND, Brand } from '@foscia/core/new/shared/brands/types';

export default function brand<B extends symbol, T extends object>(
  brandSymbol: B,
  value: T,
) {
  return Object.assign(value, {
    [BRAND]: brandSymbol,
  }) as Brand<B, T>;
}
