import { s3Client } from '../services/get-presigned-aws-url.mjs';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { updateFileDeletionStatus } from '../models/files/update.mjs';
import { permanentlyDeleteFileFromDatabase } from '../models/files/delete.mjs';

// Delete the file from S3
const deleteS3Object = async (objectKey) => {
  try {
    const data = await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: objectKey,
      })
    );
    console.log('Success:', data);
  } catch (error) {
    console.error('S3 error:', error);
    throw new Error('S3 error:', error.message);
  }
};

// Mark file as deleted
const markFileAsDeleted = async (req, res) => {
  try {
    const deleted = 'true';
    const fileName = req.params.filename;
    const userId = req.user.id;

    await updateFileDeletionStatus(deleted, fileName, userId);
    return res.status(200).json('File marked as deleted.');
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).json({ message: 'Error deleting the file. Please try again.' });
  }
}

// Restore a file that was marked as deleted
const restoreDeletedFile = async (req, res) => {
  try {
    const deleted = 'false';
    const fileName = req.params.filename;
    const userId = req.user.id;

    await updateFileDeletionStatus(deleted, fileName, userId);
    return res.status(200).json('File restored.');
  } catch (error) {
    console.error('Error restoring file:', error);
    return res.status(500).json({ message: 'Error restoring the file. Please try again.' });
  }
}

// Permanently delete the file from the database and S3
const permanentlyDeleteFile = async (req, res) => {
  try {
    await permanentlyDeleteFileFromDatabase(req.params.filename, req.user.id);
    console.log(`Database: File ${req.params.filename} was successfully deleted`);

    // Proceed to delete file from S3 only if the database deletion succeeds
    await deleteS3Object(req.params.filename);
    console.log(`S3: File ${req.params.filename} was successfully deleted`);

    return res.status(200).json('File was successfully deleted.');
  } catch (error) {
    console.error('Error permanently deleting file:', error);
    return res.status(500).json({ message: 'Error deleting file. Please try again.' });
  }
};

export { deleteS3Object, markFileAsDeleted, restoreDeletedFile, permanentlyDeleteFile };
