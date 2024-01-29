import normalizeInclude from '@foscia/core/actions/context/utils/normalizeInclude';
import makeCache from '@foscia/core/blueprints/makeCache';
import makeRegistry from '@foscia/core/blueprints/makeRegistry';
import makeRefsCacheWith from '@foscia/core/cache/makeRefsCacheWith';
import weakRefManager from '@foscia/core/cache/weakRefManager';
import AdapterError from '@foscia/core/errors/adapterError';
import DeserializerError from '@foscia/core/errors/deserializerError';
import ExpectedRunFailureError from '@foscia/core/errors/expectedRunFailureError';
import isNotFoundError from '@foscia/core/errors/flags/isNotFoundError';
import FosciaError from '@foscia/core/errors/fosciaError';
import SerializerError from '@foscia/core/errors/serializerError';
import registerHook from '@foscia/core/hooks/registerHook';
import runHook from '@foscia/core/hooks/runHook';
import runHooks from '@foscia/core/hooks/runHooks';
import unregisterHook from '@foscia/core/hooks/unregisterHook';
import withoutHooks from '@foscia/core/hooks/withoutHooks';
import logger from '@foscia/core/logger/logger';
import isAttributeDef from '@foscia/core/model/checks/isAttributeDef';
import isIdDef from '@foscia/core/model/checks/isIdDef';
import isInstance from '@foscia/core/model/checks/isInstance';
import isModel from '@foscia/core/model/checks/isModel';
import isPendingPropDef from '@foscia/core/model/checks/isPendingPropDef';
import isPluralRelationDef from '@foscia/core/model/checks/isPluralRelationDef';
import isPropDef from '@foscia/core/model/checks/isPropDef';
import isRelationDef from '@foscia/core/model/checks/isRelationDef';
import isSingularRelationDef from '@foscia/core/model/checks/isSingularRelationDef';
import fill from '@foscia/core/model/fill';
import forceFill from '@foscia/core/model/forceFill';
import onCreated from '@foscia/core/model/hooks/onCreated';
import onCreating from '@foscia/core/model/hooks/onCreating';
import onDestroyed from '@foscia/core/model/hooks/onDestroyed';
import onDestroying from '@foscia/core/model/hooks/onDestroying';
import onRetrieved from '@foscia/core/model/hooks/onRetrieved';
import onSaved from '@foscia/core/model/hooks/onSaved';
import onSaving from '@foscia/core/model/hooks/onSaving';
import onUpdated from '@foscia/core/model/hooks/onUpdated';
import onUpdating from '@foscia/core/model/hooks/onUpdating';
import onPropertyRead from '@foscia/core/model/hooks/properties/onPropertyRead';
import onPropertyReading from '@foscia/core/model/hooks/properties/onPropertyReading';
import onPropertyWrite from '@foscia/core/model/hooks/properties/onPropertyWrite';
import onPropertyWriting from '@foscia/core/model/hooks/properties/onPropertyWriting';
import isSame from '@foscia/core/model/isSame';
import makeComposable from '@foscia/core/model/makeComposable';
import makeModel from '@foscia/core/model/makeModel';
import makeModelFactory from '@foscia/core/model/makeModelFactory';
import attr from '@foscia/core/model/props/builders/attr';
import hasMany from '@foscia/core/model/props/builders/hasMany';
import hasOne from '@foscia/core/model/props/builders/hasOne';
import id from '@foscia/core/model/props/builders/id';
import mapAttributes from '@foscia/core/model/props/mappers/mapAttributes';
import mapIds from '@foscia/core/model/props/mappers/mapIds';
import mapProps from '@foscia/core/model/props/mappers/mapProps';
import mapRelations from '@foscia/core/model/props/mappers/mapRelations';
import shouldSync from '@foscia/core/model/props/shouldSync';
import guessRelationType from '@foscia/core/model/relations/guessRelationType';
import loaded from '@foscia/core/model/relations/loaded';
import makeForRelationLoader from '@foscia/core/model/relations/makeForRelationLoader';
import makeRefreshIncludeLoader from '@foscia/core/model/relations/makeRefreshIncludeLoader';
import changed from '@foscia/core/model/snapshots/changed';
import compareSnapshots from '@foscia/core/model/snapshots/compareSnapshots';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import restore from '@foscia/core/model/snapshots/restore';
import restoreSnapshot from '@foscia/core/model/snapshots/restoreSnapshot';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import normalizeDotRelations from '@foscia/core/normalization/normalizeDotRelations';
import normalizeKey from '@foscia/core/normalization/normalizeKey';
import makeMapRegistryWith from '@foscia/core/registry/makeMapRegistryWith';
import {
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_PROP_ATTRIBUTE,
  SYMBOL_MODEL_PROP_ID,
  SYMBOL_MODEL_PROP_PENDING,
  SYMBOL_MODEL_PROP_RELATION,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
} from '@foscia/core/symbols';
import makeTransformer from '@foscia/core/transformers/makeTransformer';
import toArrayOf from '@foscia/core/transformers/toArrayOf';
import toBoolean from '@foscia/core/transformers/toBoolean';
import toDate from '@foscia/core/transformers/toDate';
import toDateTime from '@foscia/core/transformers/toDateTime';
import toNumber from '@foscia/core/transformers/toNumber';
import toString from '@foscia/core/transformers/toString';

export * from '@foscia/core/actions/types';
export * from '@foscia/core/cache/types';
export * from '@foscia/core/errors/flags/types';
export * from '@foscia/core/hooks/types';
export * from '@foscia/core/model/props/builders/types';
export * from '@foscia/core/model/types';
export * from '@foscia/core/registry/types';
export * from '@foscia/core/transformers/types';
export * from '@foscia/core/types';

export * from '@foscia/core/actions';

export {
  AdapterError,
  FosciaError,
  DeserializerError,
  SerializerError,
  ExpectedRunFailureError,
  isNotFoundError,
  makeRegistry,
  makeMapRegistryWith,
  makeCache,
  makeRefsCacheWith,
  weakRefManager,
  attr,
  hasMany,
  hasOne,
  id,
  loaded,
  fill,
  forceFill,
  isSame,
  changed,
  restore,
  markSynced,
  makeComposable,
  makeModel,
  makeModelFactory,
  makeForRelationLoader,
  makeRefreshIncludeLoader,
  toArrayOf,
  toBoolean,
  toDate,
  toDateTime,
  toNumber,
  toString,
  makeTransformer,
  onRetrieved,
  onCreating,
  onCreated,
  onUpdating,
  onUpdated,
  onSaving,
  onSaved,
  onDestroying,
  onDestroyed,
  onPropertyRead,
  onPropertyReading,
  onPropertyWrite,
  onPropertyWriting,
  compareSnapshots,
  restoreSnapshot,
  takeSnapshot,
  runHook,
  runHooks,
  registerHook,
  unregisterHook,
  withoutHooks,
  isPropDef,
  isAttributeDef,
  isRelationDef,
  isIdDef,
  isPluralRelationDef,
  isSingularRelationDef,
  isModel,
  isInstance,
  isPendingPropDef,
  mapIds,
  mapAttributes,
  mapRelations,
  mapProps,
  shouldSync,
  guessRelationType,
  normalizeDotRelations,
  normalizeInclude,
  normalizeKey,
  logger,
  SYMBOL_MODEL_PROP_PENDING,
  SYMBOL_MODEL_PROP_ID,
  SYMBOL_MODEL_PROP_ATTRIBUTE,
  SYMBOL_MODEL_PROP_RELATION,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_INSTANCE,
};
