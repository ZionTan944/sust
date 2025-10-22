const express = require('express');
const dotenv = require("dotenv");
const mysql = require("mysql2/promise");
const cors = require("cors");

dotenv.config();
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 3000;

const corsOptions = process.env.STATE === "local" ? { origin: ["http://localhost:5173"], credentials: true, optionsSuccessStatus: 200 } : { origin: true, credentials: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

const authRouter = require('./routes/auth');
const digestor = require('./routes/digestor');
const stall = require('./routes/stall');
const user = require('./routes/user');
const points = require('./routes/points');

app.get('/', (req, res) => {
	res.send('Hello World')
})

// auth routes
app.use('/auth', authRouter);

// digestor routes
app.use('/digestor', digestor);

// stall routes
app.use('/stall', stall);

// user routes
app.use('/user', user);

// points routes
app.use('/points', points);

app.listen(PORT, () => {
	console.log('Server is running on http://localhost:3000')
})