import readExtensions from '@foscia/core/actions/extensions/readExtensions';
import writeExtensions from '@foscia/core/actions/extensions/writeExtensions';

export default function crudExtensions() {
  return {
    ...readExtensions(),
    ...writeExtensions(),
  };
}
