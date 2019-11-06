import dotenv from 'dotenv'
dotenv.config()

const config = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_EXPIRESINS: process.env.JWT_EXPIRESINS,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE,
    MYSQL_MAX_POOL: process.env.MYSQL_MAX_POOL,
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    PASSWORD_HASH_SALTINGROUNDS: process.env.PASSWORD_HASH_SALTINGROUNDS,
    JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
    JWT_ISSUER: process.env.JWT_ISSUER,
    JWT_SECRET: process.env.JWT_SECRET,
    COOKIE_SECRET: process.env.COOKIE_SECRET,
    VERIFICATION_JWT_EXPIRESIN: process.env.VERIFICATION_JWT_EXPIRESIN
}

export default { config }