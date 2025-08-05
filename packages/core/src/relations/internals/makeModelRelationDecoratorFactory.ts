import {
  Model,
  ModelBelongsToProp,
  ModelHasManyProp,
  ModelHasOneProp,
  ModelInstance,
  ModelMorphManyProp,
  ModelMorphOneProp,
  ModelMorphToProp,
  ModelPropConfig,
  ModelPropDecorator, ModelRelation,
  ModelRelationProp,
} from '@foscia/core/models/types';
import initModelPropDescriptor from '@foscia/core/props/internals/initModelPropDescriptor';
import makePropDecorator from '@foscia/core/props/internals/makeModelPropDecorator';
import {
  SYMBOL_MODEL_PROP_RELATION,
  SYMBOL_MODEL_RELATION_BELONGS_TO,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_RELATION_MORPH_MANY,
  SYMBOL_MODEL_RELATION_MORPH_ONE,
  SYMBOL_MODEL_RELATION_MORPH_TO,
} from '@foscia/core/symbols';

/**
 * Create a relation decorator factory for given kind.
 *
 * @param kind
 * @param init
 *
 * @internal
 */
function makeModelRelationDecoratorFactory(
  kind: typeof SYMBOL_MODEL_RELATION_BELONGS_TO,
  init?: (prop: ModelBelongsToProp) => void,
): <This extends object, T extends ModelInstance | null>(
  model: (() => Model<NonNullable<T>>) | ModelPropConfig<ModelBelongsToProp<T, This>>,
  config?: Omit<ModelPropConfig<ModelBelongsToProp<T, This>>, 'model' | 'relationKind'>,
) => ModelPropDecorator<This, ModelRelation<T>>;
function makeModelRelationDecoratorFactory(
  kind: typeof SYMBOL_MODEL_RELATION_HAS_MANY,
  init?: (prop: ModelHasManyProp) => void,
): <This extends object, T extends ModelInstance[]>(
  model: (() => Model<T[number]>) | ModelPropConfig<ModelHasManyProp<T, This>>,
  config?: Omit<ModelPropConfig<ModelHasManyProp<T, This>>, 'model' | 'relationKind'>,
) => ModelPropDecorator<This, ModelRelation<T>>;
function makeModelRelationDecoratorFactory(
  kind: typeof SYMBOL_MODEL_RELATION_HAS_ONE,
  init?: (prop: ModelHasOneProp) => void,
): <This extends object, T extends ModelInstance | null>(
  model: (() => Model<NonNullable<T>>) | ModelPropConfig<ModelHasOneProp<T, This>>,
  config?: Omit<ModelPropConfig<ModelHasOneProp<T, This>>, 'model' | 'relationKind'>,
) => ModelPropDecorator<This, ModelRelation<T>>;
function makeModelRelationDecoratorFactory(
  kind: typeof SYMBOL_MODEL_RELATION_MORPH_TO,
  init?: (prop: ModelMorphToProp) => void,
): <This extends object, T extends ModelInstance | null, M extends Model<NonNullable<T>>>(
  model?: (() => M[]) | ModelPropConfig<ModelMorphToProp<T, This>>,
  config?: Omit<ModelPropConfig<ModelMorphToProp<T, This>>, 'model' | 'relationKind'>,
) => ModelPropDecorator<This, ModelRelation<T>>;
function makeModelRelationDecoratorFactory(
  kind: typeof SYMBOL_MODEL_RELATION_MORPH_MANY,
  init?: (prop: ModelMorphManyProp) => void,
): <This extends object, T extends ModelInstance[]>(
  model: (() => Model<T[number]>) | ModelPropConfig<ModelMorphManyProp<T, This>>,
  config?: Omit<ModelPropConfig<ModelMorphManyProp<T, This>>, 'model' | 'relationKind'>,
) => ModelPropDecorator<This, ModelRelation<T>>;
function makeModelRelationDecoratorFactory(
  kind: typeof SYMBOL_MODEL_RELATION_MORPH_ONE,
  init?: (prop: ModelMorphOneProp) => void,
): <This extends object, T extends ModelInstance | null>(
  model: (() => Model<NonNullable<T>>) | ModelPropConfig<ModelMorphOneProp<T, This>>,
  config?: Omit<ModelPropConfig<ModelMorphOneProp<T, This>>, 'model' | 'relationKind'>,
) => ModelPropDecorator<This, ModelRelation<T>>;

function makeModelRelationDecoratorFactory<
  This extends object,
  T extends ModelInstance[] | ModelInstance | null,
  Relation extends ModelRelationProp<T, This>,
>(
  kind: Relation['relationKind'],
  init?: (prop: Relation) => void,
) {
  return (
    model?: (() => Model[] | Model) | ModelPropConfig<Relation>,
    config?: ModelPropConfig<Relation>,
  ) => makePropDecorator<ModelRelationProp<T, This>>((data) => {
    const prop = {
      ...config,
      ...(typeof model === 'function' ? { model } : model),
      ...data,
      kind: SYMBOL_MODEL_PROP_RELATION,
      relationKind: kind,
    } as Relation;

    initModelPropDescriptor(prop);
    init?.(prop);

    return prop;
  });
}

export default makeModelRelationDecoratorFactory;
