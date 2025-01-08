import { context, ContextEnhancer, makeActionFactory } from '@foscia/core';

export default function evaluateContext(
  callback: ContextEnhancer<any, any>,
  initial?: any,
): Promise<any> {
  return makeActionFactory()()
    .use(context(initial ?? {}))
    .use(callback as any)
    .useContext();
}
