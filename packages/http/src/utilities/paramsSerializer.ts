import { Dictionary } from '@foscia/shared';

export default function paramsSerializer(params: Dictionary<any>) {
  return new URLSearchParams(params).toString() || undefined;
}
