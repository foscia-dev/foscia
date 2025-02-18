import { context, AnonymousEnhancer, makeActionFactory } from '@foscia/core';

export default function evaluateContext(
  callback: AnonymousEnhancer<any, any>,
  initial?: any,
): Promise<any> {
  return makeActionFactory()()
    .use(context(initial ?? {}))
    .use(callback as any)
    .useContext();
}
