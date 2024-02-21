import path from 'path';
import { db } from '../services/database.mjs';
import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Handle file previews
export const previewFile = async (req, res) => {
  const query = 'SELECT * FROM files AS f WHERE f.fileName = ? AND f.userId = ?';
  const fileData = await getPresignedUrl(process.env.BUCKET_NAME, req.params.filename, 3600);

  db.get(query, [req.params.filename, req.user.id], (err, rows) => {
    const fileName = rows.fileName;
    const extension = path.extname(fileName);
    console.log(fileName);
    console.log(extension);

    if (err) {
      res.status(500).send('Database error.');
      // If the file is a PDF, the browser will automatically display it using the built-in PDF viewer
    } else if (extension === '.pdf') {
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
    } else if (extension === '.mp4') {
      res.setHeader('Content-Type', 'video/mp4');
      res.send(fileData);
    } else if (extension === '.mp3') {
      res.setHeader('Content-Type', 'audio/mp3');
      res.send(fileData);
    } else {
      // Render the preview in a separate page
      res.render('preview.ejs', {
        fileName: fileName,
        folderName: rows.folderName,
        textFilePreview: null,
        fileData: fileData,
      });
    }
  });
};
