import path from 'path';
import { db } from '../services/database.mjs';
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Handle file previews for multiple file formats
export const viewSharedFile = (req, res) => {
  try {
    const query = 'SELECT * FROM files AS f WHERE f.uuid = ?';

    db.get(query, [req.params.uuid], async (err, rows) => {
      if (err) {
        console.error(`Database error: ${err.message}`);
        res.status(500).send('An unexpected error occurred.');
        return;
      }

      // Check if rows is null and fileName is undefined
      if (!rows || !rows.fileName) {
        // Render a 'file not found' page
        res.status(404).render('file-not-found.ejs');
        return;
      }

      const fileName = rows.fileName;
      const extension = path.extname(fileName);
      console.log(fileName);
      console.log(extension);

      const fileData = await getPresignedUrl(process.env.BUCKET_NAME, fileName, 604800);

      // If the file is a PDF, the browser will automatically display it using the built-in PDF viewer
      if (extension === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.send(fileData);
      } else if (extension === '.txt') {
        res.json({ url: fileData });
        // Preview audio files
      } else if (['.mp3', '.wav', '.aac', '.flac', '.ogg', '.m4a', '.alac', '.wma'].includes(extension)) {
        res.render('view-shared-file.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: null,
          fileData: null,
          audioData: fileData,
          videoData: null,
        });
        // Preview video files
      } else if (['.mp4', '.webm', '.ogv'].includes(extension)) {
        res.render('view-shared-file.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: null,
          fileData: null,
          audioData: null,
          videoData: fileData,
        });
      } else {
        // Render the preview in a separate page
        res.render('view-shared-file.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: null,
          fileData: fileData,
          audioData: null,
          videoData: null,
        });
      }
    });
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
    res.status(500).send('An error occurred while trying to preview the file.');
  }
};
