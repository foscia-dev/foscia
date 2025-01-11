import capitalize from '@foscia/shared/strings/capitalize';
import toCase from '@foscia/shared/strings/toCase';

/**
 * Convert a string to camel case.
 *
 * @param value
 *
 * @internal
 */
export default /* @__PURE__ */ toCase((w, i) => (
  i ? capitalize(w.toLowerCase()) : w.toLowerCase()
), '');
