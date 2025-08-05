import { Hookable } from '@foscia/core/hooks/types';
import makeComposableFactory from '@foscia/core/models/old/composition/makeComposableFactory';
import makeDefinition from '@foscia/core/models/old/composition/makeDefinition';
import applyDefinition from '@foscia/core/models/old/composition/utilities/applyDefinition';
import {
  ModelComposable,
  ModelComposableFactory,
  ModelHooksDefinition,
  ModelInstance,
  ModelParsedFlattenDefinition,
} from '@foscia/core/models/oldTypes';

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
  },
  factory: {
    $hooks: {},
  },
});

export default makeComposable;
