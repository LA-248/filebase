import { db } from '../services/database.mjs';

// Retrieve files associated with respective user from the database and display them
export const displayStoredFiles = (req, res) => {
  //  Fetches all columns from the files table where the userId column matches a specific user ID
  const query = 'SELECT f.fileName FROM files AS f WHERE f.userId = ?';
  // The 'rows' variable is used to store the result set returned by the database query
  db.all(query, [req.user.id], (err, rows) => {
    if (err) {
      res.status(500).send('Database error.');
    }

    // Render the home page with file information
    res.render('home.ejs', {
      uploadedFiles: rows,
      displayName: req.user.displayName,
    });
  });
};
