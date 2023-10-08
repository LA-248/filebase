import express from 'express';
import path from 'path';
import { promises as fs } from 'node:fs';

const router = express.Router();

// Delete an uploaded file
router.delete('/deleteFile/:filename', async (req, res) => {
  try {
    const filePath = path.join(`C:/Users/lucaa/Dropbox/Code/Projects/cloud-storage/server/uploads/${req.params.filename}`);
    // Remove the file at the specified path
    await fs.unlink(filePath);
    res.status(200).json(`File ${req.params.filename} was successfully deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

export default router;
