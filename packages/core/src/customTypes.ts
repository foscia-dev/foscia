import type {
  Model,
  ModelConnectionType,
  ModelInstance,
  RegisteredModels,
} from '@foscia/core/model/types';
import type { ModelsRegistry } from '@foscia/core/types';

declare global {
  /**
   * Foscia namespace can be overloaded by end-users for better types resolution.
   *
   * @since 0.13.0
   *
   * @example
   * ```typescript
   * import { makeRegistry, TypeCheckCustomTypes } from '@foscia/core';
   * import Comment from './models/comment';
   * import Post from './models/post';
   * import User from './models/user';
   * import FileV2 from './models/v2/file';
   *
   * const registry = makeRegistry([
   *   Comment,
   *   Post,
   *   User,
   *   FileV2,
   * ] as const);
   *
   * declare global {
   *   namespace Foscia {
   *     interface CustomTypes {
   *       // Check custom types are not missing anything.
   *       check: TypeCheckCustomTypes<typeof registry, this>;
   *       // Define mapping between connection/type strings and models.
   *       models: {
   *         // If using default connection.
   *         comments: Comment;
   *         posts: Post;
   *         users: User;
   *         // If using multiple connections.
   *         'v2:files': FileV2;
   *       };
   *     }
   *   }
   * }
   * ```
   */
  export namespace Foscia {
    /**
     * Define custom types for Foscia.
     */
    export interface CustomTypes {
    }
  }
}

/**
 * Type string for a valid type/connection pair.
 *
 * @internal
 */
export type ValidCustomModelsTypesKey<T extends string, C extends string> =
  C extends 'default' ? `\`${T}\` or \`${C}:${T}\`` : `\`${C}:${T}\``;

/**
 * Validate custom models types to be a map of connection/type keys to instances.
 *
 * @internal
 */
export type ValidateCustomModelsTypesStructure<CM> = {
  [K in keyof CM]: CM[K] extends ModelInstance<any, infer T, infer C>
    ? K extends string
      ? K extends ModelConnectionType<T, C>
        ? true
        : `CustomTypes.models keys must be valid connection/type string (expecting ${ValidCustomModelsTypesKey<T, C>}, received \`${K}\`).`
      : `CustomTypes.models keys must be valid connection/type string (expecting ${ValidCustomModelsTypesKey<T, C>}, received non string key).`
    : 'CustomTypes.models values must be valid model instance types.';
}[keyof CM];

/**
 * Validate custom models types to specify every models registered in registry.
 *
 * @internal
 */
export type ValidateCustomModelsTypesAgainstRegistry<RM extends readonly Model[], CM> = {
  [I in keyof RM]: RM[I] extends Model<any, any, infer T, infer C>
    ? C extends 'default'
      ? (
        T extends keyof CM ? true
          : `default:${T}` extends keyof CM ? true
            : `CustomTypes.models is missing registered model: ${ValidCustomModelsTypesKey<T, C>}.`)
      : (
        `${C}:${T}` extends keyof CM ? true
          : `CustomTypes.models is missing registered model: ${ValidCustomModelsTypesKey<T, C>}.`)
    : never;
}[number] | {
  [K in keyof CM]: K extends string
    ? K extends keyof RegisteredModels<RM>
      ? true
      : `Registry is missing registered model: ${K}.`
    : never;
}[keyof CM];

/**
 * Keep custom types only if they are valid.
 *
 * @internal
 */
export type ValidCustomTypes<R> = Foscia.CustomTypes extends { models: infer CM; }
  ? ValidateCustomModelsTypesStructure<CM> extends true
    ? R extends ModelsRegistry<infer RM>
      ? ValidateCustomModelsTypesAgainstRegistry<RM, CM> extends true
        ? Foscia.CustomTypes
        : Exclude<ValidateCustomModelsTypesAgainstRegistry<RM, CM>, true>
      : never
    : Exclude<ValidateCustomModelsTypesStructure<CM>, true>
  : 'CustomTypes.models must be an object of types and associated models.';

/**
 * Type check custom types.
 *
 * @since 0.13.0
 */
export type TypeCheckCustomTypes<R extends ModelsRegistry<any>, U extends ValidCustomTypes<R>> = U;
