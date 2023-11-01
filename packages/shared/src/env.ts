declare const process: {
  env: { NODE_ENV: string; };
};

function detectEnv() {
  try {
    if (process.env.NODE_ENV === 'development') {
      return 'development';
    }

    if (process.env.NODE_ENV === 'test') {
      return 'test';
    }

    return 'production';
  } catch {
    return false;
  }
}

const detectedEnv = detectEnv();

export const IS_DEV = detectedEnv === 'development';
export const IS_TEST = detectedEnv === 'test';
