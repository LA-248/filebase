import fetch from 'node-fetch';
import config from '../config/formats.json' assert { type: 'json' };
import { File } from '../models/file-model.mjs';
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Handle previews for shared files - both for individual files and those that are being viewed from a shared folder
export const viewSharedFile = async (req, res) => {
  try {
    let row;

    // Handle individual file previews
    if (req.params.uuid) {
      row = await File.getFileDataByUuid(req.params.uuid);
    } else if (req.params.userId && req.params.filename) {
      // Handle previews for files that exist within a shared folder
      row = await File.getFileDataByFileNameAndUserIdAndSharedStatus(req.params.filename, req.params.userId, 'true');
    } else {
      // Return an error if the required parameters are missing
      return res.status(400).json({ message: 'An unexpected error occurred. Please try again.' });
    }

    if (!row || !row.fileName) {
      res.status(404).render('pages/error.ejs', {
        title: 'File not found',
        errorDescription: 'The file you are trying to view does not exist',
      });
      return;
    }

    const { fileName, folderName, fileExtension } = row;
    const fileData = await getPresignedUrl(process.env.BUCKET_NAME, fileName, null, 604800);

    // If the file is a PDF, it can be displayed using the browser's built-in PDF viewer
    if (fileExtension === '.pdf') {
      const pdfFileData = await getPresignedUrl(process.env.BUCKET_NAME, fileName, 'application/pdf', 604800);
      return res.redirect(pdfFileData);
      // Handle shared link previews for text files
    } else if (config.text.includes(fileExtension)) {
      // Fetch the file's text content using the presigned URL
      const contentResponse = await fetch(fileData);
      const fileContent = await contentResponse.text();

      // Render the text file preview using the content of the file
      res.render('pages/shared-file.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: fileContent,
        fileData: null,
        audioData: null,
        videoData: null,
      });
      // Preview audio files
    } else if (config.audio.includes(fileExtension)) {
      res.render('pages/shared-file.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: null,
        fileData: null,
        audioData: fileData,
        videoData: null,
      });
      // Preview video files
    } else if (config.video.includes(fileExtension)) {
      res.render('pages/shared-file.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: null,
        fileData: null,
        audioData: null,
        videoData: fileData,
      });
      // Handle previews for images
    } else if (config.image.includes(fileExtension)) {
      res.render('pages/shared-file.ejs', {
        fileName: fileName,
        folderName: folderName,
        textFilePreview: null,
        fileData: fileData,
        audioData: null,
        videoData: null,
      });
    } else {
      // Render an error page if the file format does not match any that exist in the config
      res.status(415).render('pages/error.ejs', {
        title: 'Unable to preview',
        errorDescription: 'This file format is not supported for previews',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while trying to preview the file.');
  }
};
