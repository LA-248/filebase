import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function displayUploadedFiles() {
  const uploads = join(__dirname, '../uploads');
  let fileList = [];
  
  try {
    fileList = await fs.readdir(uploads);
    console.log(fileList);
  } catch (err) {
    console.error("Error reading directory:", err);
  }
  
  return fileList;
}
