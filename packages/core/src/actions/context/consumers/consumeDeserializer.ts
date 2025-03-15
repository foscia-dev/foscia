import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeDeserializer } from '@foscia/core/actions/types';

/**
 * Retrieve the deserializer from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'deserializer', ConsumeDeserializer>('deserializer');
