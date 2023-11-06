import context from '@foscia/core/actions/context/enhancers/context';
import makeActionClass from '@foscia/core/actions/makeActionClass';
import { Action } from '@foscia/core/actions/types';

export default function makeActionFactory<Context extends {} = {}, Extensions extends {} = {}>(
  initialContext?: Context,
  extensions?: Extensions,
) {
  const ActionClass = makeActionClass(extensions);

  return () => new ActionClass().use(context(initialContext ?? {})) as Action<Context, Extensions>;
}
