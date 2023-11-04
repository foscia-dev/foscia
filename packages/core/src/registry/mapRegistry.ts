import isModel from '@foscia/core/model/checks/isModel';
import { Model } from '@foscia/core/model/types';
import {
  MapRegistryConfig,
  MapRegistryModelRegistration,
  MapRegistryModelsRegistration,
  ModelObjectResolver,
} from '@foscia/core/registry/types';
import { RegistryI } from '@foscia/core/types';
import { applyConfig, Transformer, wrap } from '@foscia/shared';

export default class MapRegistry implements RegistryI {
  private readonly resolvers: ModelObjectResolver[] = [];

  private readonly models = new Map<string, Model>();

  private normalizeType: Transformer<string> | null = null;

  public constructor(config?: MapRegistryConfig) {
    this.configure(config ?? {});
  }

  public configure(config: MapRegistryConfig, override = true) {
    applyConfig(this, config, override);
  }

  public async modelFor(rawType: string) {
    const type = this.normalizeRawType(rawType);

    if (!this.models.has(type)) {
      await this.markModelsResolved(wrap(
        await this.resolveModelWithType(type) ?? await this.resolveModelsWithoutType(),
      ));
    }

    return this.models.get(type) ?? null;
  }

  /**
   * Register multiple models using various registry values.
   *
   * @param models
   */
  public register(models: MapRegistryModelsRegistration) {
    if (Array.isArray(models)) {
      models.forEach(
        (model) => this.registerModel(model),
      );
    } else {
      Object.entries(models).forEach(
        ([type, model]) => this.registerModel({ type, resolve: model }),
      );
    }
  }

  /**
   * Register a model using various registry values.
   *
   * @param model
   */
  public registerModel(model: MapRegistryModelRegistration) {
    if (isModel(model)) {
      this.resolvers.push({
        type: this.normalizeRawType(model.$type),
        resolve: () => model,
      });
    } else if (typeof model === 'function') {
      this.resolvers.push({
        resolve: model,
      });
    } else {
      this.resolvers.push({
        type: model.type ? this.normalizeRawType(model.type) : undefined,
        resolve: model.resolve,
      });
    }
  }

  /**
   * Try to resolve a model with a registered type.
   *
   * @param type
   */
  private async resolveModelWithType(type: string) {
    const typedResolver = this.resolvers.find((r) => r.type === type);

    return typedResolver ? typedResolver.resolve() : null;
  }

  /**
   * Resolve all models.
   */
  private async resolveModelsWithoutType(): Promise<Model[]> {
    return Promise.all(this.resolvers.map((r) => r.resolve()));
  }

  /**
   * Mark the given models as resolved.
   *
   * @param models
   */
  private async markModelsResolved(models: Model[]) {
    models.forEach((model) => {
      this.models.set(this.normalizeRawType(model.$type), model);
    });
  }

  /**
   * Normalize the given raw type using configured normalizer.
   *
   * @param rawType
   */
  private normalizeRawType(rawType: string) {
    return (this.normalizeType ?? ((t) => t))(rawType);
  }
}
