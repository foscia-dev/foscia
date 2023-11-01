import { ModelIdType } from '@foscia/core';
import { Optional } from '@foscia/shared';

export type ObjectOptionalIdentifier = {
  type?: string;
  id?: ModelIdType;
  lid?: ModelIdType;
};

export type ObjectNormalizedIdentifier = {
  type: string;
  id?: ModelIdType;
  lid?: ModelIdType;
};

export type ObjectExtractedData<R> = {
  resources: Optional<R[] | R>;
};

export type ObjectDeserializerConfig = {};

export type ObjectSerializerConfig = {};
