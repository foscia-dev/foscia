import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { CacheI } from '@foscia/core/types';
import { Awaitable, Optional, Transformer } from '@foscia/shared';

export type RefManager<R> = {
  ref(instance: ModelInstance): Awaitable<R>;
  value(ref: R): Awaitable<ModelInstance | undefined>;
};

export type RefsCacheConfig<R = unknown> = {
  manager: RefManager<R>;
  normalizeId?: Optional<Transformer<ModelIdType>>;
};

export interface RefsCache extends CacheI {
}
