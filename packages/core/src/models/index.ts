import makeComposable from '@foscia/core/models/definition/decorators/makeComposable';
import makeModel from '@foscia/core/models/definition/decorators/makeModel';
import isInstance from '@foscia/core/models/definition/utilities/isInstance';
import isInstanceUsing from '@foscia/core/models/definition/utilities/isInstanceUsing';
import isModel from '@foscia/core/models/definition/utilities/isModel';
import isModelProp from '@foscia/core/models/definition/utilities/isModelProp';
import isModelUsing from '@foscia/core/models/definition/utilities/isModelUsing';
import modelRegistry from '@foscia/core/models/modelRegistry';
import isSame from '@foscia/core/models/utilities/isSame';
import attr from '@foscia/core/props/decorators/attr';
import foreign from '@foscia/core/props/decorators/foreign';
import primary from '@foscia/core/props/decorators/primary';
import aliasProp from '@foscia/core/props/internals/aliasProp';
import shouldSyncProp from '@foscia/core/props/internals/shouldSyncProp';
import belongsTo from '@foscia/core/relations/decorators/belongsTo';
import hasMany from '@foscia/core/relations/decorators/hasMany';
import morphMany from '@foscia/core/relations/decorators/morphMany';
import morphTo from '@foscia/core/relations/decorators/morphTo';

export * from '@foscia/core/models/types';

export {
  modelRegistry,
  primary,
  foreign,
  attr,
  belongsTo,
  hasMany,
  morphTo,
  morphMany,
  makeModel,
  makeComposable,
  isInstance,
  isInstanceUsing,
  isModel,
  isModelUsing,
  isModelProp,
  isSame,
  aliasProp,
  shouldSyncProp,
};
