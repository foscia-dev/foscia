import { Attribute } from '@foscia/core/new/entities/properties/types';
import { AnySchemaFragment } from '@foscia/core/new/entities/types';

export default function attr() {
  return <T, Schema extends AnySchemaFragment>(
    target: undefined,
    // TODO Only T if schema has attributesPlugin.
    context: ClassFieldDecoratorContext<Schema, T | Attribute<T>>,
  ) => {
    context.addInitializer(function init() {
      const defaultValue = context.access.has(this)
        ? context.access.get(this)
        : undefined;

      Reflect.deleteProperty(this, context.name);

      Reflect.defineProperty(this, context.name, {
        value: {
          // TODO Create property on this.
        },
      });
    });
  };
}
