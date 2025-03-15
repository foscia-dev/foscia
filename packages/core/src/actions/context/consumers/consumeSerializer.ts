import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeSerializer } from '@foscia/core/actions/types';

/**
 * Retrieve the serializer from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'serializer', ConsumeSerializer>('serializer');
