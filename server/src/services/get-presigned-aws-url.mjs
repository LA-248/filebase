import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const getPresignedUrl = async (bucketName, objectKey, contentType, expirationInSeconds) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    ResponseContentType: contentType,
  });

  try {
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expirationInSeconds,
    });
    return url;
  } catch (err) {
    console.error('Error generating presigned URL:', err);
  }
};

export { getPresignedUrl, s3Client };
