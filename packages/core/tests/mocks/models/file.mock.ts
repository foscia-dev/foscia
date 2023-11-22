import { attr, hasMany, hasOne, makeModel, toString } from '@foscia/core';

export default class FileMock extends makeModel('files', {
  name: attr(toString()),
  parent: hasOne<FileMock>(),
  children: hasMany<FileMock[]>(),
}) {
}
