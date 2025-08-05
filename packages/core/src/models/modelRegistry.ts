import parseConnectionType from '@foscia/core/connections/parseConnectionType';
import { Model } from '@foscia/core/models/types';
import { Dictionary, makeMultimap } from '@foscia/shared/index';

const makeModelRegistry = () => {
  const normalizeKey = (type: string) => {
    const connectionType = parseConnectionType(type);

    return {
      $connection: connectionType.connection,
      $type: connectionType.type,
    };
  };

  const instances = makeMultimap<Dictionary<string>, Model>();

  return {
    get: (type: string) => instances.get(normalizeKey(type)),
    set: (model: Model) => instances.set({
      $connection: model.$connection,
      $type: model.$type,
    }, model),
  };
};

const modelRegistry = makeModelRegistry();

export default modelRegistry;
