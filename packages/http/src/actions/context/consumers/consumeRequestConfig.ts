import { makeContextConsumer } from '@foscia/core';
import { ConsumeHttpRequestConfig } from '@foscia/http/types';

/**
 * Consume the configured request.
 *
 * @param context
 * @param defaultValue
 *
 * @internal
 */
export default /* @__PURE__ */ makeContextConsumer<'httpRequestConfig', ConsumeHttpRequestConfig>('httpRequestConfig');
