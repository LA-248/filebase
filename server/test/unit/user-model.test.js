import '../mocks/database-mock.js';
import { User } from '../mocks/user-model.mock.js';
import { setupDatabase, db } from '../../src/services/database.mjs';

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

test('should retrieve user by googleId', async () => {
  const googleId = 'test-google-id-123';

  // Define the mock behavior for the method
  const mockUser = { id: 1, googleId: 'test-google-id-123' };
  User.retrieveUserByGoogleId.mockResolvedValue(mockUser);

  const dbUser = await User.retrieveUserByGoogleId(googleId);
  expect(dbUser).toEqual({
    id: mockUser.id,
    googleId: mockUser.googleId,
  });

  expect(User.retrieveUserByGoogleId).toHaveBeenCalledWith(googleId);
});

test('should retrieve user by id', async () => {
  const id = 1;

  // Define the mock behavior for the method
  const mockUser = { id: 1, googleId: 'test-google-id-123' };
  User.retrieveUserById.mockResolvedValue(mockUser);

  const dbUser = await User.retrieveUserById(id);
  expect(dbUser).toEqual({
    id: mockUser.id,
    googleId: mockUser.googleId,
  });

  expect(User.retrieveUserById).toHaveBeenCalledWith(id);
});

test('should delete a user by id', async () => {
  const id = 1;

  // Define the mock behavior for the method
  const mockResponse = 'User deleted successfully';
  User.deleteUserById.mockResolvedValue(mockResponse);

  const response = await User.deleteUserById(id);

  expect(response).toEqual('User deleted successfully');
  expect(User.deleteUserById).toHaveBeenCalledWith(id);
});
