import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'node:fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const deleteFile = async (req, res) => {
  try {
    // Retrieve the file path of the file to be deleted
    const filePath = path.join(__dirname, '../../uploads', req.params.filename);
    // Remove the file at the specified path
    await fs.unlink(filePath);
    res.status(200).json(`File ${req.params.filename} was successfully deleted`);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
};
