import {
  Model,
  ModelInstance,
  ModelLimitedSnapshot,
  ModelSnapshot,
} from '@foscia/core/model/types';
import { Dictionary } from '@foscia/shared';

/**
 * Objects which have can be dereferenced to a
 * {@link ReducerReferenceable | `ReducerReferenceable`}.
 *
 * @internal
 */
export type ReviverDereferenceable = {
  $ref: string;
};

/**
 * Objects which have can be referenced to a
 * {@link ReviverDereferenceable | `ReviverDereferenceable`}.
 *
 * @internal
 */
export type ReducerReferenceable =
  | ModelInstance
  | ModelSnapshot
  | ModelLimitedSnapshot;

/**
 * Map of parent objects which have been referenced.
 *
 * @internal
 */
export type ReducerParentsMap = Map<ReducerReferenceable, string>;

/**
 * Map of parent objects which have been dereferenced.
 *
 * @internal
 */
export type ReviverParentsMap = Map<string, ReducerReferenceable>;

/**
 * Reduced (serialized) model class.
 *
 * @internal
 */
export type ReducedModel = {
  $FOSCIA_TYPE: 'model';
  $type: string;
};

/**
 * Reduced (serialized) model limited snapshot.
 *
 * @internal
 */
export type ReducedModelLimitedSnapshot =
  & {
    $FOSCIA_TYPE: 'snapshot';
    $instance: ReducedModelInstance | ReducedModelCircularRef;
    $exists: boolean;
    $values: Dictionary;
  }
  & ReviverDereferenceable;

/**
 * Reduced (serialized) model limited snapshot.
 *
 * @internal
 */
export type ReducedModelFullSnapshot =
  & {
    $original: ReducedModelSnapshot | ReducedModelCircularRef | null;
    $raw: any;
    $loaded: Dictionary<true>;
  }
  & ReducedModelLimitedSnapshot;

/**
 * Reduced (serialized) model snapshot.
 *
 * @internal
 */
export type ReducedModelSnapshot =
  | ReducedModelLimitedSnapshot
  | ReducedModelFullSnapshot;

/**
 * Reduced (serialized) model instance data.
 *
 * @internal
 */
export type ReducedModelInstanceData = {
  $exists: boolean;
  $loaded: Dictionary<true>;
  $values: Dictionary;
  $raw: any;
  $original: ReducedModelSnapshot;
};

/**
 * Reduced (serialized) model instance.
 *
 * @internal
 */
export type ReducedModelInstance =
  & {
    $FOSCIA_TYPE: 'instance';
    $model: ReducedModel;
    $data?: ReducedModelInstanceData;
    $custom?: ReducedModelInstanceCustomData;
  }
  & ReviverDereferenceable;

/**
 * Reduced (serialized) value reference.
 *
 * @internal
 */
export type ReducedModelCircularRef = {
  $FOSCIA_TYPE: 'circular';
  $ref: string;
};

/**
 * Reduced (serialized) model instance custom data.
 */
export type ReducedModelInstanceCustomData = {
  /**
   * Contains the instance data reduced using `tools.data(instance)`.
   * This provides Foscia data override.
   */
  $data?: ReducedModelInstanceData;
};

/**
 * Tools functions available when reducing an instance.
 */
export type ModelReduceTools = {
  /**
   * Reduce an instance into a reduced instance or instance reference.
   *
   * @param instance
   */
  reduce: (instance: ModelInstance) => ReducedModelInstance | ReducedModelCircularRef;
  /**
   * Reduce an instance default `$data`.
   *
   * @param instance
   */
  data: (instance: ModelInstance) => { $data: ReducedModelInstanceData; };
};

/**
 * Tools functions available when reviving an instance.
 */
export type ModelReviveTools = {
  /**
   * Revive an instance or an instance's reference.
   *
   * @param instance
   */
  revive: (instance: ReducedModelInstance | ReducedModelCircularRef) => ModelInstance;
};

/**
 * Model which can reduce and revive using custom implementations.
 */
export type ModelCanReduceRevive<T extends ReducedModelInstanceCustomData = any> = {
  /**
   * Reduce the instance data.
   *
   * @param tools
   */
  $reduce(tools: ModelReduceTools): T;
  /**
   * Revive the instance data.
   *
   * @param customData
   * @param tools
   */
  $revive(customData: T, tools: ModelReviveTools): void;
};

/**
 * Config for the models reviver.
 */
export type ModelsReviverConfig = {
  models: Model[];
  revive?: (value: unknown) => unknown;
};

/**
 * Config for the models reducer.
 */
export type ModelsReducerConfig = {
  reduce?: (value: unknown) => unknown;
};
