import applyConfig from '@foscia/shared/applyConfig';
import sequentialTransform from '@foscia/shared/arrays/sequentialTransform';
import uniqueValues from '@foscia/shared/arrays/uniqueValues';
import wrap from '@foscia/shared/arrays/wrap';
import wrapVariadic from '@foscia/shared/arrays/wrapVariadic';
import isFosciaType from '@foscia/shared/checks/isFosciaType';
import isNil from '@foscia/shared/checks/isNil';
import isNone from '@foscia/shared/checks/isNone';
import removeTimezoneOffset from '@foscia/shared/dates/removeTimezoneOffset';
import eachDescriptors from '@foscia/shared/descriptors/eachDescriptors';
import isDescriptorHolder from '@foscia/shared/descriptors/isDescriptorHolder';
import makeDescriptorHolder from '@foscia/shared/descriptors/makeDescriptorHolder';
import { IS_DEV, IS_TEST } from '@foscia/shared/env';
import IdentifiersMap from '@foscia/shared/identifiersMap';
import optionalJoin from '@foscia/shared/strings/optionalJoin';
import pluralize from '@foscia/shared/strings/pluralize';
import toKebabCase from '@foscia/shared/strings/toKebabCase';
import value from '@foscia/shared/value';

export * from '@foscia/shared/descriptors/types';
export * from '@foscia/shared/types';

export {
  IS_DEV,
  IS_TEST,
  applyConfig,
  eachDescriptors,
  isDescriptorHolder,
  makeDescriptorHolder,
  IdentifiersMap,
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
};
