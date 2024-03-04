import path from 'path';
import { db } from '../services/database.mjs';
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Handle file previews for multiple file formats
export const previewFile = async (req, res) => {
  try {
    const query = 'SELECT * FROM files AS f WHERE f.fileName = ? AND f.userId = ?';
    const fileData = await getPresignedUrl(process.env.BUCKET_NAME, req.params.filename, 3600);

    db.get(query, [req.params.filename, req.user.id], (err, rows) => {
      if (err) {
        console.error(`Database error: ${err.message}`);
        res.status(500).send('An unexpected error occurred.');
      }

      const fileName = rows.fileName;
      const extension = path.extname(fileName);
      console.log(fileName);
      console.log(extension);

      // If the file is a PDF, the browser will automatically display it using the built-in PDF viewer
      if (extension === '.pdf') {
        res.setHeader('Content-Type', 'application/pdf');
        res.send(fileData);
      } else if (extension === '.txt') {
        let textContent = rows.fileData.toString();
        // Remove whitespace from both ends of the string
        textContent = textContent.trim();
        // Render the preview of the text file in a separate page
        res.render('preview.ejs', {
          fileName: fileName,
          folderName: rows.folderName,
          textFilePreview: textContent,
          fileData: null,
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
      } else {
        // Render the preview in a separate page
        res.render('preview.ejs', {
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
