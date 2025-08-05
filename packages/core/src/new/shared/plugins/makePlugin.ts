import FosciaError from '@foscia/core/errors/fosciaError';
import { Plugin } from '@foscia/core/new/shared/plugins/types';

export default function makePlugin<Input, Output>(
  applyPlugin: (input: Input) => void,
  verifyInput?: (value: unknown) => value is Input,
) {
  return ((input: unknown) => {
    if (verifyInput && !verifyInput(input)) {
      throw new FosciaError('TODO');
    }

    applyPlugin(input as Input);
  }) as Plugin<Input, Output>;
}
