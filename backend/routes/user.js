const express = require('express');
const router = express.Router();
const db = require('../db');


// GET /user/ranking
// get student rankings based on points earned (adds up points >=0, wont remove)
router.get('/ranking', async function (req, res, next) {
    try {
        const rows = await db.query(
            `SELECT u.username, u.faculty, IFNULL(sum(points),0) as points FROM user u LEFT JOIN points p on u.id = p.userid where ( isnull(points) OR points >= 0) GROUP BY u.username, u.faculty ORDER BY points DESC;`, []
        );

        res.json(rows);
    } catch (err) {
        console.error(`Error in /user/ranking`, err.message);
        next(err);
    }
});

// GET /user/ranking/:faculty
// get student rankings based on points earned (adds up points >=0, wont remove)
router.get('/ranking/:faculty', async function (req, res, next) {
    faculty = req.params.faculty;
    try {
        const rows = await db.query(
            `SELECT u.username, u.faculty, IFNULL(sum(points),0) as points FROM user u LEFT JOIN points p on u.id = p.userid where ( isnull(points) OR points >= 0) AND u.faculty = ? GROUP BY u.username, u.faculty ORDER BY points DESC;`, [faculty]
        );

        res.json(rows);
    } catch (err) {
        console.error(`Error in /ranking/faculty`, err.message);
        next(err);
    }
});

module.exports = router;