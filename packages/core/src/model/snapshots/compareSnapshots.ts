import compareModelValue from '@foscia/core/model/snapshots/compareModelValue';
import { ModelClass, ModelKey, ModelSnapshot } from '@foscia/core/model/types';
import { ArrayableVariadic, wrapVariadic } from '@foscia/shared';

export default function compareSnapshots<M extends ModelClass>(
  nextSnapshot: ModelSnapshot<M>,
  prevSnapshot: ModelSnapshot<M>,
  ...only: ArrayableVariadic<ModelKey<M>>
) {
  if (nextSnapshot.$model !== prevSnapshot.$model) {
    return false;
  }

  const keys = wrapVariadic(...only);
  if (!keys.length && nextSnapshot.$exists !== prevSnapshot.$exists) {
    return false;
  }

  return (
    keys.length > 0
    || Object.keys(nextSnapshot.$values).length === Object.keys(prevSnapshot.$values).length
  ) && (keys.length ? keys : Object.keys(nextSnapshot.$values) as ModelKey<M>[]).every(
    (key) => compareModelValue(
      nextSnapshot.$model,
      nextSnapshot.$values[key],
      prevSnapshot.$values[key],
    ),
  );
}
