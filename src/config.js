import dotenv from 'dotenv';

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER,
  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE,
  MYSQL_MAX_POOL: process.env.MYSQL_MAX_POOL,
  MYSQL_HOST: process.env.MYSQL_HOST,
  MYSQL_PORT: process.env.MYSQL_PORT,
  MYSQL_USER: process.env.MYSQL_USER,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
  PASSWORD_HASH_SALTINGROUNDS: process.env.PASSWORD_HASH_SALTINGROUNDS,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  VERIFICATION_JWT_EXPIRESIN: process.env.VERIFICATION_JWT_EXPIRESIN,
  // EMAIL: process.env.EMAIL,
  EMAIL: 'hermesplatformacc@gmail.com',
  // EMAIL_PWD: process.env.EMAIL_PWD
  EMAIL_PWD: 'Hermes123123!'
};
