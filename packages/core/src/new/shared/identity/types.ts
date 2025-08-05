import { IDENTITIES_KEY } from '@foscia/core/new/shared/identity/consts';
import { OmitNever } from '@foscia/shared';

/**
 * Unique symbol for identity witness.
 *
 * @internal
 */
declare const IDENTITY_WITNESS: unique symbol;

/**
 * Object identified by one or many identity symbols.
 *
 * @internal
 */
export type Identified<Id extends symbol> =
  & {
    readonly [IDENTITIES_KEY]: Set<symbol>;
  }
  & Record<Id, typeof IDENTITY_WITNESS>;

/**
 * Extract identity symbols union for an identified object.
 *
 * @internal
 */
export type Identity<T extends Identified<symbol>> = {
  [K in keyof T]: K extends symbol ? T[K] extends typeof IDENTITY_WITNESS ? K : never : never;
}[keyof T];

/**
 * Extract type matching a given identity.
 *
 * @internal
 */
export type ExtractByIdentity<V, Id extends symbol> =
  V extends Identified<Id> ? V : never;

/**
 * Pick object properties matching a given identity.
 *
 * @internal
 */
export type PickByIdentity<V extends object, Id extends symbol> = OmitNever<{
  [K in keyof V]: ExtractByIdentity<V[K], Id>;
}>;

/**
 * Filter array items matching a given identity.
 *
 * @internal
 */
export type FilterByIdentity<V extends unknown[], Id extends symbol> =
  ExtractByIdentity<V[number], Id>[];
