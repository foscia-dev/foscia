import mergeHooks from '@foscia/core/hooks/mergeHooks';
import { Hookable } from '@foscia/core/hooks/types';
import applyDefinition from '@foscia/core/model/composition/applyDefinition';
import makeComposableFactory from '@foscia/core/model/composition/makeComposableFactory';
import makeDefinition from '@foscia/core/model/composition/makeDefinition';
import {
  ModelComposable,
  ModelComposableFactory,
  ModelHooksDefinition,
  ModelInstance,
  ModelParsedFlattenDefinition,
} from '@foscia/core/model/types';

const makeComposable: {
  /**
   * Create a composable with a static definition.
   *
   * @param rawDefinition
   *
   * @category Factories
   *
   * @example
   * ```typescript
   * import { makeComposable } from '@foscia/core';
   *
   * const taggable = makeComposable({
   *   tags: hasMany(() => Tag),
   * });
   *
   * export default class Post extends makeModel('posts', {
   *   // Produces a "to many" `tags` relation.
   *   taggable,
   * }) {}
   * ```
   */<D extends {}>(
    rawDefinition: D & ThisType<ModelInstance<ModelParsedFlattenDefinition<D>>>,
  ): ModelComposableFactory<ModelComposable & {
    readonly _type: ModelParsedFlattenDefinition<D>;
  }> & Hookable<ModelHooksDefinition>;
  /**
   * Create a composable with a dynamic definition.
   *
   * @param rawDefinitionFactory
   *
   * @category Factories
   *
   * @experimental
   *
   * @example
   * ```typescript
   * import { makeComposable } from '@foscia/core';
   *
   * type ImageableDefinition<K extends string> =
   *   & Record<K, ModelRelationFactory<Image, false>>
   *   & Record<`${K}URL`, ModelAttributeFactory<string, true>>;
   *
   * interface Imageable extends ModelComposable {
   *   readonly _type: ImageableDefinition<this['key']>;
   * }
   *
   * const imageable = makeComposable<Imageable>(({ key }) => ({
   *   [key]: hasOne(() => Image),
   *   [`${key}URL`]: attr(() => '', { readOnly: true }),
   * }));
   *
   * export default class Post extends makeModel('posts', {
   *   // Produces a "to one" `image` relation and a string `imageURL` attribute.
   *   image: imgeable,
   * }) {}
   * ```
   */<C extends ModelComposable>(
    rawDefinitionFactory: (composable: C) => {},
  ): ModelComposableFactory<C> & Hookable<ModelHooksDefinition>;
} = (
  rawDefinition: {} | ((composable: ModelComposable) => {}),
) => makeComposableFactory<ModelComposable, Hookable<ModelHooksDefinition>>({
  bind: (composable) => {
    applyDefinition(composable.parent, makeDefinition(
      typeof rawDefinition === 'function' ? rawDefinition(composable) : rawDefinition,
    ));
    // eslint-disable-next-line no-param-reassign
    composable.parent.$hooks = mergeHooks(composable.parent.$hooks!, composable.factory.$hooks!);
  },
  properties: {
    $hooks: {},
  },
});

export default makeComposable;
