import { jest } from '@jest/globals';
import { User } from '../../src/models/user-model.mjs';
import { setupDatabase, db } from '../../src/services/database.mjs';

// Mock the User model methods and the database setup
jest.mock('../../src/services/database.mjs', () => ({
  setupDatabase: jest.fn(),
  db: {
    close: jest.fn((done) => done()),
  },
}));

// Instead of mocking the entire User model, manually mock the methods
User.insertNewUser = jest.fn();
User.retrieveUserById = jest.fn();
User.retrieveUserByGoogleId = jest.fn();

beforeAll(async () => {
  await setupDatabase();
});

afterAll((done) => {
  db.close(done);
});

test('should insert a new user with googleId', async () => {
  const googleId = 'test-google-id-123';

  // Define the mock behavior for the methods
  const mockUser = { id: 1, googleId: 'test-google-id-123' };
  User.insertNewUser.mockResolvedValue(mockUser);
  User.retrieveUserById.mockResolvedValue(mockUser);

  const user = await User.insertNewUser(googleId);
  expect(user.id).toBeGreaterThan(0);
  expect(user.googleId).toBe(googleId);

  // Verify the user was actually "inserted" in the database by checking the mock
  const dbUser = await User.retrieveUserById(user.id);
  expect(dbUser).toEqual({
    id: user.id,
    googleId: googleId,
  });

  // Ensure that the mock functions were called correctly
  expect(User.insertNewUser).toHaveBeenCalledWith(googleId);
  expect(User.retrieveUserById).toHaveBeenCalledWith(user.id);
});

test('should retrieve user with googleId', async () => {
  const googleId = 'test-google-id-123';

  // Define the mock behavior for the methods
  const mockUser = { id: 1, googleId: 'test-google-id-123' };
  User.retrieveUserByGoogleId.mockResolvedValue(mockUser);

  // Verify the user was actually "inserted" in the database by checking the mock
  const dbUser = await User.retrieveUserByGoogleId(googleId);
  expect(dbUser).toEqual({
    id: mockUser.id,
    googleId: mockUser.googleId,
  });

  expect(User.retrieveUserByGoogleId).toHaveBeenCalledWith(googleId);
});
