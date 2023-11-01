import { consumeContext } from '@foscia/core';
import { ConsumeHttpRequestConfig } from '@foscia/http/types';

export default function consumeRequestConfig<C extends {}, D = never>(
  context: C & Partial<ConsumeHttpRequestConfig>,
  defaultValue?: D,
) {
  return consumeContext(context, 'httpRequestConfig', ['configureRequest'], defaultValue);
}
