import { s3Client } from '../services/get-presigned-aws-url.mjs';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { File } from '../models/file-model.mjs';

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
    throw new Error('S3 delete error:', error.message);
  }
};

// Mark file as deleted
const markFileAsDeleted = async (req, res) => {
  try {
    const deleted = 'true';
    const fileName = req.params.filename;
    const userId = req.user.id;

    await File.updateFileDeletionStatus(deleted, fileName, userId);
    return res.status(200).json({ success: 'File marked as deleted.' });
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

    await File.updateFileDeletionStatus(deleted, fileName, userId);
    return res.status(200).json({ success: 'File restored.' });
  } catch (error) {
    console.error('Error restoring file:', error);
    return res.status(500).json({ message: 'Error restoring the file. Please try again.' });
  }
}

// Permanently delete the file from the database and S3
const permanentlyDeleteFile = async (req, res) => {
  try {
    const fileName = req.params.filename;

    await File.permanentlyDeleteFileFromDatabase(fileName, req.user.id);
    console.log(`Database: File ${fileName} was successfully deleted`);

    // Proceed to delete file from S3 only if the database deletion succeeds
    await deleteS3Object(fileName);
    console.log(`S3: File ${fileName} was successfully deleted`);

    return res.status(200).json({ success: 'File was successfully deleted.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting file. Please try again.' });
  }
};

export { deleteS3Object, markFileAsDeleted, restoreDeletedFile, permanentlyDeleteFile };
