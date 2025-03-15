/**
 * Generate a unique ID using generator.
 *
 * @param generator
 * @param notIds
 *
 * @internal
 */
const uniqueId = (
  generator: () => string,
  notIds: string[],
): string => {
  const newId = generator();

  return notIds.indexOf(newId) !== -1 ? uniqueId(generator, notIds) : newId;
};

export default uniqueId;
