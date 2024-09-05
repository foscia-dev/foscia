import { hasMany, makeComposable } from '@foscia/core';
import type FileMock from '../models/file.mock';

export default makeComposable({
  images: hasMany<FileMock[]>(),
});
