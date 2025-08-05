export default function temporaryBackup<T, U>(
  callback: () => T,
  createBackup: () => U,
  restoreBackup: (affected: U) => void,
): T {
  const backup = createBackup();
  let restoreImmediately = true;

  try {
    const value = callback();
    if (value instanceof Promise) {
      restoreImmediately = false;

      return value.finally(() => {
        restoreBackup(backup);
      }) as T;
    }

    return value as T;
  } finally {
    if (restoreImmediately) {
      restoreBackup(backup);
    }
  }
}
