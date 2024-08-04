import { getFileSize } from '../models/files/fetch.mjs';

const retrieveTotalUsedStoragePerUser = async (userId) => {
  try {
    const rows = await getFileSize(userId);
    // Sum the fileSize from each row - this gives us the total amount of storage the user has used
    const totalUsedStorage = rows.reduce((acc, row) => acc + row.fileSize, 0);
    return totalUsedStorage.toFixed(2);
  } catch (error) {
    throw new Error('Failed to retrieve total used storage.');
  }
};

export { retrieveTotalUsedStoragePerUser };
