import mapArrayable from '@foscia/shared/arrays/mapArrayable';
import sequentialTransform from '@foscia/shared/arrays/sequentialTransform';
import uniqueValues from '@foscia/shared/arrays/uniqueValues';
import wrap from '@foscia/shared/arrays/wrap';
import wrapVariadic from '@foscia/shared/arrays/wrapVariadic';
import isFosciaType from '@foscia/shared/checks/isFosciaType';
import isNil from '@foscia/shared/checks/isNil';
import isNone from '@foscia/shared/checks/isNone';
import makeConfigurable from '@foscia/shared/configs/makeConfigurable';
import mergeConfig from '@foscia/shared/configs/mergeConfig';
import removeTimezoneOffset from '@foscia/shared/dates/removeTimezoneOffset';
import eachDescriptors from '@foscia/shared/descriptors/eachDescriptors';
import isDescriptorHolder from '@foscia/shared/descriptors/isDescriptorHolder';
import makeDescriptorHolder, {
  SYMBOL_DESCRIPTOR_HOLDER,
} from '@foscia/shared/descriptors/makeDescriptorHolder';
import { IS_DEV, IS_TEST } from '@foscia/shared/env';
import value from '@foscia/shared/functions/value';
import makeIdentifiersMap from '@foscia/shared/maps/makeIdentifiersMap';
import optionalJoin from '@foscia/shared/strings/optionalJoin';
import pluralize from '@foscia/shared/strings/pluralize';
import toKebabCase from '@foscia/shared/strings/toKebabCase';

export * from '@foscia/shared/descriptors/types';
export * from '@foscia/shared/types';

export {
  IS_DEV,
  IS_TEST,
  makeConfigurable,
  mergeConfig,
  eachDescriptors,
  makeDescriptorHolder,
  makeIdentifiersMap,
  mapArrayable,
  isDescriptorHolder,
  isFosciaType,
  isNil,
  isNone,
  optionalJoin,
  pluralize,
  sequentialTransform,
  removeTimezoneOffset,
  toKebabCase,
  uniqueValues,
  value,
  wrap,
  wrapVariadic,
  SYMBOL_DESCRIPTOR_HOLDER,
};
