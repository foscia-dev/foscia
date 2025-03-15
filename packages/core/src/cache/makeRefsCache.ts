import { RefsCache, RefsCacheConfig, RefValue } from '@foscia/core/cache/types';
import parseConnectionType from '@foscia/core/connections/parseConnectionType';
import { ModelIdType, ModelInstance } from '@foscia/core/model/types';
import { Multimap, multimapDelete, multimapGet, multimapSet } from '@foscia/shared';

/**
 * Make a cache using a {@link RefFactory | `RefFactory`} to store cached
 * instances inside {@link RefValue | `RefValue`}.
 *
 * @param config
 *
 * @category Factories
 */
export default (config: RefsCacheConfig): { cache: RefsCache; } => {
  const instances: Multimap<[string, string, ModelIdType], RefValue<ModelInstance>> = new Map();

  const normalizeType = config.normalizeType ?? ((t) => t);
  const normalizeId = config.normalizeId ?? ((v) => v);
  const parseRawType = (rawType: string) => {
    const [connection, type] = parseConnectionType(rawType);

    return [connection, normalizeType(type)] as const;
  };

  return {
    cache: {
      find: async (rawType, id) => {
        const params = [...parseRawType(rawType), normalizeId(id)] as const;
        const ref = multimapGet(instances, params);
        if (ref) {
          const instance = await ref();
          if (instance) {
            return instance;
          }

          multimapDelete(instances, params);
        }

        return null;
      },
      put: async (rawType, id, instance) => multimapSet(
        instances,
        [...parseRawType(rawType), normalizeId(id)],
        await config.makeRef(instance),
      ),
      forget: async (rawType, id) => {
        multimapDelete(instances, [...parseRawType(rawType), normalizeId(id)]);
      },
      forgetAll: async (rawType) => {
        multimapDelete(instances, parseRawType(rawType));
      },
      clear: async () => instances.clear(),
    },
  };
};
