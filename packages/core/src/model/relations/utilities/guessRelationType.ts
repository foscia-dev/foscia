import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import { ModelRelation } from '@foscia/core/model/types';
import { pluralize } from '@foscia/shared';

export default (def: ModelRelation) => (
  isPluralRelationDef(def) ? def.key : pluralize(def.key)
);
