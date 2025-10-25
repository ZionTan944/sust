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

const challengeRouter = require('./routes/challenge');

// challenges
app.use('/challenges', challengeRouter);


// stall routes
app.use('/stall', stall);

// user routes
app.use('/user', user);

// get total points for an individual user
app.get('/user/:userid/points', async function (req, res, next) {
	const userid = req.params.userid;
	try {
		res.json(await user.getUserPoints(userid));
	} catch (err) {
		console.error(`Error while getting points for user ${userid} `, err.message);
		next(err);
	}
});


app.listen(PORT, () => {
	console.log('Server is running on http://localhost:3000')
})