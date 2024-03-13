import { db } from '../services/database.mjs';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import { promisify } from 'util';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

// Promisify the db.run method
const dbRunAsync = promisify(db.run.bind(db));

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
  } catch (err) {
    console.error('Error:', err.message);
  }
};

// Mark file as deleted
const markFileAsDeleted = async (req, res) => {
  const query = 'UPDATE files SET deleted = ? WHERE fileName = ? AND userId = ?';

  const deleted = 'true';

  db.run(query, [deleted, req.params.filename, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json('File marked as deleted.');
  });
}

// Restore a file that was marked as deleted
const restoreDeletedFile = async (req, res) => {
  const query = 'UPDATE files SET deleted = ? WHERE fileName = ? AND userId = ?';

  const deleted = 'false';

  db.run(query, [deleted, req.params.filename, req.user.id], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
      return;
    }

    res.status(200).json('File restored.');
  });
}

// Permanently delete the file from the database and S3
const permanentlyDeleteFile = async (req, res) => {
  const query = 'DELETE FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  try {
    await dbRunAsync(query, [req.params.filename, req.user.id]);
    console.log(`Database: File ${req.params.filename} was successfully deleted`);

    // Proceed to delete file from S3 only if the database deletion succeeds
    await deleteS3Object(req.params.filename);
    console.log(`S3: File ${req.params.filename} was successfully deleted`);

    res.status(200).json('File was successfully deleted.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting file.');
  }
};

export { deleteS3Object, markFileAsDeleted, restoreDeletedFile, permanentlyDeleteFile };
