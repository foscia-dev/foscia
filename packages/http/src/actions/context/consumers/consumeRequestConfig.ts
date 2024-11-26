import { consumeContext } from '@foscia/core';
import { ConsumeHttpRequestConfig } from '@foscia/http/types';

/**
 * Consume the configured request.
 *
 * @param context
 * @param defaultValue
 */
export default <C extends {}, D = never>(
  context: C & Partial<ConsumeHttpRequestConfig>,
  defaultValue?: D,
) => consumeContext(context, 'httpRequestConfig', ['configureRequest'], defaultValue);
