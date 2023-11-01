import onError from '@foscia/core/actions/context/enhancers/hooks/onError';
import onFinally from '@foscia/core/actions/context/enhancers/hooks/onFinally';
import onRunning from '@foscia/core/actions/context/enhancers/hooks/onRunning';
import onSuccess from '@foscia/core/actions/context/enhancers/hooks/onSuccess';

export default {
  ...onRunning.extension,
  ...onSuccess.extension,
  ...onError.extension,
  ...onFinally.extension,
};
