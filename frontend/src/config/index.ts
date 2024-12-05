export const CONFIG = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://backend',
  PUBLIC_BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend.fbi.com',
  PUBLIC_S3_URL: process.env.NEXT_PUBLIC_S3_URL || 'http://s3.fbi.com/bucket',
};
