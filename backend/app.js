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

const digestor = require('./services/digestor');
const stall = require('./services/stall');
const user = require('./services/user');
const authRouter = require('./routes/auth');

app.get('/', (req, res) => {
	res.send('Hello World')
})

// auth routes
app.use('/auth', authRouter);

const challengeRouter = require('./routes/challenge');

// challenges
app.use('/challenges', challengeRouter);



// digestor

// get total digestor usage
app.get('/digestor', async function (req, res, next) {
	try {
		res.json(await digestor.getTotalDigestor());
	} catch (err) {
		console.error(`Error while getting total digestor usage `, err.message);
		next(err);
	}
});

// create digestor usage
app.post('/digestor', async function (req, res, next) {

	if (!req.body || !req.body.stallid) {
		return res.status(400).send("Missing stallid");
	}

	stallid = req.body.stallid;
	try {
		res.json(await digestor.createDigestorUsage(stallid));
	} catch (err) {
		console.error(`Error while getting total digestor usage `, err.message);
		next(err);
	}
});

// stall

// get stall rankings based on digestor usage
app.get('/stall/ranking', async function (req, res, next) {
	try {
		res.json(await stall.getStallRankings());
	} catch (err) {
		console.error(`Error while getting stall rankings `, err.message);
		next(err);
	}
});

// get individual stall details
app.get('/stall/:stallid', async function (req, res, next) {
	stallid = req.params.stallid;
	try {
		res.json(await stall.getIndividualStall(stallid));
	} catch (err) {
		console.error(`Error while getting individual stall details `, err.message);
		next(err);
	}
});

// user

// get student rankings based on points
app.get('/user/ranking', async function (req, res, next) {
	try {
		res.json(await user.getAllStudentPoints());
	} catch (err) {
		console.error(`Error while getting user point rankings `, err.message);
		next(err);
	}
});

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