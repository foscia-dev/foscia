import { ModelInstance } from '@foscia/core';
import type FileMock from './file.mock';

type Models = {
  files: FileMock;
};

declare global {
  namespace Foscia {
    interface CustomTypes {
      models: {
        files: FileMock;
        [x: string]: ModelInstance;
      };
    }
  }
}
