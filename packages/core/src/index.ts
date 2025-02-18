import normalizeInclude from '@foscia/core/actions/context/utilities/normalizeInclude';
import makeCache from '@foscia/core/cache/makeCache';
import makeRefsCache from '@foscia/core/cache/makeRefsCache';
import makeTimedRefFactory from '@foscia/core/cache/makeTimedRefFactory';
import makeWeakRefFactory from '@foscia/core/cache/makeWeakRefFactory';
import connections from '@foscia/core/connections/connections';
import AdapterError from '@foscia/core/errors/adapterError';
import DeserializerError from '@foscia/core/errors/deserializerError';
import RecordNotFoundError from '@foscia/core/errors/recordNotFoundError';
import FosciaError from '@foscia/core/errors/fosciaError';
import SerializerError from '@foscia/core/errors/serializerError';
import { FLAG_ERROR_NOT_FOUND } from '@foscia/core/flags';
import registerHook from '@foscia/core/hooks/registerHook';
import runHooks from '@foscia/core/hooks/runHooks';
import unregisterHook from '@foscia/core/hooks/unregisterHook';
import withoutHooks from '@foscia/core/hooks/withoutHooks';
import logger from '@foscia/core/logger/logger';
import isInstance from '@foscia/core/model/checks/isInstance';
import isInstanceUsing from '@foscia/core/model/checks/isInstanceUsing';
import isModel from '@foscia/core/model/checks/isModel';
import isModelUsing from '@foscia/core/model/checks/isModelUsing';
import isSame from '@foscia/core/model/checks/isSame';
import makeComposable from '@foscia/core/model/composition/makeComposable';
import makeComposableFactory from '@foscia/core/model/composition/makeComposableFactory';
import makeDefinition from '@foscia/core/model/composition/makeDefinition';
import applyDefinition from '@foscia/core/model/composition/utilities/applyDefinition';
import onBoot from '@foscia/core/model/hooks/onBoot';
import onCreated from '@foscia/core/model/hooks/onCreated';
import onCreating from '@foscia/core/model/hooks/onCreating';
import onDestroyed from '@foscia/core/model/hooks/onDestroyed';
import onDestroying from '@foscia/core/model/hooks/onDestroying';
import onInit from '@foscia/core/model/hooks/onInit';
import onPropertyRead from '@foscia/core/model/hooks/onPropertyRead';
import onPropertyReading from '@foscia/core/model/hooks/onPropertyReading';
import onPropertyWrite from '@foscia/core/model/hooks/onPropertyWrite';
import onPropertyWriting from '@foscia/core/model/hooks/onPropertyWriting';
import onRetrieved from '@foscia/core/model/hooks/onRetrieved';
import onSaved from '@foscia/core/model/hooks/onSaved';
import onSaving from '@foscia/core/model/hooks/onSaving';
import onUpdated from '@foscia/core/model/hooks/onUpdated';
import onUpdating from '@foscia/core/model/hooks/onUpdating';
import makeModel from '@foscia/core/model/makeModel';
import makeModelFactory from '@foscia/core/model/makeModelFactory';
import attr from '@foscia/core/model/props/attr';
import isAttributeDef from '@foscia/core/model/props/checks/isAttributeDef';
import isIdDef from '@foscia/core/model/props/checks/isIdDef';
import isPluralRelationDef from '@foscia/core/model/props/checks/isPluralRelationDef';
import isRelationDef from '@foscia/core/model/props/checks/isRelationDef';
import isSingularRelationDef from '@foscia/core/model/props/checks/isSingularRelationDef';
import hasMany from '@foscia/core/model/props/hasMany';
import hasOne from '@foscia/core/model/props/hasOne';
import id from '@foscia/core/model/props/id';
import mapAttributes from '@foscia/core/model/props/mappers/mapAttributes';
import mapRelations from '@foscia/core/model/props/mappers/mapRelations';
import loaded from '@foscia/core/model/props/relations/loaded';
import makeQueryModelLoader, {
  QueryModelLoaderOptions,
} from '@foscia/core/model/props/relations/makeQueryModelLoader';
import makeQueryModelLoaderExtractor
  from '@foscia/core/model/props/relations/makeQueryModelLoaderExtractor';
import makeQueryRelationLoader, {
  QueryRelationLoaderOptions,
} from '@foscia/core/model/props/relations/makeQueryRelationLoader';
import makeRefreshIncludeLoader, {
  RefreshIncludeLoaderOptions,
} from '@foscia/core/model/props/relations/makeRefreshIncludeLoader';
import attachRelationInverse from '@foscia/core/model/props/utilities/attachRelationInverse';
import guessRelationInverses from '@foscia/core/model/props/utilities/guessRelationInverses';
import guessRelationType from '@foscia/core/model/props/utilities/guessRelationType';
import shouldSync from '@foscia/core/model/props/utilities/shouldSync';
import makeModelsReducer from '@foscia/core/model/revivers/makeModelsReducer';
import makeModelsReviver from '@foscia/core/model/revivers/makeModelsReviver';
import changed from '@foscia/core/model/snapshots/changed';
import isSameSnapshot from '@foscia/core/model/snapshots/checks/isSameSnapshot';
import isSnapshot from '@foscia/core/model/snapshots/checks/isSnapshot';
import markSynced from '@foscia/core/model/snapshots/markSynced';
import restore from '@foscia/core/model/snapshots/restore';
import restoreSnapshot from '@foscia/core/model/snapshots/restoreSnapshot';
import takeSnapshot from '@foscia/core/model/snapshots/takeSnapshot';
import cloneModelValue from '@foscia/core/model/utilities/cloneModelValue';
import compareModelValues from '@foscia/core/model/utilities/compareModelValues';
import fill from '@foscia/core/model/utilities/fill';
import filled from '@foscia/core/model/utilities/filled';
import forceFill from '@foscia/core/model/utilities/forceFill';
import normalizeDotRelations from '@foscia/core/normalization/normalizeDotRelations';
import normalizeKey from '@foscia/core/normalization/normalizeKey';
import makeMapRegistry from '@foscia/core/registry/makeMapRegistry';
import makeRegistry from '@foscia/core/registry/makeRegistry';
import {
  SYMBOL_ACTION_ENHANCER,
  SYMBOL_ACTION_RUNNER,
  SYMBOL_ACTION_WHEN,
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_COMPOSABLE,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_PROP,
  SYMBOL_MODEL_PROP_KIND_ATTRIBUTE,
  SYMBOL_MODEL_PROP_KIND_ID,
  SYMBOL_MODEL_PROP_KIND_RELATION,
  SYMBOL_MODEL_PROP_TRANSFORMER,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_SNAPSHOT,
} from '@foscia/core/symbols';
import isTransformer from '@foscia/core/transformers/isTransformer';
import makeCustomTransformer from '@foscia/core/transformers/makeCustomTransformer';
import makeTransformer from '@foscia/core/transformers/makeTransformer';
import toArrayOf from '@foscia/core/transformers/toArrayOf';
import toBoolean from '@foscia/core/transformers/toBoolean';
import toDate from '@foscia/core/transformers/toDate';
import toDateTime from '@foscia/core/transformers/toDateTime';
import toNumber from '@foscia/core/transformers/toNumber';
import toString from '@foscia/core/transformers/toString';

export * from '@foscia/core/actions/types';
export * from '@foscia/core/cache/types';
export * from '@foscia/core/hooks/types';
export * from '@foscia/core/logger/types';
export * from '@foscia/core/model/revivers/types';
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
  RecordNotFoundError,
  makeRegistry,
  makeMapRegistry,
  makeCache,
  makeRefsCache,
  makeWeakRefFactory,
  makeTimedRefFactory,
  attr,
  hasMany,
  hasOne,
  id,
  loaded,
  fill,
  forceFill,
  isSame,
  filled,
  changed,
  restore,
  markSynced,
  applyDefinition,
  makeDefinition,
  makeComposable,
  makeComposableFactory,
  makeModel,
  makeModelFactory,
  makeQueryModelLoader,
  QueryModelLoaderOptions,
  makeQueryModelLoaderExtractor,
  QueryRelationLoaderOptions,
  makeQueryRelationLoader,
  RefreshIncludeLoaderOptions,
  makeRefreshIncludeLoader,
  toArrayOf,
  toBoolean,
  toDate,
  toDateTime,
  toNumber,
  toString,
  makeTransformer,
  makeCustomTransformer,
  isTransformer,
  onBoot,
  onInit,
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
  isSnapshot,
  isSameSnapshot,
  restoreSnapshot,
  takeSnapshot,
  runHooks,
  registerHook,
  unregisterHook,
  withoutHooks,
  isAttributeDef,
  isRelationDef,
  isIdDef,
  isPluralRelationDef,
  isSingularRelationDef,
  isModel,
  isInstance,
  isModelUsing,
  isInstanceUsing,
  mapAttributes,
  mapRelations,
  shouldSync,
  guessRelationType,
  guessRelationInverses,
  attachRelationInverse,
  normalizeDotRelations,
  normalizeInclude,
  normalizeKey,
  makeModelsReducer,
  makeModelsReviver,
  cloneModelValue,
  compareModelValues,
  connections,
  logger,
  FLAG_ERROR_NOT_FOUND,
  SYMBOL_MODEL_PROP_TRANSFORMER,
  SYMBOL_MODEL_PROP,
  SYMBOL_MODEL_PROP_KIND_ID,
  SYMBOL_MODEL_PROP_KIND_ATTRIBUTE,
  SYMBOL_MODEL_PROP_KIND_RELATION,
  SYMBOL_MODEL_RELATION_HAS_ONE,
  SYMBOL_MODEL_RELATION_HAS_MANY,
  SYMBOL_MODEL_CLASS,
  SYMBOL_MODEL_INSTANCE,
  SYMBOL_MODEL_COMPOSABLE,
  SYMBOL_MODEL_SNAPSHOT,
  SYMBOL_ACTION_WHEN,
  SYMBOL_ACTION_ENHANCER,
  SYMBOL_ACTION_RUNNER,
};
