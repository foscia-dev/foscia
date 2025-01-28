/**
 * Create an identifiers map object.
 *
 * @internal
 */
export default <Type, Id, T>() => {
  const values: Map<Type, Map<Id, T>> = new Map();

  return {
    all: () => [...values.values()].map((v) => [...v.values()]).flat(),
    find: (type: Type, id: Id) => values.get(type)?.get(id) ?? null,
    put: (type: Type, id: Id, value: T) => {
      if (!values.get(type)) {
        values.set(type, new Map());
      }

      values.get(type)!.set(id, value);
    },
    forget: (type: Type, id: Id) => {
      values.get(type)?.delete(id);
    },
    forgetAll: (type: Type) => {
      values.delete(type);
    },
    clear: () => {
      values.clear();
    },
  };
};
