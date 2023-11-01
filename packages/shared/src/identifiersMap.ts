export default class IdentifiersMap<Type, Id, T> {
  private readonly valuesByTypes: Map<Type, Map<Id, T>>;

  public constructor() {
    this.valuesByTypes = new Map();
  }

  public get(type: Type, id: Id) {
    const values = this.valuesByTypes.get(type);

    return values?.get(id) ?? null;
  }

  public set(type: Type, id: Id, value: T) {
    let values = this.valuesByTypes.get(type);
    if (!values) {
      values = new Map();
      this.valuesByTypes.set(type, values);
    }

    values.set(id, value);
  }

  public delete(type: Type, id: Id) {
    this.valuesByTypes.get(type)?.delete(id);
  }

  public deleteAll(type: Type) {
    this.valuesByTypes.delete(type);
  }

  public clear() {
    this.valuesByTypes.clear();
  }
}
