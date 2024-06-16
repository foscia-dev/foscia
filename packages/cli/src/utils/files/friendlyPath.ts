import { resolve } from 'node:path';

export default function friendlyPath(path: string) {
  return path.replace(`${resolve('')}/`, '');
}
