import { jest } from '@jest/globals';

export const User = {
  insertNewUser: jest.fn(),
  retrieveUserById: jest.fn(),
  retrieveUserByGoogleId: jest.fn(),
  deleteUserById: jest.fn(),
}
