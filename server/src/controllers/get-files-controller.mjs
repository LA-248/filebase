import { db } from "../services/database.mjs";

// Retrieve files associated with respective user from the database and display them
export const getStoredUserFiles = (req, res) => {
  if (req.isAuthenticated()) {
    //  Fetches all columns from the files table where the userId column matches a specific user ID
    const query = 'SELECT f.* FROM files f WHERE f.userId = ?';

    db.all(query, [req.user.id], (err, rows) => {
      if (err) {
        res.status(500).send('Database error.');
      }

      // Render the home page with file information
      res.render('home.ejs', {
        uploadedFiles: rows,
      });
    });
  } else {
    res.redirect('/login');
  }
};
