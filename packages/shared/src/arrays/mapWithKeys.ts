import { Dictionary } from '@foscia/shared/types';

const mapWithKeys: {
  /**
   * Map array to an object.
   *
   * @param values
   * @param callback
   *
   * @internal
   */<T, U extends {}>(
    values: T[],
    callback: (value: T, key: number) => U,
  ): U;
  /**
   * Map object to another object.
   *
   * @param values
   * @param callback
   *
   * @internal
   */<T extends {}, U extends {}>(
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
