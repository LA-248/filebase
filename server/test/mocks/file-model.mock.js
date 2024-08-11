import { jest } from '@jest/globals';

export const File = {
  storeFileInformation: jest.fn(),
  fetchAllStoredFiles: jest.fn(),
  fetchAllSharedFiles: jest.fn(),
  fetchAllDeletedFiles: jest.fn(),
  getFileDataByFileNameAndUserId: jest.fn(),
  deleteFileByFileNameAndUserId: jest.fn(),
};
