import { jest } from '@jest/globals';

// Mock the database setup
jest.mock('../../src/services/database.mjs', () => ({
  setupDatabase: jest.fn(),
  db: {
    run: jest.fn(),
    get: jest.fn(),
    close: jest.fn((done) => done()),
  },
}));
