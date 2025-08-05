import { UnionToIntersection } from '@foscia/shared';

/**
 * Private key for plugin's input type witness.
 *
 * @internal
 */
export declare const PLUGIN_INPUT: unique symbol;

/**
 * Private key for plugin's output type witness.
 */
export declare const PLUGIN_OUTPUT: unique symbol;

/**
 * Plugin to add additional features to an object.
 *
 * @typeParam Input The object it may be applied to.
 * @typeParam Output The additional features typing (without original input typing).
 *
 * @remarks
 * Plugins support generic features based on input with higher kinded types (see example).
 * Plugins should not overlap with each others (e.g. two plugins with different typings
 * for the same property), because resulting type is not guaranteed.
 *
 * @example
 * Providing a specific typing to the consumed object.
 * ```
 * import { Plugin } from '@foscia/core';
 *
 * type ExamplePluginOutput = {
 *   doSomething(): void;
 * };
 *
 * type ExamplePlugin = Plugin<object, ExamplePluginOutput>;
 * ```
 *
 * @example
 * Providing a generic typing to the consumed object.
 * ```
 * import { Plugin, PluginInput, PLUGIN_OUTPUT } from '@foscia/core';
 *
 * type ExamplePluginOutput<T extends object> = {
 *   doSomethingOnProperty(property: keyof T): void;
 * };
 *
 * interface GenericExamplePlugin extends Plugin<object> {
 *   readonly [PLUGIN_OUTPUT]: ExamplePluginOutput<PluginInput<this>>;
 * }
 * ```
 *
 * @internal
 */
export interface Plugin<
  Input = unknown,
  Output = unknown,
> {
  /**
   * Input type witness.
   *
   * @internal
   */
  readonly [PLUGIN_INPUT]: Input;
  /**
   * Output type witness.
   */
  readonly [PLUGIN_OUTPUT]: Output;

  /**
   * Apply the plugin to the given input.
   *
   * @param input
   */
  (
    input: this[typeof PLUGIN_INPUT],
  ): ApplyPlugins<Input, Plugin<Input, this[typeof PLUGIN_OUTPUT]>>;
}

/**
 * Resolve a plugin's input type.
 */
export type PluginInput<P extends Plugin<any, any>> = P[typeof PLUGIN_INPUT];

/**
 * Resolve plugins output type.
 *
 * @internal
 */
export type PluginsOutput<Input, Plugins extends Plugin<Input, any>, DefaultOutput = never> =
  [Plugins] extends [never]
    ? DefaultOutput
    : (Plugins & { [PLUGIN_INPUT]: Input; })[typeof PLUGIN_OUTPUT];

/**
 * Apply plugins typings if it matches a given plugin typing, otherwise keep input as is.
 *
 * @internal
 */
export type ApplyPlugins<Input, Plugins extends Plugin<Input, any>> =
  & Omit<Input, keyof UnionToIntersection<PluginsOutput<Input, Plugins, unknown>>>
  & UnionToIntersection<PluginsOutput<Input, Plugins, unknown>>;
