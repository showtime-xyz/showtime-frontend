function MMKV() {
  let storage = {};
  return {
    set: jest.fn((key, value) => {
      storage[key] = value;
      return null;
    }),
    getString: jest.fn((key) => {
      const result = storage[key] ? storage[key] : null;
      return result;
    }),
    delete: jest.fn((key: string) => {
      if (typeof storage[key] !== "undefined") {
        delete storage[key];
      }
    }),
    addOnValueChangedListener: jest.fn(),
    clearAll: jest.fn(() => (storage = {})),
    getAllKeys: jest.fn(() => Object.keys(storage)),
  };
}

module.exports = { MMKV };
