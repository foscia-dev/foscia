import { ModelRawSetup, ModelSetup } from '@foscia/core/model/types';
import { wrap } from '@foscia/shared';

export default function makeModelSetup<D extends {} = {}>(rawSetup?: ModelRawSetup<D>) {
  return {
    boot: [...wrap(rawSetup?.boot)],
    init: [...wrap(rawSetup?.init)],
  } as ModelSetup<D>;
}
