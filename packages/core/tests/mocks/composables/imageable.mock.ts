import { hasMany, makeComposable } from '@foscia/core';

export default makeComposable({
  images: hasMany('files'),
});
