import { Dictionary } from '@foscia/shared';

export default (params: Dictionary<any>) => new URLSearchParams(params).toString() || undefined;
