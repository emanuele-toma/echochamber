export const CONFIG = {
  // SERVER
  PORT: process.env.PORT || 80,

  // MONGO
  MONGO_URI: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,

  // JWT
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh',
  ACCESS_TOKEN_EXPIRATION:
    parseInt(process.env.ACCESS_TOKEN_EXPIRATION || '15') * 60,
  REFRESH_TOKEN_EXPIRATION:
    parseInt(process.env.REFRESH_TOKEN_EXPIRATION || '43200') * 60,

  // S3
  S3_ENDPOINT: process.env.S3_ENDPOINT || 'http://localhost:9000',
  S3_BUCKET: process.env.S3_BUCKET || 'bucket',
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY || 'access_key',
  S3_SECRET_KEY: process.env.S3_SECRET_KEY || 'secret_key',
};
