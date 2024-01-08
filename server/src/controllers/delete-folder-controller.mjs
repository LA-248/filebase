import { db } from '../services/database.mjs';

export const deleteFolder = (req, res) => {
  const query = 'DELETE FROM folders AS f WHERE f.folderName = ? AND f.userId = ?';

  db.get(query, [req.params.foldername, req.user.id], err => {
    if (err) {
      res.status(500).json('Database error.');
    } else {
      res.status(200).json('Folder was successfully deleted.');
      console.log(`Folder ${req.params.foldername} was successfully deleted`);
    }
  });
};
