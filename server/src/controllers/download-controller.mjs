import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Generate S3 presigned URL and send it as a response for file downloads
export const sendPresignedUrlForDownload = async (req, res) => {
  try {
    const fileData = await getPresignedUrl(process.env.BUCKET_NAME, req.params.filename, null, 3600);
    return res.status(200).json(fileData);
  } catch (error) {
    console.error('Error downloading file:', error.message);
    return res.status(500).json({ message: 'Error downloading file. Please try again.' });
  }
};
