export const CONFIG = {
  BACKEND_URL: process.env.BACKEND_URL || 'http://backend',
  PUBLIC_BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend.fbi.com',
  PUBLIC_CDN_URL:
    process.env.NEXT_PUBLIC_CDN_URL || 'http://cdn.fbi.com/bucket',
};
