import { FinalEntitySchema } from '@foscia/core/newModels/types';

export default function attr() {
  return <T, Schema>(
    target: undefined,
    context: ClassFieldDecoratorContext<Schema, T>,
  ): void => undefined;
}
