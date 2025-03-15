import { ModelPropSync } from '@foscia/core/model/types';
import { ObjectTransformer } from '@foscia/core/transformers/types';

/**
 * Make a property factory's modifiers.
 *
 * @internal
 */
export default () => ({
  transform: (transformer: ObjectTransformer<any>) => ({ transformer }),
  alias: (alias: string) => ({ alias }),
  sync: (sync: boolean | ModelPropSync) => ({ sync }),
});
