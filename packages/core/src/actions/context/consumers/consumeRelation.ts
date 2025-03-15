import makeContextConsumer from '@foscia/core/actions/context/consumers/makeContextConsumer';
import { ConsumeRelation } from '@foscia/core/actions/types';

/**
 * Retrieve the relation from a context.
 *
 * @param context
 * @param defaultValue
 */
export default /* @__PURE__ */ makeContextConsumer<'relation', ConsumeRelation>('relation');
