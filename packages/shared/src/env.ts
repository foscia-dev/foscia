declare const process: {
  env: { NODE_ENV: string; };
};

const detectEnv = () => {
  try {
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    }

    if (process.env.NODE_ENV === 'test') {
      return 'test';
    }

    return 'production';
  } catch {
    return 'production';
  }
};

const detectedEnv = detectEnv();

/**
 * `true` if node detected env is `development`.
 *
 * @internal
 */
export const IS_DEV = detectedEnv === 'development';

/**
 * `true` if node detected env is `test`.
 *
 * @internal
 */
export const IS_TEST = detectedEnv === 'test';
