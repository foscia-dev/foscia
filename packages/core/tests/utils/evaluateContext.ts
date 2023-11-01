import { context, ContextEnhancer } from '@foscia/core';
import makeFakeAction from '../mocks/makeFakeAction.mock';

export default function evaluateContext(
  callback: ContextEnhancer<any, {}, any>,
  initial?: any,
): Promise<any> {
  return makeFakeAction()
    .use(context(initial ?? {}))
    .use(callback as any)
    .useContext();
}
