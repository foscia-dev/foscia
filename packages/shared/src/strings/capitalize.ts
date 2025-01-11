/**
 * Convert the first char of a string to upper case and remaining to lower case.
 *
 * @param value
 *
 * @internal
 */
export default (value: string) => `${value.charAt(0).toUpperCase()}${value.slice(1).toLowerCase()}`;
