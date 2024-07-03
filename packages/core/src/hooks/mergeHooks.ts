import { HooksDefinition, HooksRawRegistrar, HooksRegistrar } from '@foscia/core/hooks/types';
import { mapWithKeys, wrap } from '@foscia/shared';

export default <D extends HooksDefinition>(
  prevHooks?: HooksRawRegistrar<D>,
  nextHooks?: HooksRawRegistrar<D>,
) => mapWithKeys(Object.keys({ ...(prevHooks ?? {}), ...(nextHooks ?? {}) }), (key) => ({
  [key]: [...wrap(prevHooks?.[key]), ...wrap(nextHooks?.[key])],
})) as HooksRegistrar<D>;
