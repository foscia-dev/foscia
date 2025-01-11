import toCase from '@foscia/shared/strings/toCase';

/**
 * Convert a string to kebab case.
 *
 * @param value
 *
 * @internal
 */
export default /* @__PURE__ */ toCase((w) => w.toLowerCase(), '-');
