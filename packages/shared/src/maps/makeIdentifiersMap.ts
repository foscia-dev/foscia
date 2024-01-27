export default function makeIdentifiersMap<Type, Id, T>() {
  const values: Map<Type, Map<Id, T>> = new Map();

  const find = (type: Type, id: Id) => values.get(type)?.get(id) ?? null;

  const put = (type: Type, id: Id, value: T) => {
    if (!values.get(type)) {
      values.set(type, new Map());
    }

    values.get(type)!.set(id, value);
  };

  const forget = (type: Type, id: Id) => {
    values.get(type)?.delete(id);
  };

  const forgetAll = (type: Type) => {
    values.delete(type);
  };

  const clear = () => {
    values.clear();
  };

  return {
    find,
    put,
    forget,
    forgetAll,
    clear,
  };
}
