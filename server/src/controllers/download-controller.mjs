import { getPresignedUrl } from '../services/get-presigned-aws-url.mjs';

// Generate S3 presigned URL and send it as a response for file downloads
export const sendPresignedUrlForDownload = async (req, res) => {
  try {
    const fileData = await getPresignedUrl(process.env.BUCKET_NAME, req.params.filename, null, 3600);
    return res.status(200).json(fileData);
  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).send('There was an error when trying to download the file.');
  }
};
