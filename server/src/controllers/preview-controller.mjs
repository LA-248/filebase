import fetch from 'node-fetch';
import config from '../config/formats.json' assert { type: 'json' };
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';
import { getFileData } from '../models/files.mjs';

// Handle file previews for multiple file formats
export const previewFile = async (req, res) => {
  try {
    const filename = req.params.filename;
    const userId = req.user.id;

    // Get file data from the database
    const row = await getFileData(filename, userId);

    if (!row || !row.fileName) {
      res.status(404).render('pages/error.ejs', {
        title: 'File not found',
        errorDescription: 'It looks like you are trying to access a file that does not exist.',
      });
      return;
    }

    const { fileName, folderName, fileExtension } = row;
    // Generate S3 presigned URL to use for previews
    const fileData = await getPresignedUrl(process.env.BUCKET_NAME, filename, null, 3600);

    // If the file is a PDF, it can be displayed using the browser's built-in PDF viewer
    if (fileExtension === '.pdf') {
      const pdfFileData = await getPresignedUrl(process.env.BUCKET_NAME, filename, 'application/pdf', 3600);
      return res.redirect(pdfFileData);
      // Handle text file previews
    } else if (config.text.includes(fileExtension)) {
      // Fetch the file's text content using the S3 presigned URL
      const contentResponse = await fetch(fileData);
      const fileContent = await contentResponse.text();
      // Render the text file preview using the content of the file
      return res.render('pages/preview.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: fileContent,
        fileData: null,
        audioData: null,
        videoData: null,
      });
      // Handle audio file previews
    } else if (config.audio.includes(fileExtension)) {
      return res.render('pages/preview.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: null,
        fileData: null,
        audioData: fileData,
        videoData: null,
      });
      // Handle video file previews
    } else if (config.video.includes(fileExtension)) {
      res.render('pages/preview.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: null,
        fileData: null,
        audioData: null,
        videoData: fileData,
      });
      // Handle previews for image files
    } else if (config.image.includes(fileExtension)) {
      return res.render('pages/preview.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: null,
        fileData: fileData,
        audioData: null,
        videoData: null,
      });
    } else {
      return res.status(415).render('pages/error.ejs', {
        title: 'Unable to preview',
        errorDescription: 'This file format is not supported for previews',
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('An error occurred while trying to preview the file.');
  }
};
