import path from 'path';
import { db } from "../services/database.mjs";

// Handle file previews
export const previewFile = (req, res) => {
  const query = 'SELECT * FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

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
      res.send(rows.fileData);
    } else {
      // Create a data URL from the file buffer
      const dataUrl = `data:image/jpeg;base64,${rows.fileData.toString('base64')}`;
      
      // Render the preview in a separate page
      res.render('preview.ejs', { 
        fileName: req.params.filename,
        fileData: dataUrl,
      });
    }
  });
};
