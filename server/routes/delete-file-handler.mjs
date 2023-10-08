import express from 'express';
import { promises as fs } from 'node:fs';

const router = express.Router();

// Delete an uploaded file
router.delete('/deleteFile', async (req, res) => {
  try {
    // Remove the file specified
    await fs.unlink('C:/Users/lucaa/Dropbox/Code/Projects/cloud-storage/server/uploads/windows-11.jpg');
    res.status(200).send('The file was successfully deleted');
  } catch (error) {
    console.error(error);
  }
});

export default router;
