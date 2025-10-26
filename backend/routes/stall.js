const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /stall/ranking
// get stall rankings based on digestor usage
router.get('/ranking', async function (req, res, next) {
    try {
        const rows = await db.query(
            `SELECT s.id, s.name, s.shorten_location, COUNT(d.stallid) as count, COALESCE(SUM(CAST(d.weight AS DECIMAL(10,2))), 0) as total_weight FROM stall s LEFT JOIN digestor d ON s.id = d.stallid GROUP BY s.id, s.name, s.shorten_location ORDER BY total_weight DESC, count DESC;`, []
        );
        res.json(rows);
    } catch (err) {
        console.error(`Error in /stall/ranking`, err.message);
        next(err);
    }
});

// GET /stall/:stallid
// get individual stall details
router.get('/:stallid', async function (req, res, next) {
    stallid = req.params.stallid;
    try {
        const rows = await db.query(
            `SELECT * FROM stall where id = ?;`, [stallid]
        );

        res.json(rows[0])
    } catch (err) {
        console.error(`Error in /stall/:stallid`, err.message);
        next(err);
    }
});


module.exports = router;