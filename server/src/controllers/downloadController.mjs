import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const downloadFile = (req, res) => {
  try {
    const filePath = path.join(__dirname, '../../uploads', req.params.filename);
    console.log(filePath);
    res.download(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
};
