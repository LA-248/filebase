import { User } from '../../../src/models/user-model.mjs';
import { setupDatabase, db } from '../../../src/services/database.mjs';

beforeAll(async () => {
  await setupDatabase();
});

afterAll((done) => {
  db.close(done);
});

test('should insert a new user with googleId', async () => {
  const googleId = 'test-google-id-123';
  const user = await User.insertNewUser(googleId);
  expect(user.id).toBeGreaterThan(0);
  expect(user.googleId).toBe(googleId);

  // Verify the user was actually inserted in the database
  const dbUser = await User.retrieveUserById(user.id);
  expect(dbUser).toEqual({
    id: user.id,
    googleId: googleId,
  });
});
