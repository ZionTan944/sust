require('dotenv').config();
const fs = require('fs');
const mysql = require('mysql2/promise');
const path = require('path');

async function run() {
  const sqlPath = path.join(__dirname, '..', 'tablesNdata.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    port: process.env.MYSQL_PORT || 3306,
    multipleStatements: true,
  });

  try {
    console.log('Importing SQL...');
    await connection.query(sql);
    console.log('Import complete');
  } catch (err) {
    console.error('Error importing SQL', err.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

run();
