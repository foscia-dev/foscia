import { ApplyPlugins, Plugin } from '@foscia/core/new/shared/plugins/types';

export default function applyPlugins<Input, Plugins extends Plugin<Input, any>>(
  input: Input,
  plugins: Plugins[],
): ApplyPlugins<Input, Plugins> {
  return plugins.reduce((enhancedInput, plugin) => plugin(enhancedInput), input as any);
}
