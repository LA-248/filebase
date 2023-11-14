import express from 'express';
import path from 'path';
import { promises as fs } from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Delete an uploaded file
/* 
:filename is a dynamic parameter that captures the name of the file to be deleted
The file name is sent from the frontend when the endpoint is hit
*/
router.delete('/deleteFile/:filename', async (req, res) => {
  try {
    // Retrieve the file path of the file to be deleted
    const filePath = path.join(__dirname, '../uploads', req.params.filename);
    // Remove the file at the specified path
    await fs.unlink(filePath);
    res.status(200).json(`File ${req.params.filename} was successfully deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

export default router;
