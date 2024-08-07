import path from 'path';
import sanitize from 'sanitize-filename';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { File } from '../models/file-model.mjs';
import { Folder } from '../models/folder-model.mjs';
import { Upload } from '@aws-sdk/lib-storage';
import { HeadObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../services/get-presigned-aws-url.mjs';
import { handleDuplicateNames } from '../utils/duplicate-name-handler.mjs';

// Upload file directly to S3 using multer-s3
const s3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.BUCKET_NAME,
    key: async function (req, file, cb) {
      try {
        const fileName = await handleDuplicateNames(file.originalname, 'files', 'fileName', req.user.id);
        cb(null, fileName);
      } catch (error) {
        cb(error.message);
      }
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 * 1024 },
});

// Retrieves the size of a file stored in Amazon S3 in bytes
// Using multer-s3 to retrieve file sizes would not work for larger files (it would just return 0), so it's necessary to fetch file size metadata directly from S3 instead
const getObjectMetadata = async (bucketName, objectKey) => {
  try {
    const command = new HeadObjectCommand({ Bucket: bucketName, Key: objectKey });
    const response = await s3Client.send(command);
    return response.ContentLength; // File size in bytes
  } catch (error) {
    console.error('Error retrieving file size from S3:', error.message);
    return res.status(400).json({ message: 'Error uploading your file. Please try again.' });
  }
};

// Handle storage of file metadata to the database on upload of individual files
const uploadFile = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    let fileName = sanitize(req.file.key); // multer-s3 sets the file key here after upload

    // Check and modify file name if it's a duplicate
    fileName = await handleDuplicateNames(fileName, table, column, userId);

    // Retrieve file information on upload
    const rootFolder = req.body.rootFolder;
    const folderName = req.body.folderName;
    const fileSizeBytes = await getObjectMetadata(process.env.BUCKET_NAME, fileName);
    const fileExtension = path.extname(fileName);
    const isFavourite = 'false';
    const shared = 'false';
    const deleted = 'false';

    // Convert file size from bytes to gigabytes
    const fileSize = (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(4);

    // Store relevant file information in database
    await File.storeFileInformation(
      userId,
      rootFolder,
      folderName,
      fileName,
      fileSize,
      fileExtension,
      isFavourite,
      shared,
      deleted
    );
    await File.fetchLastFileUploaded(userId);

    console.log(`File ${fileName} uploaded successfully`);
    return res.status(200).json({ userId: userId, fileName: fileName });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ message: 'Error uploading file. Please try again.' });
  }
};

// Store metadata of files that exist within a folder
const uploadFolder = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    const files = req.files;
    let uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = sanitize(file.key);

      // Check and modify file name if it's a duplicate
      fileName = await handleDuplicateNames(fileName, table, column, userId);

      // Retrieve file metadata
      const rootFolder = req.body['rootFolder' + i];
      const folderName = sanitize(req.body['folderName' + i]);
      const fileSizeBytes = await getObjectMetadata(process.env.BUCKET_NAME, fileName);
      const fileExtension = path.extname(fileName);
      const isFavourite = 'false';
      const shared = 'false';
      const deleted = 'false';

      // Convert file size from bytes to gigabytes
      const fileSize = (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(4);

      await File.storeFileInformation(
        userId,
        rootFolder,
        folderName,
        fileName,
        fileSize,
        fileExtension,
        isFavourite,
        shared,
        deleted
      );
      await File.fetchLastFileUploaded(userId);

      // Store the names of each file in an array so it can be sent to the frontend to be displayed in the UI
      uploadedFiles.push(fileName);
    }

    return res.status(200).json({ fileNames: uploadedFiles });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: 'Error uploading folder contents. Please try again.' });
  }
};

const uploadFromDropbox = async (req, res) => {
  try {
    const table = 'files';
    const column = 'fileName';

    const userId = req.user.id;
    const files = req.body;
    let uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      let fileName = sanitize(file.name);

      // Download the contents of each file using the link provided by Dropbox - this is then sent to S3
      const fileData = await fetch(file.link);

      fileName = await handleDuplicateNames(fileName, table, column, userId);

      // Upload files and their info to S3 using the AWS SDK
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
      const rootFolder = sanitize(file.rootFolder);
      const folderName = sanitize(file.folderName);
      const fileSizeBytes = file.bytes;
      const fileExtension = path.extname(fileName);
      const isFavourite = 'false';
      const shared = 'false';
      const deleted = 'false';

      const fileSize = (fileSizeBytes / (1024 * 1024 * 1024)).toFixed(4);

      await File.storeFileInformation(
        userId,
        rootFolder,
        folderName,
        fileName,
        fileSize,
        fileExtension,
        isFavourite,
        shared,
        deleted
      );
      await File.fetchLastFileUploaded(userId);

      uploadedFiles.push(fileName);
    }

    return res.status(200).json({ fileNames: uploadedFiles });
  } catch (error) {
    console.error('Error importing from Dropbox:', error.message);
    res.status(500).json({ message: 'Error importing from Dropbox. Please try again.' });
  }
};

export { uploadFile, uploadFolder, uploadFromDropbox, s3Upload };
