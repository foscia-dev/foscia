import { Dictionary } from '@foscia/shared/types';

/**
 * Abstract definition of a REST record.
 *
 * @internal
 */
export type RestAbstractResource = Dictionary<unknown> & {
  type?: string;
};

/**
 * Abstract definition of a new REST record.
 *
 * @internal
 */
export type RestNewResource = RestAbstractResource & {
  id?: unknown;
};

/**
 * Abstract definition of a new REST record.
 *
 * @internal
 */
export type RestResource = RestAbstractResource & {
  id: unknown;
};
