import all from '@foscia/core/actions/context/runners/all';
import cached from '@foscia/core/actions/context/runners/cached';
import cachedOr from '@foscia/core/actions/context/runners/cachedOr';
import cachedOrFail from '@foscia/core/actions/context/runners/cachedOrFail';
import none from '@foscia/core/actions/context/runners/none';
import one from '@foscia/core/actions/context/runners/one';
import oneOr from '@foscia/core/actions/context/runners/oneOr';
import oneOrCurrent from '@foscia/core/actions/context/runners/oneOrCurrent';
import oneOrFail from '@foscia/core/actions/context/runners/oneOrFail';
import raw from '@foscia/core/actions/context/runners/raw';

export default {
  ...all.extension,
  ...one.extension,
  ...oneOrFail.extension,
  ...oneOrCurrent.extension,
  ...oneOr.extension,
  ...none.extension,
  ...raw.extension,
  ...cached.extension,
  ...cachedOrFail.extension,
  ...cachedOr.extension,
};
