import create from '@foscia/core/actions/context/enhancers/crud/create';
import update from '@foscia/core/actions/context/enhancers/crud/update';
import makeEnhancer from '@foscia/core/actions/makeEnhancer';
import {
  ConsumeInstance,
  ConsumeModel,
  ConsumeSerializer,
  ContextEnhancer,
} from '@foscia/core/actions/types';
import { ModelInstance } from '@foscia/core/model/types';

/**
 * Prepare context for an instance creation or update depending on its existence
 * state (calls {@link update | `update`} if the instance `$exists`,
 * otherwise call {@link create | `create`}.
 *
 * @param instance
 *
 * @category Enhancers
 * @provideContext model, instance, id
 * @requireContext serializer
 *
 * @example
 * ```typescript
 * import { save, none } from '@foscia/core';
 *
 * await action().run(save(post), none());
 * ```
 */
export default /* @__PURE__ */ makeEnhancer('save', (<I extends ModelInstance>(instance: I) => (
  instance.$exists ? update(instance) : create(instance)
)) as {
  <C extends {}, I extends ModelInstance, Record, Related, Data>(
    instance: I,
    // eslint-disable-next-line max-len
  ): ContextEnhancer<C & ConsumeSerializer<Record, Related, Data>, C & ConsumeModel<I['$model']> & ConsumeInstance<I>>;
});
