import ActionName from '@foscia/core/actions/actionName';
import context from '@foscia/core/actions/context/enhancers/context';
import instanceData from '@foscia/core/actions/context/enhancers/crud/instanceData';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';
import query from '@foscia/core/actions/context/enhancers/query';
import appendExtension from '@foscia/core/actions/extensions/appendExtension';
import {
  Action,
  ConsumeId,
  ConsumeInstance,
  ConsumeModel,
  ConsumeRelation,
  ConsumeSerializer,
  ContextEnhancer,
  InferConsumedInstance,
  WithParsedExtension,
} from '@foscia/core/actions/types';
import runHooks from '@foscia/core/hooks/runHooks';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import {
  Model,
  ModelClassInstance,
  ModelInstance,
  ModelRelationKey,
  ModelSchema,
  ModelSchemaRelations,
} from '@foscia/core/model/types';

/**
 * Prepare context for an instance creation.
 *
 * @param instance
 * @param throughInstance
 * @param throughRelation
 *
 * @category Enhancers
 */
const create: {
  <C extends {}, E extends {}, D extends {}, I extends ModelInstance<D>, Record, Related, Data>(
    instance: ModelClassInstance<D> & I,
    // eslint-disable-next-line max-len
  ): ContextEnhancer<C & ConsumeSerializer<Record, Related, Data>, E, C & ConsumeModel<Model<D, I>> & ConsumeInstance<I>>;
  <
    C extends {},
    E extends {},
    D extends {},
    RD extends ModelSchemaRelations<D>,
    I extends ModelInstance<D>,
    K extends keyof ModelSchema<D> & keyof RD & string,
    RI extends InferConsumedInstance<ConsumeRelation<RD[K]>>,
    Record,
    Related,
    Data,
  >(
    instance: RI,
    throughInstance: ModelClassInstance<D> & I,
    throughRelation: ModelRelationKey<D> & K,
    // eslint-disable-next-line max-len
  ): ContextEnhancer<C & ConsumeSerializer<Record, Related, Data>, E, C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeInstance<RI> & ConsumeId>;
} = <
  C extends {},
  E extends {},
  D extends {},
  RD extends ModelSchemaRelations<D>,
  I extends ModelInstance<D>,
  K extends keyof ModelSchema<D> & keyof RD & string,
  RI extends InferConsumedInstance<ConsumeRelation<RD[K]>>,
  Record,
  Related,
  Data,
>(
  instance: (ModelClassInstance<D> & I) | RI,
  throughInstance?: ModelClassInstance<D> & I,
  throughRelation?: ModelRelationKey<D> & K,
) => (action: Action<C & ConsumeSerializer<Record, Related, Data>, E>) => action.use(
  query(throughInstance ?? instance, throughRelation as any),
  context({
    action: ActionName.CREATE,
    instance,
    // Rewrite ID when creating through another record.
    id: throughInstance ? (throughInstance as ModelInstance).id : undefined,
  }),
  instanceData(instance),
  onRunning(() => runHooks(instance.$model, ['creating', 'saving'], instance)),
  onSuccess(async () => {
    // eslint-disable-next-line no-param-reassign
    instance.$exists = true;
    markSynced(instance);
    await runHooks(instance.$model, ['created', 'saved'], instance);
  }),
);

export default /* @__PURE__ */ appendExtension(
  'create',
  create,
  'use',
) as WithParsedExtension<typeof create, {
  create<
    C extends {},
    E extends {},
    D extends {},
    I extends ModelInstance<D>,
    Record,
    Related,
    Data,
  >(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: ModelClassInstance<D> & I,
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeInstance<I>, E>;
  create<
    C extends {},
    E extends {},
    D extends {},
    RD extends ModelSchemaRelations<D>,
    I extends ModelInstance<D>,
    K extends keyof ModelSchema<D> & keyof RD & string,
    RI extends InferConsumedInstance<ConsumeRelation<RD[K]>>,
    Record,
    Related,
    Data,
  >(
    this: Action<C & ConsumeSerializer<Record, Related, Data>, E>,
    instance: RI,
    throughInstance: ModelClassInstance<D> & I,
    throughRelation: ModelRelationKey<D> & K,
    // eslint-disable-next-line max-len
  ): Action<C & ConsumeModel<Model<D, I>> & ConsumeRelation<RD[K]> & ConsumeInstance<RI> & ConsumeId, E>;
}>;
