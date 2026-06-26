import dotenv from 'dotenv';

dotenv.config({
    path: './.env'
})
export const PORT = process.env.PORT || 8000;
export const DB_NAME = process.env.DB_NAME ;