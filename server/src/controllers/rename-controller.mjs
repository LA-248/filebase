import sanitize from 'sanitize-filename';
import { db } from '../services/database.mjs';
import { handleDuplicateNames } from '../utils/duplicate-name-handler.mjs';
import { deleteS3Object } from './delete-file-controller.mjs';
import { CopyObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import { updateFileName } from '../models/files/update.mjs';
import path from 'path';
import { updateFileParentFolder, updateFolderName, updateFolderParentFolder } from '../models/folders/update.mjs';

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
  } catch (error) {
    throw new Error(`S3 copy error: ${error.message}`);
  }
};

// TODO: Use database transactions to rollback on partial failures
const renameFile = async (req, res) => {
  let newName = sanitize(req.body.newName);
  const table = 'files';
  const column = 'fileName';
  const userId = req.user.id;
  const fileName = req.params.name;
  const extension = path.extname(fileName);

  if (newName === '') {
    return res.status(400).json({ message: 'Please enter a name' });
  }

  try {
    newName = await handleDuplicateNames(newName, table, column, userId);
    newName += extension;

    // Copy the file in S3 with the new name
    await copyS3Object(process.env.BUCKET_NAME, fileName, process.env.BUCKET_NAME, newName);

    // Update the file name in the database
    await updateFileName(newName, userId, fileName);

    // Delete the old S3 object
    await deleteS3Object(fileName);

    // Send back the renamed file to the frontend so the name can instantly be updated in the UI with the file's extension
    return res.status(200).json({ finalNewName: newName });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error renaming file. Please try again.' });
  }
};

const renameFolder = async (req, res) => {
  try {
    let newName = sanitize(req.body.newName);
    const table = 'folders';
    const column = 'folderName';
    const userId = req.user.id;
    const folderName = req.params.name;
  
    if (newName === '') {
      return res.status(400).json('Please enter a name');
    };
  
    newName = await handleDuplicateNames(newName, table, column, userId);
   
    // Update the name of the folder
    await updateFolderName(newName, userId, folderName);
    // Need to also update parent folder associations in the database
    await updateFolderParentFolder(newName, userId, folderName);
    await updateFileParentFolder(newName, userId, folderName);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error renaming folder. Please try again.' });
  }
};

export { renameFile, renameFolder };
