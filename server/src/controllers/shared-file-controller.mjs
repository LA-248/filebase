import fetch from 'node-fetch';
import config from '../config/formats.json' assert { type: 'json' };
import { db } from '../services/database.mjs';
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Handle previews for shared files - both for individual files and those that are being viewed from a shared folder
export const viewSharedFile = (req, res) => {
  // Determine the query and parameters based on request parameters
  let query, parameters;

  // Handle individual file previews
  if (req.params.uuid) {
    query = 'SELECT f.fileName, f.folderName, f.fileExtension FROM files AS f WHERE f.uuid = ?';
    parameters = [req.params.uuid];
  } else if (req.params.userId && req.params.filename) { // Handle previews for files that exist within a shared folder
    query = 'SELECT f.fileName, f.folderName, f.fileExtension FROM files AS f JOIN folders fo ON f.folderName = fo.folderName WHERE f.fileName = ? AND f.userId = ? AND fo.shared = ?';
    parameters = [req.params.filename, req.params.userId, 'true'];
  } else {
    // Return an error if the required parameters are missing
    res.status(400).send('Missing required parameters.');
    return;
  }

  try {
    db.get(query, parameters, async (err, row) => {
      if (err) {
        console.error(`Database error: ${err.message}`);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      if (!row || !row.fileName) {
        res.status(404).render('error.ejs', {
          title: 'File not found',
          errorDescription: 'The file you are trying to view does not exist',
        });
        return;
      }

      const fileName = row.fileName;
      const extension = row.fileExtension;

      const fileData = await getPresignedUrl(process.env.BUCKET_NAME, fileName, null, 604800);

      // If the file is a PDF, it can be displayed using the browser's built-in PDF viewer
      if (extension === '.pdf') {
        const pdfFileData = await getPresignedUrl(process.env.BUCKET_NAME, fileName, 'application/pdf', 604800);
        return res.redirect(pdfFileData);
        // Handle shared link previews for text files
      } else if (config.text.includes(extension)) {
        // Fetch the file's text content using the presigned URL
        const contentResponse = await fetch(fileData);
        const fileContent = await contentResponse.text();

        // Render the text file preview using the content of the file
        res.render('shared-file.ejs', {
          fileName: fileName,
          folderName: row.folderName,
          textFilePreview: fileContent,
          fileData: null,
          audioData: null,
          videoData: null,
        });
        // Preview audio files
      } else if (config.audio.includes(extension)) {
        res.render('shared-file.ejs', {
          fileName: fileName,
          folderName: row.folderName,
          textFilePreview: null,
          fileData: null,
          audioData: fileData,
          videoData: null,
        });
        // Preview video files
      } else if (config.video.includes(extension)) {
        res.render('shared-file.ejs', {
          fileName: fileName,
          folderName: row.folderName,
          textFilePreview: null,
          fileData: null,
          audioData: null,
          videoData: fileData,
        });
        // Handle previews for images
      } else if (config.image.includes(extension)) {
        res.render('shared-file.ejs', {
          fileName: fileName,
          folderName: row.folderName,
          textFilePreview: null,
          fileData: fileData,
          audioData: null,
          videoData: null,
        });
      } else {
        // Render an error page if the file format does not match any of the above
        res.status(415).render('error.ejs', {
          title: 'Unable to preview',
          errorDescription: 'This file format is not supported for previews',
        });
      }
    });
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    res.status(500).send('An error occurred while trying to preview the file.');
  }
};
