export const CONFIG = {
  PORT: process.env.PORT || 80,
  MONGO_URI: `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh',
  ACCESS_TOKEN_EXPIRATION:
    parseInt(process.env.ACCESS_TOKEN_EXPIRATION || '15') * 60 * 1000,
  REFRESH_TOKEN_EXPIRATION:
    parseInt(process.env.REFRESH_TOKEN_EXPIRATION || '43200') * 60 * 1000,
};
