// jest.setup.js

// Define global.import_meta if it doesn't exist
if (typeof global.import_meta === 'undefined') {
  global.import_meta = {};
}

// Mock import.meta.env for Jest
global.import_meta.env = {
    VITE_USE_FIREBASE: 'false', // Or 'true' depending on what you want to test
    // Add other VITE_ variables as needed
};
