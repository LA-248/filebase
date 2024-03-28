import path from 'path';
import fetch from 'node-fetch';
import { db } from '../services/database.mjs';
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Handle file previews for multiple file formats
export const previewFile = async (req, res) => {
  try {
    const query = 'SELECT f.fileName, f.folderName FROM files AS f WHERE f.fileName = ? AND f.userId = ?';
    const fileData = await getPresignedUrl(process.env.BUCKET_NAME, req.params.filename, null,  3600);

    db.get(query, [req.params.filename, req.user.id], async (err, rows) => {
      if (err) {
        console.error(`Database error: ${err.message}`);
        res.status(500).send('An unexpected error occurred.');
      }

      // Check if rows is null and fileName is undefined
      if (!rows || !rows.fileName) {
        // Render error page
        res.status(404).render('error.ejs', {
          title: 'File not found',
          errorDescription:
            'It looks like you are trying to access a file that does not exist.',
        });
        return;
      }

      const fileName = rows.fileName;
      const extension = path.extname(fileName);
      console.log(fileName);
      console.log(extension);

      // If the file is a PDF, it can be displayed using the browser's built-in PDF viewer
      if (extension === '.pdf') {
        const pdfFileData = await getPresignedUrl(process.env.BUCKET_NAME, req.params.filename, 'application/pdf',  3600);
        return res.redirect(pdfFileData);
        // Handle text file previews
      } else if (extension === '.txt') {
        // Fetch the file's text content using the S3 presigned URL
        const contentResponse = await fetch(fileData);
        const fileContent = await contentResponse.text();

        // Render the text file preview using the content of the file
        res.render('preview.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: fileContent,
          fileData: null,
          audioData: null,
          videoData: null,
        });
        // Handle audio file previews
      } else if (['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a', '.alac', '.wma'].includes(extension)) {
        res.render('preview.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: null,
          fileData: null,
          audioData: fileData,
          videoData: null,
        });
        // Handle video file previews
      } else if (['.mp4', '.webm', '.ogv'].includes(extension)) {
        res.render('preview.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: null,
          fileData: null,
          audioData: null,
          videoData: fileData,
        });
        // Handle previews for image files
      } else if (['.jpeg', '.jpg', '.png'].includes(extension)) {
        res.render('preview.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: null,
          fileData: fileData,
          audioData: null,
          videoData: null,
        });
      } else {
        res.status(415).render('error.ejs', {
          title: 'Unable to preview',
          errorDescription: 'This file format is not supported for previews.',
        });
      }
    });
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    res.status(500).send('An error occurred while trying to preview the file.');
  }
};
