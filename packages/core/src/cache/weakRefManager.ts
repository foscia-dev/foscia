import { RefManager } from '@foscia/core/cache/types';
import { ModelInstance } from '@foscia/core/model/types';

export default {
  ref: (instance: ModelInstance) => new WeakRef(instance),
  value: (ref: WeakRef<ModelInstance>) => ref.deref(),
} as RefManager<WeakRef<ModelInstance>>;
