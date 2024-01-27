import { Model } from '@foscia/core/model/types';
import { RegistryI } from '@foscia/core/types';
import { Awaitable, Dictionary, Optional, Transformer } from '@foscia/shared';

export type ModelFunctionResolver = () => Awaitable<Model>;

export type ModelObjectResolver = {
  type?: string;
  resolve: ModelFunctionResolver;
};

export type MapRegistryModelRegistration =
  | Model
  | ModelFunctionResolver
  | ModelObjectResolver;

export type MapRegistryModelsRegistration =
  | MapRegistryModelRegistration[]
  | Dictionary<ModelFunctionResolver>;

export type MapRegistryConfig = {
  normalizeType?: Optional<Transformer<string>>;
};

export interface MapRegistry extends RegistryI {
  register: (models: MapRegistryModelsRegistration) => void;
  registerModel: (model: MapRegistryModelRegistration) => void;
}
