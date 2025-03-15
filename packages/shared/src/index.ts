import groupBy from '@foscia/shared/arrays/groupBy';
import mapArrayable from '@foscia/shared/arrays/mapArrayable';
import mapWithKeys from '@foscia/shared/arrays/mapWithKeys';
import uniqueValues from '@foscia/shared/arrays/uniqueValues';
import wrap from '@foscia/shared/arrays/wrap';
import isFosciaFlag from '@foscia/shared/checks/isFosciaFlag';
import isFosciaType from '@foscia/shared/checks/isFosciaType';
import isNil from '@foscia/shared/checks/isNil';
import removeTimezoneOffset from '@foscia/shared/dates/removeTimezoneOffset';
import eachDescriptors from '@foscia/shared/descriptors/eachDescriptors';
import isDescriptorHolder from '@foscia/shared/descriptors/isDescriptorHolder';
import makeDescriptorHolder, {
  SYMBOL_DESCRIPTOR_HOLDER,
} from '@foscia/shared/descriptors/makeDescriptorHolder';
import { IS_DEV, IS_TEST } from '@foscia/shared/env';
import tap from '@foscia/shared/functions/tap';
import value from '@foscia/shared/functions/value';
import uniqueId from '@foscia/shared/identifiers/uniqueId';
import unsafeId from '@foscia/shared/identifiers/unsafeId';
import multimapMake from '@foscia/shared/maps/multimapMake';
import multimapDelete from '@foscia/shared/maps/multimapDelete';
import multimapGet from '@foscia/shared/maps/multimapGet';
import multimapSet from '@foscia/shared/maps/multimapSet';
import sequentialTransform from '@foscia/shared/miscellaneous/sequentialTransform';
import throughMiddlewares from '@foscia/shared/miscellaneous/throughMiddlewares';
import camelCase from '@foscia/shared/strings/camelCase';
import kebabCase from '@foscia/shared/strings/kebabCase';
import optionalJoin from '@foscia/shared/strings/optionalJoin';
import pluralize from '@foscia/shared/strings/pluralize';
import singularize from '@foscia/shared/strings/singularize';

export * from '@foscia/shared/descriptors/types';
export * from '@foscia/shared/types';

export {
  IS_DEV,
  IS_TEST,
  SYMBOL_DESCRIPTOR_HOLDER,
  eachDescriptors,
  makeDescriptorHolder,
  mapArrayable,
  mapWithKeys,
  groupBy,
  multimapGet,
  multimapSet,
  multimapDelete,
  multimapMake,
  isDescriptorHolder,
  isFosciaType,
  isFosciaFlag,
  isNil,
  optionalJoin,
  pluralize,
  singularize,
  sequentialTransform,
  throughMiddlewares,
  removeTimezoneOffset,
  kebabCase,
  camelCase,
  unsafeId,
  uniqueId,
  uniqueValues,
  tap,
  value,
  wrap,
};
