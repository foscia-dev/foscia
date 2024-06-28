import { ModelRawSetup, ModelSetup } from '@foscia/core/model/types';
import { wrap } from '@foscia/shared';

export default <D extends {} = {}>(rawSetup?: ModelRawSetup<D>) => ({
  boot: [...wrap(rawSetup?.boot)],
  init: [...wrap(rawSetup?.init)],
} as ModelSetup<D>);
