import type { AnonymousEnhancer, ConsumeModel } from '@foscia/core/actions/types';
import {
  InferModelInstance,
  InferRelatedInstance,
  Model,
  ModelInstance,
  ModelKey,
  ModelRelationProp,
  ModelRelationDotKey,
  ModelRelationKey,
} from '@foscia/core/models/types';
import {
  Arrayable,
  IfAny,
  PrefixRecordKeys,
  Prev,
  RecordEntry,
  UnionToIntersection,
} from '@foscia/shared';

export type * from '@foscia/core/relations/loaders/types';

/**
 * Possible include object for direct relations,
 * with behavior compliance (already callback loaded relations are disallowed).
 *
 * @internal
 */
export type IncludeStrictDirectRelation<K extends string, T> =
  & Partial<Record<K, AnonymousEnhancer<ConsumeModel<T>>>>
  & Record<`${K}.${string}`, never>;

/**
 * Possible include object for nested relations,
 * with behavior compliance (already callback loaded relations are disallowed).
 *
 * @internal
 */
export type IncludeStrictNestedRelations<K extends string, T, Depth extends number> =
  & Partial<Record<K, null>>
  & PrefixRecordKeys<IncludeObjectCallbacks<T, Prev[Depth]>, `${K}.`>;

/**
 * Possible include object for direct or nested relations,
 * with behavior compliance (already callback loaded relations are disallowed).
 *
 * @internal
 */
export type IncludeStrictRelations<K extends string, T, Depth extends number> =
  | IncludeStrictDirectRelation<K, T>
  | IncludeStrictNestedRelations<K, T, Depth>;

/**
 * Include object for any relations under given key.
 *
 * @internal
 */
export type IncludeAnyRelations<K extends string> =
  Record<K | `${K}.${string}`, null | AnonymousEnhancer<ConsumeModel<ModelInstance>>>;

/**
 * Include object for a model
 * with behavior compliance (already callback loaded relations are disallowed).
 *
 * @internal
 */
export type IncludeObjectCallbacks<M, Depth extends number = 5> =
  [Depth] extends [0]
    ? never
    : ModelKey<M> extends infer K
      ? K extends ModelRelationKey<M>
        ? IncludeStrictRelations<K, InferRelatedInstance<InferModelInstance<M>[K]>, Depth>
        : K extends ModelKey<M>
          ? IfAny<InferModelInstance<M>[K], IncludeAnyRelations<K>, never>
          : never
      : never;

/**
 * Possible include object for direct or nested relations,
 * without behavior compliance (already callback loaded relations are allowed).
 *
 * @internal
 */
export type IncludePermissiveRelations<K extends string, T, Depth extends number> =
  | Record<K, AnonymousEnhancer<ConsumeModel<T>> | null>
  | PrefixRecordKeys<IncludePermissiveCallbacks<T, Prev[Depth]>, `${K}.`>;

/**
 * Include object for a model
 * without behavior compliance (already callback loaded relations are allowed).
 *
 * @internal
 */
export type IncludePermissiveCallbacks<M, Depth extends number = 5> =
  [Depth] extends [0]
    ? never
    : ModelKey<M> extends infer K
      ? K extends ModelRelationKey<M>
        ? IncludePermissiveRelations<K, InferRelatedInstance<InferModelInstance<M>[K]>, Depth>
        : K extends ModelKey<M>
          ? IfAny<InferModelInstance<M>[K], IncludeAnyRelations<K>, never>
          : never
      : never;

/**
 * Include entry (relation/callback pair) for a model.
 *
 * @internal
 *
 * @see https://github.com/microsoft/TypeScript/pull/60434
 */
export type IncludeEntryCallback<M, Depth extends number = 5> =
  RecordEntry<UnionToIntersection<IncludePermissiveCallbacks<M, Depth>>>;

/**
 * Raw include definition given to some Foscia features, such as
 * {@link include | `include`} or {@link load | `load`}.
 *
 * @internal
 */
export type RawInclude<M = Model, Depth extends number = 5> =
  | Arrayable<ModelRelationDotKey<M, Depth>>
  | (ModelRelationDotKey<M, Depth> | IncludeEntryCallback<M, Depth>)[]
  | IncludeObjectCallbacks<M, Depth>
  | ParsedIncludeMap;

/**
 * Raw include options to customize relations behaviors.
 *
 * @internal
 */
export type RawIncludeOptions = {
  /**
   * Tells to ignore relation default sub query.
   */
  withoutQuery?: boolean;
  /**
   * Tells to ignore relation default sub include.
   */
  withoutInclude?: boolean;
};

/**
 * Raw include intermediary definition configured to apply (or not)
 * relation sub query and include when parsing.
 *
 * @internal
 */
export type ParsedRawInclude = ParsedIncludeMap | {
  /**
   * The original raw include.
   */
  include: RawInclude;
  /**
   * The options to use.
   */
  options: RawIncludeOptions;
};

/**
 * Parsed include query enhancer.
 *
 * @internal
 */
export type ParsedIncludeQuery = AnonymousEnhancer<ConsumeModel, any>;

/**
 * Parsed {@link RawInclude | `RawInclude`} for a dedicated relation.
 *
 * @internal
 */
export type ParsedInclude = {
  /**
   * Tells if the relation was explicitly requested or if it is just an
   * intermediary layer between included relations.
   */
  requested: boolean;
  /**
   * The resolved models the relation target.
   */
  models: Model[];
  /**
   * The nested include map for sub-relations.
   */
  include: ParsedIncludeMap;
  /**
   * Custom callback for the relation query.
   */
  customQuery: ParsedIncludeQuery | null;
  /**
   * Relation default callback for the relation query.
   */
  relationQuery: ParsedIncludeQuery | null;
};

/**
 * Parsed {@link RawInclude | `RawInclude`} relations tree.
 *
 * @internal
 */
export type ParsedIncludeMap = Map<ModelRelationProp, ParsedInclude>;
// TODO Add support for special include (aggregate, etc.):
//  `& Map<ModelAttribute, ParsedValueInclude>`
