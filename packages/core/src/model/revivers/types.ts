import { ModelInstance } from '@foscia/core/model/types';
import { Dictionary } from '@foscia/shared';

/**
 * Reduced (serialized) model class.
 */
export type ReducedModel = {
  $FOSCIA_TYPE: 'model';
  $type: string;
};

/**
 * Reduced (serialized) model snapshot.
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
 */
export type ReducedModelInstanceData = {
  $exists: boolean;
  $loaded: Dictionary<true>;
  $values: Dictionary;
  $raw: any;
  $original: ReducedModelSnapshot;
};

/**
 * Reduced (serialized) model instance custom data.
 */
export type ReducedModelInstanceCustomData = {
  $data?: ReducedModelInstanceData;
};

/**
 * Reduced (serialized) model instance.
 */
export type ReducedModelInstance = {
  $FOSCIA_TYPE: 'instance';
  $model: ReducedModel;
  $ref: string;
  $data?: ReducedModelInstanceData;
  $custom?: ReducedModelInstanceCustomData;
};

/**
 * Reduced (serialized) model instance reference.
 */
export type ReducedModelCircularRef = {
  $FOSCIA_TYPE: 'circular';
  $ref: string;
};

/**
 * Tools functions available when reducing an instance.
 */
export type ModelReduceTools = {
  reduce: (instance: ModelInstance) => ReducedModelInstance | ReducedModelCircularRef;
  data: (instance: ModelInstance) => { $data: ReducedModelInstanceData; };
};

/**
 * Tools functions available when reviving an instance.
 */
export type ModelReviveTools = {
  revive: (instance: ReducedModelInstance | ReducedModelCircularRef) => ModelInstance;
};

/**
 * Model which can reduce and revive using custom implementations.
 */
export type ModelCanReduceRevive<T extends ReducedModelInstanceCustomData = any> = {
  $reduce(tools: ModelReduceTools): T;
  $revive(customData: T, tools: ModelReviveTools): void;
};
