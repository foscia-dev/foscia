import tap from '@foscia/shared/functions/tap';

/**
 * Group array items into a map using given callback.
 *
 * @param items
 * @param groupBy
 *
 * @internal
 */
export default <T, U>(items: T[], groupBy: (item: T) => U) => items.reduce(
  (entries, item) => tap(entries, () => {
    const group = groupBy(item);

    entries.set(group, [
      ...(entries.get(group) ?? []),
      item,
    ]);
  }),
  new Map<U, T[]>(),
);
