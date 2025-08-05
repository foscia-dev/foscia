/**
 * Brand name key unique symbol.
 *
 * @internal
 */
export const BRAND = Symbol();

/**
 * Brand type witness key unique symbol.
 *
 * @internal
 */
export declare const WITNESS: unique symbol;

/**
 * Brand a value.
 *
 * @internal
 */
export type Brand<BrandSymbol extends symbol, T> = T & {
  /**
   * Internal brand of the value.
   *
   * @internal
   */
  [BRAND]: BrandSymbol;
  /**
   * Internal type witness of the value.
   *
   * @internal
   */
  [WITNESS]: T;
};

export type BrandOf<T extends Brand<any, unknown>> = T[typeof BRAND];
