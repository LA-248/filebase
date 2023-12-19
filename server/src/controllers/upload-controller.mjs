import storeFileInformation from '../models/files.mjs';
import { db } from '../services/database.mjs';

export const uploadFile = (req, res) => {
  if (req.isAuthenticated()) {
    // Retrieve user and file information on upload
    const userId = req.user.id;
    const fileName = req.file.originalname;
    const fileSizeBytes = req.file.size;
    const fileData = req.file.buffer;

    // Convert file size from bytes to megabytes
    const fileSize = (fileSizeBytes / (1024 * 1024)).toFixed(2);

    // Store the retrieved information in the database
    storeFileInformation(userId, fileName, fileSize, fileData);

    // Fetch the last file uploaded
    const query = 'SELECT f.fileName FROM files AS F ORDER BY userId DESC LIMIT 1';
    db.get(query, (err, latestFile) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Error fetching latest file');
      } else {
        console.log(userId, fileName, fileSize, fileData);
        res.json({ message: 'File uploaded successfully!', latestFile });
      }
    });

    console.log(userId, fileName, fileSize, fileData);
  } else {
    res.status(401).send('User not authenticated');
  }
};
