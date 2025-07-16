// Jest setup file for Crookmon game tests

// Global test setup
beforeAll(() => {
  // Setup global test environment
});

beforeEach(() => {
  // Reset any global state before each test
});

afterEach(() => {
  // Cleanup after each test
});

afterAll(() => {
  // Global cleanup
});

// Mock console methods if needed (uncomment if you want to suppress console logs in tests)
// console.log = jest.fn();
// console.warn = jest.fn();
// console.error = jest.fn();

// Set up global test utilities
global.testUtils = {
  // Create mock battle configuration
  createMockBattleConfig: () => ({
    participants: [
      { id: 'player1', name: 'Player 1', hp: 100, attack: 50, defense: 30 },
      { id: 'player2', name: 'Player 2', hp: 100, attack: 45, defense: 35 },
    ],
    seed: 12345,
    maxRounds: 100,
  }),

  // Create mock Pokemon/character
  createMockCharacter: (overrides = {}) => ({
    id: 'test-char',
    name: 'Test Character',
    level: 50,
    hp: 100,
    maxHp: 100,
    types: ['normal'],
    stats: {
      attack: 50,
      defense: 50,
      spAttack: 50,
      spDefense: 50,
    },
    ...overrides,
  }),

  // Create mock move
  createMockMove: (overrides = {}) => ({
    id: 'test-move',
    name: 'Test Move',
    type: 'normal',
    category: 'physical',
    power: 40,
    accuracy: 100,
    ...overrides,
  }),
};

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = global.testUtils;
}
