const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    DATABASE: process.env.DATABASE,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_USER: process.env.DATABASE_USER,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    PORT: process.env.PORT
}