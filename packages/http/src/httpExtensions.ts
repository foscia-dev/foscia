import abortSignal from '@foscia/http/actions/context/enhancers/abortSignal';
import makeDelete from '@foscia/http/actions/context/enhancers/makeDelete';
import makeGet from '@foscia/http/actions/context/enhancers/makeGet';
import makePatch from '@foscia/http/actions/context/enhancers/makePatch';
import makePost from '@foscia/http/actions/context/enhancers/makePost';
import makePut from '@foscia/http/actions/context/enhancers/makePut';
import makeRequest from '@foscia/http/actions/context/enhancers/makeRequest';
import param from '@foscia/http/actions/context/enhancers/param';

export default {
  ...makeGet.extension,
  ...makePost.extension,
  ...makePut.extension,
  ...makePatch.extension,
  ...makeDelete.extension,
  ...makeRequest.extension,
  ...param.extension,
  ...abortSignal.extension,
};
