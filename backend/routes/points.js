const express = require('express');
const router = express.Router();
const db = require('../db');
const userService = require('../services/user');


// GET /points/total/:userid
// get total points of a student
router.get('/total/:userid', async function (req, res, next) {
    userid = req.params.userid;
    try {
        const rows = await db.query(
            `SELECT IFNULL(sum(points),0) as points FROM user u LEFT JOIN points p on u.id = p.userid where p.userid = ? GROUP BY u.id ORDER BY points DESC;`, [userid]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error(`Error in /points/total/:userid`, err.message);
        next(err);
    }
});

// GET /points/summary/:userid?range=week|month|all
// returns total points earned in the requested range (week = last 7 days, month = last 30 days, all = all time)
router.get('/summary/:userid', async function (req, res, next) {
    const userid = req.params.userid;
    const range = (req.query.range || 'all').toLowerCase();
    try {
        const result = await userService.getUserPointsByRange(userid, range);
        res.json(result);
    } catch (err) {
        console.error(`Error in /points/summary/:userid`, err.message);
        next(err);
    }
});

// GET /points/:userid
// get all point transactions (+ AND -) of a user
router.get('/:userid', async function (req, res, next) {
    userid = req.params.userid;
    try {
        const rows = await db.query(
            `SELECT points, date_created FROM points where userid = ?;`, [userid]
        );

        res.json(rows);
    } catch (err) {
        console.error(`Error in /points/:userid`, err.message);
        next(err);
    }
});

module.exports = router;