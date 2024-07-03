import { Dictionary } from '@foscia/shared/types';

const mapWithKeys: {
  <T, U extends {}>(
    values: T[],
    callback: (value: T, key: number) => U,
  ): U;
  <T extends {}, U extends {}>(
    values: T,
    callback: <K extends keyof T>(value: T[K], key: K) => U,
  ): U;
} = <T, U extends {}>(
  values: Dictionary<T> | T[],
  callback: (value: T, key: any) => U,
) => Object.entries(values).reduce((nextValues, [key, value]) => ({
  ...nextValues,
  ...callback(value, key),
}), {} as U);

export default mapWithKeys;
