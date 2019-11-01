import mysql from 'mysql';
import dotenv from 'dotenv';
dotenv.config();

// Burada yogunluga bagli olarak pool kullanilabilir, bakilacak

const connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DATABASE
});

export default connection;
