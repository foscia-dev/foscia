import isModel from '@foscia/core/model/checks/isModel';
import { Model } from '@foscia/core/model/types';
import {
  MapRegistry,
  MapRegistryConfig,
  MapRegistryModelRegistration,
  MapRegistryModelsRegistration,
  ModelObjectResolver,
} from '@foscia/core/registry/types';
import { wrap } from '@foscia/shared';

/**
 * Make a {@link RegistryI} implementation allowing multiple resolve
 * capabilities, such as sync/async models and with/without types.
 *
 * @param config
 */
export default function makeMapRegistryWith(config: MapRegistryConfig): MapRegistry {
  const resolvers = [] as ModelObjectResolver[];
  const modelsMap = new Map<string, Model>();

  const normalizeRawType = config.normalizeType ?? ((t) => t);

  const resolveModelWithType = async (type: string) => {
    const typedResolver = resolvers.find((r) => r.type === type);

    return typedResolver ? typedResolver.resolve() : null;
  };

  const resolveModelsWithoutType = async () => Promise.all(resolvers.map((r) => r.resolve()));

  const markModelsResolved = async (models: Model[]) => models.forEach((model) => {
    modelsMap.set(normalizeRawType(model.$type), model);
  });

  const registerModel = (model: MapRegistryModelRegistration) => {
    if (isModel(model)) {
      resolvers.push({
        type: normalizeRawType(model.$type),
        resolve: () => model,
      });
    } else if (typeof model === 'function') {
      resolvers.push({
        resolve: model,
      });
    } else {
      resolvers.push({
        type: model.type ? normalizeRawType(model.type) : undefined,
        resolve: model.resolve,
      });
    }
  };

  const register = (models: MapRegistryModelsRegistration) => {
    if (Array.isArray(models)) {
      models.forEach(
        (model) => registerModel(model),
      );
    } else {
      Object.entries(models).forEach(
        ([type, model]) => registerModel({ type, resolve: model }),
      );
    }
  };

  const modelFor = async (rawType: string) => {
    const type = normalizeRawType(rawType);

    if (!modelsMap.has(type)) {
      await markModelsResolved(wrap(
        await resolveModelWithType(type) ?? await resolveModelsWithoutType(),
      ));
    }

    return modelsMap.get(type) ?? null;
  };

  return {
    modelFor,
    register,
    registerModel,
  };
}
