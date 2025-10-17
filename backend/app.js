const express = require('express');
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const cors = require("cors");

dotenv.config();
const app = express()

const PORT = process.env.PORT || 3000;

const corsOptions = process.env.STATE === "local" ? { origin: ["http://localhost:5173"], credentials: true, optionsSuccessStatus: 200 } : { origin: true, credentials: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

const mysql_db = {
	host: process.env.MYSQL_HOST,
	database: process.env.MYSQL_DATABASE,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	port: process.env.MYSQL_PORT,
};

mysql.createPool(mysql_db);
// const connection = await mysql.createConnection(mysql_db);

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:3000')
})