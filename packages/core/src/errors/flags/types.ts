/**
 * Describe an error that should be treated as "not found" by Foscia.
 */
export type NotFoundErrorI = {
  readonly $FOSCIA_ERROR_NOT_FOUND: true;
};
