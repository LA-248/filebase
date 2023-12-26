import { db } from "../services/database.mjs";

// Render file previews in a new page
export const previewFile = (req, res) => {
  const query = 'SELECT f.fileData FROM files AS f WHERE f.fileName = ? AND f.userId = ?';

  db.get(query, [req.params.filename, req.user.id], (err, row) => {
    if (err) {
      res.status(500).send('Database error.');
    } else {
      // Create a data URL from the file buffer
      const dataUrl = `data:image/jpeg;base64,${row.fileData.toString('base64')}`;

      res.render('preview.ejs', { 
        fileName: req.params.filename,
        fileData: dataUrl,
      });
    }
  });
};
