import registerHook from '@foscia/core/hooks/registerHook';
import { InferModelPropType, ModelProp } from '@foscia/core/models/types';

const registerPropertyHook: {
  <P extends ModelProp>(
    prop: P,
    hook: 'read' | 'reading',
    callback: (
      event: {
        instance: InstanceType<P['parent']>;
        prop: P;
        value: InferModelPropType<P>;
      }) => void,
  ): () => void;
  <P extends ModelProp>(
    prop: P,
    hook: 'write' | 'writing',
    callback: (
      event: {
        instance: InstanceType<P['parent']>;
        prop: P;
        prev?: InferModelPropType<P>;
        next: InferModelPropType<P>;
      },
    ) => void,
  ): () => void;
} = (prop, hook, callback) => registerHook(
  prop.parent,
  `property:${hook}:${prop.key}`,
  callback as any,
);

export default registerPropertyHook;
