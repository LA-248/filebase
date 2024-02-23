import path from 'path';
import { db } from '../services/database.mjs';

// Handle the viewing of shared files
export const viewSharedFile = (req, res) => {
  const query = 'SELECT * FROM files AS f WHERE f.uuid = ?';

  db.get(query, [req.params.uuid], (err, rows) => {
    const fileName = rows.fileName;
    const extension = path.extname(fileName);
    console.log(fileName);
    console.log(extension);

    if (err) {
      console.error('Database error:', err.message);
      res.status(500).send('An unexpected error occurred.');
    } else if (extension === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.send(rows.fileData);
    } else if (extension === '.txt') {
      let textContent = rows.fileData.toString();

      // Remove whitespace from both ends of the string
      textContent = textContent.trim();

      // Render the shared text file
      res.render('view-shared-file.ejs', {
        fileName: fileName,
        folderName: rows.folderName,
        textFilePreview: textContent,
        fileData: null,
      });
    } else if (extension === '.mp4') {
      res.setHeader('Content-Type', 'video/mp4');
      res.send(rows.fileData);
    } else if (extension === '.mp3') {
      res.setHeader('Content-Type', 'audio/mp3');
      res.send(rows.fileData);
    } else {
      // Create a data URL from the file buffer
      // Convert file buffer to a base64 string for rendering
      const dataUrl = `data:image/jpeg;base64,${rows.fileData.toString(
        'base64'
      )}`;

      // Render the shared file
      res.render('view-shared-file.ejs', {
        fileName: fileName,
        folderName: rows.folderName,
        textFilePreview: null,
        fileData: dataUrl,
      });
    }
  });
};
