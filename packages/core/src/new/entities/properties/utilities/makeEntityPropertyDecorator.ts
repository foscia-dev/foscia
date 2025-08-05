import { ENTITY_PROPERTY } from '@foscia/core/new/entities/properties/consts';
import { AnySchemaFragment, EntityRecord } from '@foscia/core/new/entities/types';
import identify from '@foscia/core/new/shared/identity/identify';

export default function makeEntityPropertyDecorator<
  T,
  Schema extends AnySchemaFragment,
>() {
  return (
    _target: undefined,
    context: ClassFieldDecoratorContext<Schema, T> & { static: false; private: false; },
  ) => {
    context.addInitializer(function init() {
      const defaultValue = context.access.has(this)
        ? context.access.get(this)
        : undefined;

      Reflect.deleteProperty(this, context.name);
      Reflect.defineProperty(this, context.name, {
        value: identify(ENTITY_PROPERTY, {
          setup(record: EntityRecord) {
            Reflect.defineProperty(record, context.name, {
              value: defaultValue,
              enumerable: true,
              writable: true,
              configurable: false,
            });
          },
        }),
      });
    });
  };
}
