import makeExtension from '@foscia/core/actions/extensions/makeExtension';
import { Action, ContextRunner } from '@foscia/core/actions/types';
import { Dictionary } from '@foscia/shared';

/**
 Takes a dictionary of runners and returns an extension providing
 those runners features.
 *
 * @param runnersMap
 *
 * @todo This function returns value should be generically typed.
 */
export default function makeRunnersExtension<
  R extends Dictionary<(...args: any[]) => ContextRunner<any, any, any>> = {},
>(runnersMap: R) {
  return makeExtension(
    Object.entries(runnersMap).reduce((extension, [key, runner]) => {
      Object.assign(extension, {
        [key](this: Action<any>, ...args: any[]) {
          return this.run(runner(...args));
        },
      });

      return extension;
    }, {}),
  );
}
