const express = require('express');
const router = express.Router();
const db = require('../db');


// GET /points/total/:userid
// get total points of a student
router.get('/total/:userid', async function (req, res, next) {
    userid = req.params.userid;
    try {
        const rows = await db.query(
            `SELECT IFNULL(sum(points),0) as points FROM is463backend.user u LEFT JOIN is463backend.points p on u.id = p.userid where p.userid = ? GROUP BY u.id ORDER BY points DESC;`, [userid]
        );

        res.json(rows[0]);
    } catch (err) {
        console.error(`Error in /points/total/:userid`, err.message);
        next(err);
    }
});

// GET /points/:userid
// get all point transactions (+ AND -) of a user
router.get('/:userid', async function (req, res, next) {
    userid = req.params.userid;
    try {
        const rows = await db.query(
            `SELECT points, date_created FROM is463backend.points where userid = ?;`, [userid]
        );

        res.json(rows);
    } catch (err) {
        console.error(`Error in /points/:userid`, err.message);
        next(err);
    }
});

module.exports = router;