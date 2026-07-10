const fs = require('fs');
const path = require('path');

// Mock localStorage and window
const backupData = {};
global.localStorage = {
  getItem: () => null,
  setItem: (key, val) => {
    backupData[key] = JSON.parse(val);
  },
  removeItem: () => {},
  clear: () => {}
};
global.window = {
  dispatchEvent: () => {}
};
global.Event = class {};

// Mock other browser files/imports if needed
// We will compile the typescript file to javascript or parse it
// Wait! Let's write a simple script that mocks the exact data from demoSeedingService.ts and dumps it.
