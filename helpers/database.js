const mariadb = require("mariadb");
const dotenv = require("dotenv");
dotenv.config();

const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 10,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.log(err);
  }

  if (connection) {
    connection.release();
  }
  return;
});

module.exports = pool;
