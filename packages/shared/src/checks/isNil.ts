/**
 * Check if value is `undefined` or `null`.
 *
 * @param value
 *
 * @internal
 */
export default (value: unknown): value is undefined | null => value === undefined || value === null;
