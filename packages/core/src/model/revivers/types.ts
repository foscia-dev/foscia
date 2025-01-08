import { ModelInstance } from '@foscia/core/model/types';
import { Dictionary } from '@foscia/shared';

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
 * Reduced (serialized) model snapshot.
 *
 * @internal
 */
export type ReducedModelSnapshot = {
  $FOSCIA_TYPE: 'snapshot';
  $model: ReducedModel;
  $exists: boolean;
  $raw: any;
  $loaded: Dictionary<true>;
  $values: Dictionary;
};

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
export type ReducedModelInstance = {
  $FOSCIA_TYPE: 'instance';
  $model: ReducedModel;
  $ref: string;
  $data?: ReducedModelInstanceData;
  $custom?: ReducedModelInstanceCustomData;
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
 * Reduced (serialized) model instance reference.
 *
 * @internal
 */
export type ReducedModelCircularRef = {
  $FOSCIA_TYPE: 'circular';
  $ref: string;
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
