import path from 'path';
import sanitize from 'sanitize-filename';
import { Upload } from '@aws-sdk/lib-storage';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import { handleDuplicateNames } from '../services/duplicate-name-handler.mjs';
import { storeFileInformation, fetchLastFileUploaded } from '../models/files.mjs';

// Handle file uploads to S3
const uploadFile = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    let fileName = sanitize(req.file.originalname);

    // Check and modify file name if it's a duplicate
    fileName = await handleDuplicateNames(fileName, table, column, userId);

    // Upload file and its info to S3
    const uploader = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
      },
    });

    await uploader.done();

    // Retrieve file information on upload
    const folderName = req.body.folderName;
    const fileSizeBytes = req.file.size;
    const fileExtension = path.extname(fileName);
    const isFavourite = 'false';
    const shared = 'false';
    const deleted = 'false';

    // Convert file size from bytes to gigabytes
    const fileSize = (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(4);

    // Store relevant file information in database
    storeFileInformation(
      userId,
      folderName,
      fileName,
      fileSize,
      fileExtension,
      isFavourite,
      shared,
      deleted
    );
    fetchLastFileUploaded(userId);

    console.log(`File ${fileName} uploaded successfully`);
    res.status(200).json({ userId: userId, fileName: fileName });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).send('Error uploading file.');
  }
};

// Upload files that exist within a folder
const uploadFolder = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    const files = req.files;
    let uploadedFiles = [];

    // Store files uploaded from a folder in S3
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = sanitize(file.originalname);

      // Check and modify file name if it's a duplicate
      fileName = await handleDuplicateNames(fileName, table, column, userId);

      const uploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Body: file.buffer,
        },
      });

      await uploader.done();

      // Retrieve file metadata
      const folderName = sanitize(req.body['folderName' + i]);
      const fileSizeBytes = file.size;
      const fileExtension = path.extname(fileName);
      const isFavourite = 'false';
      const shared = 'false';
      const deleted = 'false';

      // Convert file size from bytes to gigabytes
      const fileSize = (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(4);

      // Store the metadata for each file uploaded in the database
      storeFileInformation(
        userId,
        folderName,
        fileName,
        fileSize,
        fileExtension,
        isFavourite,
        shared,
        deleted
      );
      fetchLastFileUploaded(userId);

      // Push the name of each file into an array
      uploadedFiles.push(fileName);
    }

    res.status(200).json({ fileNames: uploadedFiles });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('There was an error uploading your folder contents.');
  }
};

const uploadFromDropbox = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    const files = req.body;
    let uploadedFiles = [];

    // Store files uploaded from a folder in S3
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = sanitize(file.name);
      
      // Download the contents of each file using the link provided by Dropbox - this is then sent to S3
      const fileData = await fetch(file.link);

      // Check and modify file name if it's a duplicate
      fileName = await handleDuplicateNames(fileName, table, column, userId);

      const uploader = new Upload({
        client: s3Client,
        params: {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Body: fileData.body,
        },
      });

      await uploader.done();

      // Retrieve file metadata
      const folderName = sanitize(file.folderName);
      const fileSizeBytes = file.bytes;
      const fileExtension = path.extname(fileName);
      const isFavourite = 'false';
      const shared = 'false';
      const deleted = 'false';

      // Convert file size from bytes to gigabytes
      const fileSize = (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(4);

      // Store the metadata for each file uploaded in the database
      storeFileInformation(
        userId,
        folderName,
        fileName,
        fileSize,
        fileExtension,
        isFavourite,
        shared,
        deleted
      );
      fetchLastFileUploaded(userId);

      // Push the name of each file into an array
      uploadedFiles.push(fileName);
    }

    res.status(200).json({ fileNames: uploadedFiles });
  } catch (error) {
    console.error('Error importing from Dropbox:', error.message);
    res.status(500).send('Error importing from Dropbox, please try again');
  }
}

export { uploadFile, uploadFolder, uploadFromDropbox };
