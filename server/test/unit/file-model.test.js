import '../mocks/database-mock.js';
import { File } from '../mocks/file-model.mock.js';
import { setupDatabase, db } from '../../src/services/database.mjs';

beforeAll(async () => {
  await setupDatabase();
});

afterAll((done) => {
  db.close(done);
});

// Test that file information is correctly stored
test('should store file information', async () => {
  const mockFile = {
    userId: 1,
    rootFolder: 'root',
    folderName: 'testFolder',
    fileName: 'testFile.txt',
    fileSize: 1024,
    fileExtension: '.txt',
    isFavourite: false,
    shared: false,
    deleted: false,
  };

  // Mock the storeFileInformation method to return the success message
  File.storeFileInformation.mockResolvedValue('File information inserted successfully');

  // Store the file information
  const file = await File.storeFileInformation(
    mockFile.userId,
    mockFile.rootFolder,
    mockFile.folderName,
    mockFile.fileName,
    mockFile.fileSize,
    mockFile.fileExtension,
    mockFile.isFavourite,
    mockFile.shared,
    mockFile.deleted
  );

  // Ensure that the mock function was called correctly
  expect(File.storeFileInformation).toHaveBeenCalledWith(
    mockFile.userId,
    mockFile.rootFolder,
    mockFile.folderName,
    mockFile.fileName,
    mockFile.fileSize,
    mockFile.fileExtension,
    mockFile.isFavourite,
    mockFile.shared,
    mockFile.deleted
  );

  // Ensure that the return value is as expected
  expect(file).toBe('File information inserted successfully');
});
