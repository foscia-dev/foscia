import { RefManager } from '@foscia/core/cache/types';
import { ModelInstance } from '@foscia/core/model/types';

const weakRefManager: RefManager<WeakRef<ModelInstance>> = {
  ref: (instance: ModelInstance) => new WeakRef(instance),
  value: (ref: WeakRef<ModelInstance>) => ref.deref(),
};

export default weakRefManager;
