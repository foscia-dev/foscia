/**
 * Generate a unique ID using generator.
 *
 * @param generator
 * @param notIds
 *
 * @internal
 */
const uniqueId = (generator: () => string, notIds: string[]): string => {
  const id = generator();

  return notIds.indexOf(id) !== -1 ? uniqueId(generator, notIds) : id;
};

export default uniqueId;
