import sanitize from 'sanitize-filename';
import { db } from '../services/database.mjs';
import { handleDuplicateNames } from '../services/duplicate-name-handler.mjs';
import { deleteS3Object } from './delete-file-controller.mjs';
import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import path from 'path';

// Copy an object in S3
// This is done so the file gets saved to S3 under the new name - essentially a renamed copy of the old file is made
const copyS3Object = async (sourceBucket, sourceKey, destinationBucket, destinationKey) => {
  try {
    const data = await s3Client.send(
      new CopyObjectCommand({
        CopySource: `${sourceBucket}/${sourceKey}`,
        Bucket: destinationBucket,
        Key: destinationKey,
      })
    );
    console.log('Success:', data);
  } catch (err) {
    console.error('Error:', err.message);
  }
};

const renameFile = async (req, res) => {
  const updateFileName = 'UPDATE files SET fileName = ? WHERE userId = ? AND fileName = ?';

  let newName = sanitize(req.body.newName);
  const table = 'files';
  const column = 'fileName';
  const userId = req.user.id;
  const extension = path.extname(req.params.name);

  if (newName === '') {
    res.status(400).json('Please enter a name');
    return;
  };

  newName = await handleDuplicateNames(newName, table, column, userId);
  newName += extension;
 
  // TODO -- Use transactions to ensure data integrity
  try {
    await copyS3Object(process.env.BUCKET_NAME, req.params.name, process.env.BUCKET_NAME, newName); // Save file under new name in S3

    db.run(updateFileName, [newName, userId, req.params.name], async (err) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).send('An unexpected error occurred.');
      }

      // Only delete the old S3 object if the database is successfully updated
      try {
        await deleteS3Object(req.params.name);
        // Send back the renamed file to the frontend so the name can instantly be updated in the UI with the file's extension
        res.status(200).json({ finalNewName: newName });
      } catch (error) {
        console.error('S3 delete error:', error.message);
        res.status(500).send('There was an error when trying to delete the file in S3.');
      }
    });
  } catch (error) {
    console.error('S3 copy error:', copyError.message);
    res.status(500).send('Failed to copy file in S3.');
  }
}

const renameFolder = async (req, res) => {
  const updateFolderName = 'UPDATE folders SET folderName = ? WHERE userId = ? AND folderName = ?';
  // The below queries update 'parentFolder' in 'folders' and 'folderName' in 'files' for changed parent directory associations
  const updateFolderParentFolder = 'UPDATE folders SET parentFolder = ? WHERE userId = ? AND parentFolder = ?';
  const updateFileParentFolder = 'UPDATE files SET folderName = ? WHERE userId = ? AND folderName = ?';

  let newName = sanitize(req.body.newName);
  const table = 'folders';
  const column = 'folderName';
  const userId = req.user.id;

  if (newName === '') {
    res.status(400).json('Please enter a name');
    return;
  };

  newName = await handleDuplicateNames(newName, table, column, userId);
 
  // Execute the next database update only after the previous update completes successfully
  // Using nesting ensures that operations that depend on the outcome of previous ones are handled correctly and sequentially
  db.run(updateFolderName, [newName, userId, req.params.name], (err) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).send('An unexpected error occurred.');
    }

    db.run(updateFileParentFolder, [newName, userId, req.params.name], (err) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).send('An unexpected error occurred.');
      }

      db.run(updateFolderParentFolder, [newName, userId, req.params.name], (err) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).send('An unexpected error occurred.');
        }
        res.status(200).json({ finalNewName: newName });
      });
    });
  });
};

export { renameFile, renameFolder };
