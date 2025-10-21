const mysql = require('mysql2/promise');
require("dotenv").config();

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    port: process.env.MYSQL_PORT,
  });
  const [results,] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

module.exports = {
  query
}