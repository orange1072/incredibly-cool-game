require('@testing-library/jest-dom');
require('jest-canvas-mock');
const nodeCrypto = require('crypto');
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => nodeCrypto.randomUUID(),
  },
});
