import { RecordEntry } from '@foscia/shared/types';

/**
 * Alias of `Object.entries()` preserving key typing in a trusted context.
 *
 * @param value
 *
 * @internal
 */
export default function trustedEntries<O extends {}>(value: O) {
  return Object.entries(value) as RecordEntry<O>[];
}
